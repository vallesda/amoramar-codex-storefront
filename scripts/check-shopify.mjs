import { shopifyConfig } from '../lib/commerce/shopify/config.ts';
import { CONNECTION_CHECK } from '../lib/commerce/shopify/queries.ts';

async function check() {
  const config = shopifyConfig();
  let response;
  try {
    response = await fetch(config.endpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': config.token },
      body: JSON.stringify({ query: CONNECTION_CHECK }), signal: AbortSignal.timeout(10000),
    });
  } catch { throw new Error('No se pudo contactar con Shopify. Revisa tu conexión y el dominio.'); }
  if (response.status === 401 || response.status === 403) throw new Error('Shopify rechazó el token. Verifica que sea un token público Storefront del canal Headless de esta tienda.');
  if (!response.ok) throw new Error(`Shopify respondió HTTP ${response.status}.`);
  const servedVersion = response.headers.get('x-shopify-api-version');
  if (servedVersion && servedVersion !== config.version) throw new Error(`Shopify usó la versión ${servedVersion}; actualiza SHOPIFY_API_VERSION y valida las consultas.`);
  const payload = await response.json().catch(() => null);
  if (!payload?.data || payload.errors?.length) throw new Error('GraphQL rechazó la consulta. Revisa permisos de productos, colecciones e inventario de Storefront.');
  const data = payload.data;
  const market = data.localization.country;
  if (market.isoCode !== 'MX' || market.currency.isoCode !== 'MXN') throw new Error('La tienda responde, pero el mercado México/MXN no está activo.');
  const product = data.products.nodes[0];
  if (!product) throw new Error('Conexión correcta, pero no hay productos publicados para este canal Headless.');
  if (product.variants.nodes.some(v => v.price.currencyCode !== 'MXN')) throw new Error('El precio del producto de prueba no está en MXN.');
  console.log(`Conexión correcta: ${data.shop.name} · API ${config.version} · México/MXN.`);
  console.log('Lectura de productos, variantes e inventario: correcta.');
  console.log(data.collections.nodes.length ? 'Colecciones publicadas: encontradas.' : 'Aviso: no hay colecciones publicadas.');
  console.log(product.metafield ? 'Metafield amoramar.origin: accesible en el producto de prueba.' : 'Aviso: amoramar.origin está vacío o no tiene acceso Storefront en el producto de prueba.');
  console.log('No se crearon carritos ni pedidos. Falta realizar la prueba de compra en la tienda de desarrollo.');
}
check().catch(error => { console.error(error instanceof Error ? error.message : 'Falló la comprobación de Shopify.'); process.exitCode = 1; });
