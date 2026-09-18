import 'server-only';
import { createHash } from 'node:crypto';
import { cookies } from 'next/headers';
import { storefront } from './client';
import { CommerceError } from './errors';
import { CART, CART_CREATE, CART_LINES_ADD, CART_LINES_REMOVE, CART_LINES_UPDATE } from './queries';

type LineInput = { merchandiseId: string; quantity: number };
export type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: {
    nodes: { id: string; quantity: number; merchandise: { id: string } }[];
    pageInfo: { hasNextPage: boolean };
  };
};
type MutationResult = {
  cart: ShopifyCart | null;
  userErrors: { message: string }[];
  warnings: { message: string }[];
};
function assertComplete(cart: ShopifyCart) {
  if (cart.lines.pageInfo.hasNextPage) throw new CommerceError('cart_limit', 'Este carrito tiene demasiadas presentaciones para continuar.', 422);
}
function matches(cart: ShopifyCart, desired: LineInput[]) {
  const actual = new Map<string, number>();
  for (const line of cart.lines.nodes) actual.set(line.merchandise.id, (actual.get(line.merchandise.id) ?? 0) + line.quantity);
  return actual.size === desired.length && desired.every(line => actual.get(line.merchandiseId) === line.quantity);
}

/** Called only by a Server Action: opaque cart ID + key never reach props or localStorage. */
export async function syncCheckoutCart(lines: LineInput[]): Promise<string> {
  const jar = await cookies();
  // Switching development stores must not reuse a cookie from another shop.
  const shop = createHash('sha256').update(process.env.SHOPIFY_STORE_DOMAIN?.trim() || '').digest('hex').slice(0, 12);
  const cookieName = `amoramar-cart-${shop}`;
  const persist = (cart: ShopifyCart) => {
    jar.set(cookieName, cart.id, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax',
      path: '/', maxAge: 60 * 60 * 24 * 10,
    });
  };
  const mutation = async (document: string, key: string, variables: Record<string, unknown>) => {
    const result = (await storefront<Record<string, MutationResult>>(document, variables))[key];
    // Save even partially accepted carts: a warning must not cause duplicate creates on retry.
    if (result.cart) persist(result.cart);
    if (result.userErrors.length || result.warnings.length || !result.cart) {
      // Do not forward raw upstream messages, which may include IDs or sensitive context.
      throw new CommerceError('cart_rejected', 'La tienda no pudo aceptar todas las presentaciones o cantidades. Revisa tu carrito.', 422);
    }
    assertComplete(result.cart);
    return result.cart;
  };
  const id = jar.get(cookieName)?.value;
  let cart: ShopifyCart | null = id ? (await storefront<{ cart: ShopifyCart | null }>(CART, { id })).cart : null;
  if (!cart) {
    // Only null means expired/nonexistent. Network/auth errors propagate without recreating.
    if (id) jar.delete(cookieName);
    cart = await mutation(CART_CREATE, 'cartCreate', { input: { lines, buyerIdentity: { countryCode: 'MX' } } });
  } else {
    assertComplete(cart);
    const desired = new Map(lines.map(line => [line.merchandiseId, line.quantity]));
    const seen = new Set<string>();
    const remove: string[] = [];
    const update: { id: string; quantity: number }[] = [];
    for (const line of cart.lines.nodes) {
      const quantity = desired.get(line.merchandise.id);
      if (quantity === undefined || seen.has(line.merchandise.id)) remove.push(line.id);
      else {
        seen.add(line.merchandise.id);
        if (line.quantity !== quantity) update.push({ id: line.id, quantity });
      }
    }
    if (remove.length) cart = await mutation(CART_LINES_REMOVE, 'cartLinesRemove', { cartId: cart.id, lineIds: remove });
    if (update.length) cart = await mutation(CART_LINES_UPDATE, 'cartLinesUpdate', { cartId: cart.id, lines: update });
    const add = lines.filter(line => !seen.has(line.merchandiseId));
    if (add.length) cart = await mutation(CART_LINES_ADD, 'cartLinesAdd', { cartId: cart.id, lines: add });
  }
  // Re-read immediately before redirecting, including the current checkout URL.
  const final = (await storefront<{ cart: ShopifyCart | null }>(CART, { id: cart.id })).cart;
  if (!final) {
    jar.delete(cookieName);
    throw new CommerceError('cart_expired', 'Tu carrito expiró. Tus productos siguen aquí; vuelve a intentar el pago.', 422);
  }
  assertComplete(final);
  if (!matches(final, lines)) throw new CommerceError('cart_changed', 'Cambió la disponibilidad. Revisa las cantidades de tu carrito.', 422);
  const url = new URL(final.checkoutUrl);
  if (url.protocol !== 'https:' || url.username || url.password) throw new CommerceError('invalid_checkout', 'No pudimos abrir el pago seguro.', 502);
  persist(final);
  return final.checkoutUrl;
}
