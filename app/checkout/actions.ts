'use server';
import { redirect } from 'next/navigation';
import { storefront } from '@/lib/commerce/shopify/client';
import { CART_CREATE } from '@/lib/commerce/shopify/queries';
import { CommerceError } from '@/lib/commerce/shopify/errors';
import { checkoutLines } from '@/lib/commerce/shopify/checkout-input';
export type CheckoutState = { error: string | null };
export async function beginCheckout(_previous: CheckoutState, form: FormData): Promise<CheckoutState> {
  let url: string;
  try {
    const raw = String(form.get('lines') ?? '[]');
    if (raw.length > 25000) return { error: 'El carrito es demasiado grande.' };
    const lines = checkoutLines(JSON.parse(raw));
    const result = await storefront<{ cartCreate: {
      cart: { checkoutUrl: string; totalQuantity: number } | null;
      userErrors: { message: string }[]; warnings: { message: string }[];
    } }>(CART_CREATE, { input: { lines, buyerIdentity: { countryCode: 'MX' } } });
    const payload = result.cartCreate;
    if (payload.userErrors.length || payload.warnings.length || !payload.cart) {
      return { error: payload.userErrors[0]?.message || payload.warnings[0]?.message || 'No se pudo iniciar el pago.' };
    }
    if (payload.cart.totalQuantity !== lines.reduce((sum, line) => sum + line.quantity, 0)) {
      return { error: 'Cambió la disponibilidad. Revisa las cantidades de tu carrito.' };
    }
    url = payload.cart.checkoutUrl;
    if (new URL(url).protocol !== 'https:') throw new Error('Invalid checkout URL');
  } catch (error) {
    return { error: error instanceof CommerceError ? error.message : 'No pudimos iniciar el pago. Revisa tu carrito e inténtalo de nuevo.' };
  }
  // Shopify is the authority for prices, shipping, payment and order creation.
  // No order is asserted or local cart cleared before payment.
  redirect(url);
}
