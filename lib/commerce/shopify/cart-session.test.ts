import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const jar = vi.hoisted(() => ({ get: vi.fn(), set: vi.fn(), delete: vi.fn() }));
vi.mock('next/headers', () => ({ cookies: async () => jar }));
vi.mock('./client', () => ({ storefront: vi.fn() }));
import { storefront } from './client';
import { syncCheckoutCart, type ShopifyCart } from './cart-session';
import { CART, CART_CREATE, CART_LINES_ADD, CART_LINES_REMOVE, CART_LINES_UPDATE } from './queries';
const request = vi.mocked(storefront);
const v = (n: number) => `gid://shopify/ProductVariant/${n}`;
const selection = [{ merchandiseId: v(1), quantity: 2 }];
function cart(entries = [[1, 2]]): ShopifyCart {
  return { id: 'opaque-cart?key=secret', checkoutUrl: 'https://test.myshopify.com/checkouts/example', totalQuantity: entries.reduce((s, [,q]) => s+q,0),
    lines: { nodes: entries.map(([n,quantity]) => ({ id: `line-${n}`, quantity, merchandise: { id: v(n) } })), pageInfo: { hasNextPage: false } } };
}
const mutation = (key: string, value = cart()) => ({ [key]: { cart: value, userErrors: [], warnings: [] } });
beforeEach(() => { vi.resetAllMocks(); vi.stubEnv('SHOPIFY_STORE_DOMAIN', 'test.myshopify.com'); vi.stubEnv('NODE_ENV', 'production'); });
afterEach(() => vi.unstubAllEnvs());
describe('persistent Shopify checkout', () => {
  it('creates once and keeps the complete secret ID exclusively in an HttpOnly cookie', async () => {
    request.mockResolvedValueOnce(mutation('cartCreate')).mockResolvedValueOnce({ cart: cart() });
    expect(await syncCheckoutCart(selection)).toBe(cart().checkoutUrl);
    expect(request.mock.calls[0]).toEqual([CART_CREATE, { input: { lines: selection, buyerIdentity: { countryCode: 'MX' } } }]);
    expect(jar.set).toHaveBeenCalledWith(expect.stringMatching(/^amoramar-cart-/), cart().id, expect.objectContaining({ httpOnly: true, secure: true, sameSite: 'lax', path: '/' }));
  });
  it('reuses an unchanged cart without mutations and retrieves a fresh checkout URL', async () => {
    jar.get.mockReturnValue({ value: cart().id });
    request.mockResolvedValueOnce({ cart: cart() }).mockResolvedValueOnce({ cart: { ...cart(), checkoutUrl: 'https://test.myshopify.com/checkouts/fresh' } });
    expect(await syncCheckoutCart(selection)).toContain('/fresh');
    expect(request.mock.calls.map(c => c[0])).toEqual([CART, CART]);
    expect(request.mock.calls[0][1]).toEqual({ id: cart().id });
  });
  it('removes stale variants, updates quantities and adds missing variants', async () => {
    jar.get.mockReturnValue({ value: cart().id });
    request.mockResolvedValueOnce({ cart: cart([[1,1],[2,3]]) })
      .mockResolvedValueOnce(mutation('cartLinesRemove',cart([[1,1]])))
      .mockResolvedValueOnce(mutation('cartLinesUpdate',cart()))
      .mockResolvedValueOnce(mutation('cartLinesAdd',cart([[1,2],[3,1]])))
      .mockResolvedValueOnce({ cart: cart([[1,2],[3,1]]) });
    await syncCheckoutCart([...selection, { merchandiseId: v(3), quantity: 1 }]);
    expect(request.mock.calls.map(c => c[0])).toEqual([CART, CART_LINES_REMOVE, CART_LINES_UPDATE, CART_LINES_ADD, CART]);
    expect(request.mock.calls[1][1]).toEqual({ cartId: cart().id, lineIds: ['line-2'] });
    expect(request.mock.calls[2][1]).toEqual({ cartId: cart().id, lines: [{ id: 'line-1', quantity: 2 }] });
  });
  it('recreates only a genuinely missing or expired cart', async () => {
    jar.get.mockReturnValue({ value: 'expired' });
    request.mockResolvedValueOnce({ cart: null }).mockResolvedValueOnce(mutation('cartCreate')).mockResolvedValueOnce({ cart: cart() });
    await syncCheckoutCart(selection);
    expect(jar.delete).toHaveBeenCalledOnce();
    expect(request.mock.calls[1][0]).toBe(CART_CREATE);
  });
  it('does not recreate after a transport error with ambiguous remote state', async () => {
    jar.get.mockReturnValue({ value: cart().id });
    request.mockRejectedValueOnce(new Error('timeout'));
    await expect(syncCheckoutCart(selection)).rejects.toThrow('timeout');
    expect(request).toHaveBeenCalledOnce();
    expect(jar.delete).not.toHaveBeenCalled();
  });
  it('preserves partially accepted carts but stops on warnings without leaking upstream context', async () => {
    request.mockResolvedValueOnce({ cartCreate: { cart: cart([[1,1]]), userErrors: [], warnings: [{ message: 'key=private' }] } });
    await expect(syncCheckoutCart(selection)).rejects.toThrow('Revisa tu carrito');
    expect(jar.set).toHaveBeenCalledOnce();
    expect(request).toHaveBeenCalledOnce();
  });
  it('compares variant identities, not just total quantity', async () => {
    request.mockResolvedValueOnce(mutation('cartCreate',cart([[2,2]]))).mockResolvedValueOnce({ cart: cart([[2,2]]) });
    await expect(syncCheckoutCart(selection)).rejects.toThrow('disponibilidad');
  });
  it('fails closed when pagination would hide cart lines', async () => {
    jar.get.mockReturnValue({ value: cart().id });
    request.mockResolvedValueOnce({ cart: { ...cart(), lines: { ...cart().lines, pageInfo: { hasNextPage: true } } } });
    await expect(syncCheckoutCart(selection)).rejects.toThrow('demasiadas presentaciones');
    expect(request).toHaveBeenCalledOnce();
  });
  it('never redirects to an insecure checkout', async () => {
    request.mockResolvedValueOnce(mutation('cartCreate')).mockResolvedValueOnce({ cart: { ...cart(), checkoutUrl: 'http://example.com' } });
    await expect(syncCheckoutCart(selection)).rejects.toThrow('pago seguro');
  });
});
