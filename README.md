# Amor a Mar · Shopify storefront

Proyecto independiente basado en `/Users/dvalles/Projects/admin-dashboard/storefront`.
Next.js 16 + React 19 + Tailwind, listo para configurar en Vercel. La decisión del usuario fue conservar Next.js/React, no migrar a Nuxt.

## Arranque

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Abre http://localhost:3001. Sin credenciales se muestra la marca y un catálogo vacío con aviso de preparación. No se incluyen productos ficticios ni se crean pedidos.

Configura un dominio `*.myshopify.com` y un **token público de Storefront API** generado para el canal Headless. Aunque es público, esta implementación lo mantiene exclusivamente en servidor. No sirve un token de Admin API ni uno privado. Publica productos y colecciones en ese canal, habilita México/MXN y da acceso de lectura a productos, inventario y los metafields documentados. La conexión del plugin de Shopify en Codex es independiente de estas variables de ejecución.

## Estado

Implementado: copia del diseño y recursos, catálogo/colecciones/ficha vía Storefront GraphQL 2026-07, adaptación de precios MXN, variantes en carrito, creación de carrito Shopify y redirección al checkout alojado. El carrito local es una selección provisional; se crea un carrito Shopify al continuar al pago. El ID completo del carrito Shopify queda en una cookie HttpOnly. Cada intento de checkout reutiliza el carrito y sincroniza la selección local mediante altas, cambios y bajas. No se sincroniza todavía con Shopify en cada clic ni se limpia automáticamente al completar el pago.

No habilitado: paquetes antiguos, calendario de encargos, cobertura propia, consulta de pedidos heredados, Customer Account API, webhooks, sincronización del admin anterior. Ver [plan de refactor](docs/PLAN-REFACTOR-SHOPIFY.md).

## Conectar Shopify (fase 2)

Completa `.env.local` y ejecuta `npm run shopify:check` con Node 22.18+.
Comprueba token, versión de API, mercado México/MXN, publicación del catálogo y lectura de inventario sin crear carritos ni pedidos. No imprime credenciales. Consulta [la guía de conexión](docs/CONECTAR-SHOPIFY.md).

## Validación

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

Las pruebas heredadas del checkout/admin anterior no se copiaron porque verificaban otro proveedor. Se conservan las pruebas de interfaz y utilidades y se agregan pruebas del límite de confianza de Shopify. `PRUEBAS.md` describe el sistema anterior; la evidencia actual está en `docs/VALIDACION.md`.

## Vercel

Importar este repositorio como un proyecto nuevo, framework Next.js, raíz del repositorio, `npm ci` y `npm run build`; runtime Node.js 22.x. Configurar las cuatro variables de `.env.example` por entorno. `NEXT_PUBLIC_SITE_URL` debe ser la URL canónica de producción, nunca localhost. Usar tienda de prueba en Preview; mantener protección y noindex hasta completar aceptación. No se ha creado ni desplegado un proyecto remoto.

Fuentes: [Storefront API](https://shopify.dev/docs/api/storefront/2026-07), [Cart API](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/cart/manage), [Shopify AI Toolkit](https://shopify.dev/docs/apps/build/ai-toolkit).
