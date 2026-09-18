import type { Product, Money } from '../types';
import { CommerceError } from './errors';
export type ShopifyProduct = {
  id: string; handle: string; title: string; description: string; productType: string;
  tags: string[]; availableForSale: boolean;
  seo: { title: string | null; description: string | null };
  featuredImage: { url: string; altText: string | null } | null;
  images: { nodes: { url: string; altText: string | null }[] };
  variants: { nodes: { id: string; title: string; availableForSale: boolean; price: { amount: string; currencyCode: string } }[]; pageInfo: { hasNextPage: boolean } };
  metafields: ({ key: string; value: string } | null)[];
};
export function money(value: { amount: string; currencyCode: string }): Money {
  if (value.currencyCode !== 'MXN' || !/^\d+(\.\d{1,2})?$/.test(value.amount)) {
    throw new CommerceError('unsupported_price', 'Configura el mercado México con precios en MXN.', 502);
  }
  const [whole, fraction = ''] = value.amount.split('.');
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  if (!Number.isSafeInteger(cents)) throw new CommerceError('invalid_price', 'Precio fuera de rango.', 502);
  return { amountCents: cents, currency: 'MXN' };
}
export function normalizeProduct(raw: ShopifyProduct): Product {
  if (raw.variants.pageInfo.hasNextPage) throw new CommerceError('variant_limit', 'Este producto requiere paginación adicional de variantes.', 502);
  const variants = raw.variants.nodes.map(v => ({
    id: v.id, title: v.title, availableForSale: v.availableForSale,
    // UI limit, never a stock claim. Shopify validates availability at checkout.
    available: v.availableForSale ? 99 : 0,
    price: money(v.price),
  }));
  const selected = variants.find(v => v.availableForSale) ?? variants[0];
  if (!selected) throw new CommerceError('no_variants', 'Producto sin presentaciones.', 502);
  const fields = Object.fromEntries(raw.metafields.filter(v => v !== null).map(v => [v.key, v.value]));
  const unit = fields.unit;
  const image = (v: { url: string; altText: string | null }) => ({ url: v.url, altText: v.altText || raw.title });
  return {
    id: raw.id, merchandiseId: selected.id, handle: raw.handle, name: raw.title,
    description: raw.description, shortDescription: null,
    category: raw.productType || null, collections: [],
    featuredImage: raw.featuredImage ? image(raw.featuredImage) : null,
    images: raw.images.nodes.map(image), price: selected.price,
    unit: unit === 'kg' || unit === 'pack' || unit === 'dozen' ? unit : 'piece',
    netWeightGrams: null, origin: fields.origin || null, presentation: fields.presentation || null,
    availableForSale: selected.availableForSale, available: selected.available,
    featured: raw.tags.includes('featured'), seasonal: raw.tags.includes('seasonal'),
    featuredItem: raw.tags.includes('catch-of-the-week'),
    preparationSuggestions: [], storageInstructions: fields.storage_instructions || null,
    variants, seo: { title: raw.seo.title || raw.title, description: raw.seo.description },
    supply: { type: 'unspecified', label: 'Selección de la casa', notice: null, shortNotice: null, arrivesOn: null, orderBy: null },
  };
}
