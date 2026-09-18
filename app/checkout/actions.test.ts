import { beforeEach, expect, it, vi } from 'vitest';
vi.mock('@/lib/commerce/shopify/cart-session', () => ({ syncCheckoutCart: vi.fn() }));
vi.mock('next/navigation', () => ({ redirect: vi.fn((url: string) => { throw new Error(`REDIRECT:${url}`); }) }));
import { syncCheckoutCart } from '@/lib/commerce/shopify/cart-session';
import { CommerceError } from '@/lib/commerce/shopify/errors';
import { beginCheckout } from './actions';
const sync = vi.mocked(syncCheckoutCart);
const form = () => { const data = new FormData(); data.set('lines', JSON.stringify([{ productId: 'gid://shopify/ProductVariant/42', quantity: 2, price: 1 }])); return data; };
beforeEach(() => vi.resetAllMocks());
it('redirects after synchronization and strips client prices', async () => {
  sync.mockResolvedValue('https://test.myshopify.com/checkouts/example');
  await expect(beginCheckout({ error: null }, form())).rejects.toThrow('REDIRECT:https://');
  expect(sync).toHaveBeenCalledWith([{ merchandiseId: 'gid://shopify/ProductVariant/42', quantity: 2 }]);
});
it('returns safe availability errors without redirecting', async () => {
  sync.mockRejectedValue(new CommerceError('cart_changed', 'Revisa las cantidades.', 422));
  expect(await beginCheckout({ error: null }, form())).toEqual({ error: 'Revisa las cantidades.' });
});
it('rejects malformed input before calling Shopify', async () => {
  const data = new FormData(); data.set('lines', '{');
  expect((await beginCheckout({ error: null }, data)).error).toBeTruthy();
  expect(sync).not.toHaveBeenCalled();
});
it('does not expose unexpected errors or secrets', async () => {
  sync.mockRejectedValue(new Error('key=private'));
  expect((await beginCheckout({ error: null }, form())).error).not.toContain('private');
});
