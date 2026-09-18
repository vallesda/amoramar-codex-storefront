# Plan de refactor · Amor a Mar

Fecha: 17 de septiembre de 2026. Decisión confirmada: conservar Next.js/React y desplegar en Vercel. El pedido inicial mencionaba Nuxt, pero el usuario eligió mantener el framework original tras revisar `package.json`.

## Resultado buscado

Una tienda independiente que conserve el branding de Amor a Mar y use Shopify como autoridad de catálogo, variantes, precios, inventario, descuentos, cobro y pedidos. La base entregada implementa el primer recorrido catálogo → selección local → Shopify Checkout. No equivale a una migración completa ni a una tienda lista para vender.

## Avance de integración

Rama `codex/shopify-integration`: configuración validada y comando `npm run shopify:check`; carrito persistente durante el paso al checkout y pruebas de errores/recuperación. Fase 2 en verificación: conexión real con Amor a Mar confirmada en México/MXN; 48 productos visibles, colecciones y ficha comprobadas en navegador. No se requiere lectura del conteo de inventario. Compra de extremo a extremo pendiente.

## Auditoría de la base

- App Router, Server Components, React 19, Tailwind y diseño propio; sin Nuxt.
- `lib/commerce/index.ts` ya separa la UI del proveedor: sustituir esta costura evita reescribir los componentes.
- El proveedor anterior consumía `/api/v1/catalog/*`, `/checkout`, cotización por CP y pedidos por token, con `ADMIN_API_URL` y credencial de servicio.
- Carrito en localStorage por producto; variantes visuales no se transmitían al agregar. Corregido en la copia: la línea usa ProductVariant GID y precio seleccionado.
- Se mantienen rutas `/`, `/search`, `/search/[collection]`, `/product/[handle]` y páginas informativas. La ruta de paquetes devuelve 404 hasta definir su modelo. El checkout antiguo y `/pedido/[token]` no se copian.
- Los recursos `public/brand`, `public/editorial`, ilustraciones, CSS, componentes UI y fuentes Spectral/Figtree se conservan. El texto narrativo de DESIGN.md contiene referencias antiguas a Newsreader/Instrument Sans; para esta copia prevalece el código real `app/layout.tsx` y sus tokens. El documento es referencia de diseño, no una nueva petición del usuario.
- Hay textos comerciales heredados que deberán verificarse antes de publicar: entregas, recogida, zonas y preguntas frecuentes.

## Arquitectura

Navegador → componentes React / Server Actions → `lib/commerce` → Storefront GraphQL → Shopify.
El comprador paga en el `checkoutUrl` devuelto por Shopify. No se integra Stripe directamente ni se llama a Admin API desde el navegador. Admin API queda para una futura importación o sincronización privada, si se requiere.

`shopify/client.ts` controla dominio permitido, credencial de Storefront, versión fijada, timeout y errores. `queries.ts` contiene operaciones verificables. `normalize.ts` adapta Shopify al contrato visual heredado. Se conserva el contrato para reducir el alcance inicial, pero los tipos de pedidos antiguos deberán retirarse en la limpieza final.

API fijada en 2026-07, con revisión trimestral. País MX/idioma ES. Se rechazan precios fuera de MXN para evitar etiquetar otra moneda como pesos. No hay caché compartida inicialmente; `React.cache` deduplica lecturas por render. La lectura completa paginada es adecuada solo para un catálogo pequeño; para crecimiento pasar a cursores en la URL, búsqueda y filtros del servidor sin cargar todo el catálogo.

## Mapeo de datos

| Origen | Shopify / destino | Estado |
|---|---|---|
| Producto e ID interno | Product GID + handle | Implementado |
| Presentación/SKU | ProductVariant GID | Implementado; máximo 100 variantes, error explícito si se excede |
| Precio en centavos | MoneyV2 decimal → centavos MXN | Implementado |
| Fotos | Shopify CDN | Implementado; primeras 20 por ficha |
| Categorías | Collections publicadas | Implementado; todas visibles en navegación inicialmente |
| Destacados | tag `featured` | Implementado |
| Temporada | tag `seasonal` | Implementado |
| Pesca semanal | tag `catch-of-the-week` | Implementado; validar que solo haya un producto marcado |
| Origen | `amoramar.origin`, texto | Implementado |
| Presentación descriptiva | `amoramar.presentation`, texto | Implementado |
| Unidad | `amoramar.unit`: piece/pack/kg/dozen | Implementado; usar unidades comerciales, no peso variable cobrado después |
| Conservación | `amoramar.storage_instructions`, texto | Implementado |
| Encargos / cierre / llegada | Metafields tipados + reglas operativas | Pendiente; no inventar fechas ni frescura |
| Paquetes de productos | Bundle nativo o conjunto de líneas | Decisión pendiente; no asumir equivalencia con bundles actuales |
| Cobertura y tarifa por CP | Perfiles/zonas de envío Shopify | Configuración y pruebas pendientes |
| Pago / descuentos / impuestos | Shopify Checkout | Handoff implementado; configuración real pendiente |
| Seguimiento de pedidos | Página alojada / Customer Account API | Usar inicialmente Shopify; portal propio posterior |

Metafields deben tener lectura Storefront habilitada. La UI usa `availableForSale` sin mostrar cantidades de inventario: Shopify valida cantidades al sincronizar el carrito y revalida al pagar; agregar al carrito no garantiza ni reserva existencias. El tope 99 es de UX, no inventario publicado.

## Fases y criterios de salida

1. **Base independiente y contrato Shopify (entregada como base técnica).** Copiar recursos sin secretos ni node_modules. Reemplazar cliente HTTP, consultas y normalización; separar credenciales de entornos. Salida: typecheck, lint, tests y build; consultas validadas con esquema oficial.
2. **Conectar tienda de desarrollo (0.5–1 día estimado).** Canal Headless, token Storefront, mercado MXN, productos publicados, imágenes, colecciones y metafields. Salida: datos reales visibles, sin credenciales en HTML/JS y 404 correctos.
3. **Carrito Shopify persistente (1–2 días).** `cartCreate`, `cartLinesAdd/Update/Remove`, reconsulta de precio/disponibilidad y descuentos; guardar ID completo con su clave solo en cookie HttpOnly/Secure/SameSite. No exponer el secreto en localStorage, logs o URLs públicas. Recuperar carrito expirado sin perder selección. Salida: recarga, dos variantes del mismo producto, errores de stock, cancelación y regreso del checkout sin duplicaciones. Avance: el checkout ya reutiliza un carrito Shopify en cookie HttpOnly y sincroniza altas/cambios/bajas antes de redirigir. Se recrea ante cart:null, sin reintentar automáticamente ante fallos ambiguos. Faltan sincronización en cada clic, descuentos, resolución de concurrencia entre pestañas, limpieza tras compra y pruebas con la tienda real; esta fase permanece abierta.
4. **Reglas de negocio (2–4 días, según decisiones).** Migrar encargos, calendario en America/Monterrey, paquetes, zonas de entrega, recogida, umbral de envío gratis e impuestos. Decidir quién administra inventario: Shopify como maestro; si el admin anterior sigue activo, sincronización explícita con idempotencia y reconciliación. Salida: prueba de direcciones fuera de cobertura, agotados, pedidos mixtos y corte semanal. No publicar hasta demostrar equivalencia operativa.
5. **SEO, contenido y paridad visual (1–2 días).** Mantener handles o tabla de redirects, sitemap paginado, canonicals, JSON-LD y OG con precios reales. Comparar móvil/escritorio contra la base, revisar checkout alojado y copy de pagos. Accesibilidad: teclado, foco del drawer, contraste y mensajes de error. Salida: sin enlaces rotos ni URLs localhost; sin marcas de frescura no sustentadas.
6. **Preview y lanzamiento (1–2 días).** Proyecto Vercel separado, secretos por entorno, pedidos de prueba de punta a punta, límites distribuidos/WAF en acciones de checkout y observabilidad sin PII. Cuando se incorpore caché, webhooks con verificación HMAC sobre cuerpo original, deduplicación e invalidación. Salida: compra de prueba, confirmación en Shopify, inventario actualizado, devolución/cancelación y rollback documentado.

Estimación restante orientativa: 6–11 días de trabajo, excluyendo limpieza/importación de datos y configuración comercial de terceros. Ajustar tras revisar la tienda real.

## Pruebas de aceptación

- Seleccionar presentación B conserva su GID y su precio en carrito y checkout; A y B no se fusionan.
- Payload manipulado no impone precios; cantidades cero, negativas, fraccionarias y GIDs de producto se rechazan.
- Shopify devuelve userErrors o warnings: se muestran sin perder el carrito ni afirmar que existe un pedido.
- Agotado entre catálogo y pago, cambio de precio, token inválido, timeout y respuesta GraphQL parcial.
- Catálogo vacío, segunda página, colección inexistente, imagen ausente y moneda inesperada.
- Pedido pagado aparece una sola vez en Shopify; el navegador no marca pagos como confirmados.
- La comprobación con esquema y mocks no sustituye estas pruebas con una tienda de desarrollo.

## Despliegue y rollback

Vercel: Next.js, Node 22.x, lockfile y `npm ci`, build estándar. Variables detalladas en `.env.example`; no `NEXT_PUBLIC_` para tokens. Preview protegido/noindex y tienda de desarrollo; producción con dominio y catálogo reales. Conservar desplegado el storefront anterior hasta terminar aceptación. Cambiar el dominio al nuevo proyecto solo al cierre; rollback restaura el destino anterior. No sincronizar inventario en ambas direcciones sin una política explícita de autoridad.

## Accesos y decisiones pendientes

Dominio y token Storefront ya configurados localmente. Sigue pendiente revisar publicaciones, metafields y configuración de entrega antes del lanzamiento. No pegar secretos en el plan. Confirmar paquetes, encargos, política de peso/precio, métodos de entrega y si el admin anterior seguirá operando. El plugin Shopify para gestionar la tienda se ofreció pero su conexión no está confirmada; es independiente del Dev MCP público y del token que utiliza la aplicación.

## Navegación principal

El navbar de escritorio y móvil muestra Catálogo, Fresco, Congelado, Nosotros, Cómo funciona y Preguntas frecuentes. Las demás categorías siguen accesibles desde el catálogo. Congelado enlaza a la colección `congelados`; Fresco espera una colección publicada con handle `fresco`, `frescos` o `producto-fresco`. Mientras falta, `/search/fresco` presenta un estado vacío sin asignar productos automáticamente. Las páginas informativas también siguen en el pie de página. Las preguntas frecuentes usan las 13 respuestas proporcionadas por el negocio, sin numeración; el contenido visible y los datos estructurados comparten la misma fuente.

## Hallazgos del catálogo real

- El canal publica productos auxiliares como `store-pickup-app` y `zona-de-envio`; revisar su publicación para el nuevo storefront antes del lanzamiento. No se cambiaron datos de Shopify.
- El metafield `amoramar.origin` del producto de comprobación está vacío o no tiene lectura Storefront.
- No se muestran etiquetas Fresco/Congelado sin datos explícitos de conservación.
- `productType` no es un handle de colección: se retiró el enlace de categoría que generaba rutas inexistentes desde la ficha.

## Fuentes verificadas

- https://shopify.dev/docs/api/storefront/2026-07
- https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/cart/manage
- https://shopify.dev/docs/apps/build/ai-toolkit
- Skill oficial `Shopify/shopify-ai-toolkit`, `shopify-storefront-graphql` v1.15.0, copia en `docs/shopify-storefront-graphql`.
- Documentación local de Next 16.3.2: Server Actions y Fetching Data.
