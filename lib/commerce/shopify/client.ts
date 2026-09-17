import 'server-only';
import { connection } from 'next/server';
import { CommerceError } from './errors';

export function isShopifyConfigured() {
  return Boolean(process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN);
}

export async function storefront<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  await connection();
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const version = process.env.SHOPIFY_API_VERSION || '2026-07';
  if (!domain || !token) throw new CommerceError('not_configured', 'La tienda todavía no está conectada.', 503);
  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(domain) || !/^20\d{2}-(01|04|07|10)$/.test(version)) {
    throw new CommerceError('invalid_config', 'La configuración de Shopify no es válida.', 503);
  }
  let response: Response;
  try {
    response = await fetch(`https://${domain}/api/${version}/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': token },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    });
  } catch {
    throw new CommerceError('unavailable', 'No pudimos contactar con la tienda. Inténtalo de nuevo.', 503);
  }
  const payload = await response.json().catch(() => null) as { data?: T; errors?: unknown[] } | null;
  if (!response.ok || !payload?.data || payload.errors?.length) {
    throw new CommerceError('upstream_error', 'La tienda no pudo completar la consulta.', 502);
  }
  return payload.data;
}
