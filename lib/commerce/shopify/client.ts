import 'server-only';
import { connection } from 'next/server';
import { CommerceError } from './errors';
import { shopifyConfig } from './config';

export function isShopifyConfigured() {
  try { shopifyConfig(); return true; } catch { return false; }
}

export async function storefront<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  await connection();
  let config: ReturnType<typeof shopifyConfig>;
  try { config = shopifyConfig(); }
  catch { throw new CommerceError('not_configured', 'La tienda todavía no está conectada.', 503); }
  let response: Response;
  try {
    response = await fetch(config.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': config.token },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    });
  } catch {
    throw new CommerceError('unavailable', 'No pudimos contactar con la tienda. Inténtalo de nuevo.', 503);
  }
  if (response.status === 401 || response.status === 403) {
    throw new CommerceError('unauthorized', 'No pudimos acceder al catálogo. Inténtalo más tarde.', 503);
  }
  if (response.status === 429) {
    throw new CommerceError('throttled', 'La tienda está ocupada. Espera un momento e inténtalo de nuevo.', 503);
  }
  const servedVersion = response.headers.get('x-shopify-api-version');
  if (servedVersion && servedVersion !== config.version) {
    throw new CommerceError('version_mismatch', 'La conexión de la tienda necesita actualizarse.', 503);
  }
  const payload = await response.json().catch(() => null) as { data?: T; errors?: unknown[] } | null;
  if (!response.ok || !payload?.data || payload.errors?.length) {
    throw new CommerceError('upstream_error', 'La tienda no pudo completar la consulta.', 502);
  }
  return payload.data;
}
