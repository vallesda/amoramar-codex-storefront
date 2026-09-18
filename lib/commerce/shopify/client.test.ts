import { afterEach, beforeEach, expect, it, vi } from 'vitest';
vi.mock('next/server', () => ({ connection: async () => {} }));
import { storefront } from './client';
import { shopifyConfig } from './config';
const fetchMock = vi.fn();
beforeEach(() => {
  vi.stubEnv('SHOPIFY_STORE_DOMAIN', 'test.myshopify.com');
  vi.stubEnv('SHOPIFY_STOREFRONT_ACCESS_TOKEN', 'public-storefront-test-token');
  vi.stubEnv('SHOPIFY_API_VERSION', '2026-07');
  vi.stubGlobal('fetch', fetchMock); fetchMock.mockReset();
});
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
it('keeps the credential in the intended header and disables caching', async () => {
  fetchMock.mockResolvedValue(new Response(JSON.stringify({ data: { shop: { name: 'Test' } } }), { headers: { 'x-shopify-api-version': '2026-07' } }));
  expect(await storefront('query { shop { name } }')).toEqual({ shop: { name: 'Test' } });
  expect(fetchMock).toHaveBeenCalledWith('https://test.myshopify.com/api/2026-07/graphql.json', expect.objectContaining({ cache: 'no-store', headers: expect.objectContaining({ 'X-Shopify-Storefront-Access-Token': 'public-storefront-test-token' }) }));
});
it('rejects credential exfiltration domains and admin tokens before fetching', async () => {
  vi.stubEnv('SHOPIFY_STORE_DOMAIN', 'test.myshopify.com.evil.test');
  await expect(storefront('query')).rejects.toMatchObject({ code: 'not_configured' });
  expect(fetchMock).not.toHaveBeenCalled();
  expect(() => shopifyConfig({ SHOPIFY_STORE_DOMAIN: 'test.myshopify.com', SHOPIFY_STOREFRONT_ACCESS_TOKEN: 'shpat_private' })).toThrow('Storefront');
});
it('distinguishes unauthorized and throttled responses', async () => {
  for (const [status,code] of [[401,'unauthorized'],[403,'unauthorized'],[429,'throttled']] as const) {
    fetchMock.mockResolvedValueOnce(new Response('',{status}));
    await expect(storefront('query')).rejects.toMatchObject({ code });
  }
});
it('rejects silently changed API versions', async () => {
  fetchMock.mockResolvedValue(new Response(JSON.stringify({ data: {} }), { headers: { 'x-shopify-api-version': '2026-10' } }));
  await expect(storefront('query')).rejects.toMatchObject({ code: 'version_mismatch' });
});
it('handles non-JSON and partial GraphQL failures without exposing their payload', async () => {
  for (const body of ['<html>bad gateway</html>', JSON.stringify({ data: { secret: 'hidden' }, errors: [{ message: 'token=hidden' }] })]) {
    fetchMock.mockResolvedValueOnce(new Response(body));
    await expect(storefront('query')).rejects.toMatchObject({ code: 'upstream_error', message: 'La tienda no pudo completar la consulta.' });
  }
});
it('does not automatically retry failed writes', async () => {
  fetchMock.mockRejectedValue(new Error('timeout'));
  await expect(storefront('mutation')).rejects.toMatchObject({ code: 'unavailable' });
  expect(fetchMock).toHaveBeenCalledOnce();
});
