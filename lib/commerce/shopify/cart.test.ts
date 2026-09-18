import { it, expect } from 'vitest';
import { addLine } from '@/lib/cart';
import { normalizeProduct, type ShopifyProduct } from './normalize';
const raw: ShopifyProduct = {
  id: 'gid://shopify/Product/1', handle: 'atun', title: 'Atún', description: '', productType: 'Pescado', tags: [], availableForSale: true,
  seo: { title: null, description: null }, featuredImage: null, images: { nodes: [] }, metafields: [],
  variants: { pageInfo: { hasNextPage: false }, nodes: [
    { id: 'gid://shopify/ProductVariant/10', title: '250g', availableForSale: true, price: { amount: '120.00', currencyCode: 'MXN' } },
    { id: 'gid://shopify/ProductVariant/11', title: '500g', availableForSale: true, price: { amount: '240.00', currencyCode: 'MXN' } },
  ] },
};
it('keeps two presentations distinct and preserves selected price', () => {
  const product = normalizeProduct(raw);
  const cart = addLine({ lines: [] }, product, 1);
  const second = { ...product, merchandiseId: product.variants[1].id, price: product.variants[1].price };
  const updated = addLine(cart, second, 2);
  expect(updated.lines.map(l => [l.productId, l.unitPrice.amountCents, l.quantity])).toEqual([
    ['gid://shopify/ProductVariant/10', 12000, 1], ['gid://shopify/ProductVariant/11', 24000, 2],
  ]);
  expect(addLine(updated, second, 1).lines[1].quantity).toBe(3);
});
it('selects a sellable default and never asserts freshness without metadata', () => {
  const product = normalizeProduct({ ...raw, variants: { ...raw.variants, nodes: [{ ...raw.variants.nodes[0], availableForSale: false }, raw.variants.nodes[1]] } });
  expect(product.merchandiseId).toBe('gid://shopify/ProductVariant/11');
  expect(product.supply?.type).toBe('unspecified');
  expect(product.featuredImage).toBeNull();
});
it('rejects truncated variants rather than silently hiding sellable choices', () => {
  expect(() => normalizeProduct({ ...raw, variants: { ...raw.variants, pageInfo: { hasNextPage: true } } })).toThrow();
});

it('uses availability without requiring or exposing exact inventory', () => {
  const product = normalizeProduct(raw);
  expect(product.availableForSale).toBe(true);
  expect(product.available).toBe(99); // UI cap, not stock.
  const soldOut = normalizeProduct({ ...raw, variants: { ...raw.variants, nodes: raw.variants.nodes.map(v => ({ ...v, availableForSale: false })) } });
  expect(soldOut.availableForSale).toBe(false);
  expect(soldOut.available).toBe(0);
});
