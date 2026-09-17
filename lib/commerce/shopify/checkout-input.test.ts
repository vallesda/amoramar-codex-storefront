import { describe, it, expect } from 'vitest';
import { checkoutLines } from './checkout-input';
import { money } from './normalize';
describe('Shopify checkout boundary', () => {
  const id = 'gid://shopify/ProductVariant/123';
  it('only forwards merchandise and quantity; ignores tampered prices', () => {
    expect(checkoutLines([{ productId: id, quantity: 2, price: 1 }])).toEqual([{ merchandiseId: id, quantity: 2 }]);
  });
  it('rejects product IDs, malformed quantities and empty carts', () => {
    for (const input of [[], null, [{ productId: 'gid://shopify/Product/123', quantity: 1 }], [{ productId: id, quantity: -1 }], [{ productId: id, quantity: 1.5 }]]) expect(() => checkoutLines(input)).toThrow();
  });
  it('merges duplicates and checks aggregate quantity', () => {
    expect(checkoutLines([{ productId: id, quantity: 2 }, { productId: id, quantity: 3 }])).toEqual([{ merchandiseId: id, quantity: 5 }]);
    expect(() => checkoutLines([{ productId: id, quantity: 99 }, { productId: id, quantity: 1 }])).toThrow();
  });
  it('converts decimal MXN exactly and refuses to relabel another currency', () => {
    expect(money({ amount: '19.90', currencyCode: 'MXN' }).amountCents).toBe(1990);
    expect(() => money({ amount: '19.90', currencyCode: 'USD' })).toThrow();
    expect(() => money({ amount: 'NaN', currencyCode: 'MXN' })).toThrow();
  });
});
