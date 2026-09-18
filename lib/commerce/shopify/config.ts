/** Shared by the Next.js server and the connection check. Never import in client components. */
export function shopifyConfig(env: Record<string, string | undefined> = process.env) {
  const domain = env.SHOPIFY_STORE_DOMAIN?.trim();
  const token = env.SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();
  const version = env.SHOPIFY_API_VERSION?.trim() || '2026-07';
  if (!domain || domain === 'your-store.myshopify.com' || !token) {
    throw new Error('Configura SHOPIFY_STORE_DOMAIN y SHOPIFY_STOREFRONT_ACCESS_TOKEN en .env.local.');
  }
  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(domain)) {
    throw new Error('SHOPIFY_STORE_DOMAIN debe ser un dominio .myshopify.com, sin https:// ni rutas.');
  }
  if (!/^20\d{2}-(01|04|07|10)$/.test(version)) {
    throw new Error('SHOPIFY_API_VERSION debe ser una versión estable YYYY-MM.');
  }
  if (/^(shpat_|shpca_|shpss_)/.test(token)) {
    throw new Error('Usa un token público de Storefront, no un token de Admin API ni un secreto de aplicación.');
  }
  return { domain, token, version, endpoint: `https://${domain}/api/${version}/graphql.json` };
}
