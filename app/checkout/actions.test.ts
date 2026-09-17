import { beforeEach, expect, it, vi } from 'vitest';
vi.mock('@/lib/commerce/shopify/client', () => ({ storefront: vi.fn() }));
vi.mock('next/navigation', () => ({ redirect: vi.fn((url: string) => { throw new Error(`REDIRECT:${url}`); }) }));
import { storefront } from '@/lib/commerce/shopify/client';
import { beginCheckout } from './actions';
const request = vi.mocked(storefront);
const form = () => { const data = new FormData(); data.set('lines', JSON.stringify([{ productId: 'gid://shopify/ProductVariant/42', quantity: 2, price: 1 }])); return data; };
beforeEach(() => vi.clearAllMocks());
it('redirects only after Shopify accepts the full cart and omits client prices', async () => {
  request.mockResolvedValue({ cartCreate: { cart: { checkoutUrl: 'https://test.myshopify.com/checkouts/example', totalQuantity: 2 }, userErrors: [], warnings: [] } });
  await expect(beginCheckout({ error: null }, form())).rejects.toThrow('REDIRECT:https://');
  expect(request.mock.calls[0][1]).toEqual({ input: { lines: [{ merchandiseId: 'gid://shopify/ProductVariant/42', quantity: 2 }], buyerIdentity: { countryCode: 'MX' } } });
});
it('does not silently proceed after stock warnings or removed quantities', async () => {
  request.mockResolvedValue({ cartCreate: { cart: { checkoutUrl: 'https://example.com', totalQuantity: 1 }, userErrors: [], warnings: [{ message: 'Stock insuficiente' }] } });
  expect(await beginCheckout({ error: null }, form())).toEqual({ error: 'Stock insuficiente' });
  request.mockResolvedValue({ cartCreate: { cart: { checkoutUrl: 'https://example.com', totalQuantity: 1 }, userErrors: [], warnings: [] } });
  expect((await beginCheckout({ error: null }, form())).error).toContain('disponibilidad');
});
it('handles malformed input before calling Shopify', async () => {
  const data = new FormData(); data.set('lines', '{');
  expect((await beginCheckout({ error: null }, data)).error).toBeTruthy();
  expect(request).not.toHaveBeenCalled();
});
