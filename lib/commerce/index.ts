import 'server-only';
import { cache } from 'react';
import { unstable_rethrow } from 'next/navigation';
import type { Bundle, Collection, Product, ShelfItem } from './types';
import { storefront, isShopifyConfigured } from './shopify/client';
import { normalizeProduct, type ShopifyProduct } from './shopify/normalize';
import { PRODUCTS, PRODUCT, COLLECTION_PRODUCTS, COLLECTIONS } from './shopify/queries';
import { CommerceError } from './shopify/errors';
export * from './types';
export * from './constants';
export { CommerceError } from './shopify/errors';

type Connection<T> = { nodes: T[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } };
async function allPages<T>(load: (after: string | null) => Promise<Connection<T>>): Promise<T[]> {
  const items: T[] = [];
  let after: string | null = null;
  // Guard against malformed upstream cursors. Never silently truncate a catalog.
  for (let page = 0; page < 100; page++) {
    const result = await load(after);
    items.push(...result.nodes);
    if (!result.pageInfo.hasNextPage) return items;
    if (!result.pageInfo.endCursor || result.pageInfo.endCursor === after) break;
    after = result.pageInfo.endCursor;
  }
  throw new CommerceError('pagination_limit', 'No pudimos cargar el catálogo completo.', 502);
}
const catalog = cache(async (collection?: string, query?: string) => {
  if (!isShopifyConfigured()) return [];
  const raw = await allPages<ShopifyProduct>(async after => {
    if (collection) {
      const result = await storefront<{ collection: { products: Connection<ShopifyProduct> } | null }>(COLLECTION_PRODUCTS, { handle: collection, after });
      return result.collection?.products ?? { nodes: [], pageInfo: { hasNextPage: false, endCursor: null } };
    }
    const result = await storefront<{ products: Connection<ShopifyProduct> }>(PRODUCTS, { after, query: query || null });
    return result.products;
  });
  const products = raw.map(normalizeProduct);
  return collection && query ? products.filter(p => p.name.toLocaleLowerCase('es-MX').includes(query.toLocaleLowerCase('es-MX'))) : products;
});
export async function getProducts(options?: { collection?: string; query?: string; page?: number }) {
  const items = await catalog(options?.collection, options?.query);
  return { items, total: items.length, totalPages: 1 };
}
export const getProduct = cache(async (handle: string): Promise<Product | null> => {
  if (!isShopifyConfigured()) return null;
  const data = await storefront<{ product: ShopifyProduct | null }>(PRODUCT, { handle });
  return data.product ? normalizeProduct(data.product) : null;
});
export async function getFeaturedProducts(limit = 3) {
  return (await catalog()).filter(p => p.featured).slice(0, limit);
}
export async function getProductsByCollection(handle: string) { return catalog(handle); }
export const getCollections = cache(async (): Promise<Collection[]> => {
  if (!isShopifyConfigured()) return [];
  const nodes = await allPages<{ handle: string; title: string }>(async after => {
    return (await storefront<{ collections: Connection<{ handle: string; title: string }> }>(COLLECTIONS, { after })).collections;
  });
  return nodes.map(c => ({ ...c, showInNav: true }));
});
export async function getNavCollections() {
  try { return await getCollections(); }
  catch (error) { unstable_rethrow(error); return []; }
}
export async function getShelf(): Promise<ShelfItem[]> {
  return (await getCollections()).map(c => ({ kind: 'category', handle: c.handle, title: c.title, tagline: null, image: null, itemCount: null }));
}
// Legacy bundles had no SKU of their own. Their migration requires a merchandising decision.
export async function getPackage(_handle: string): Promise<Bundle | null> { return null; }
export async function getProductRecommendations(handle: string) {
  return (await catalog()).filter(p => p.handle !== handle && p.availableForSale).slice(0, 4);
}
