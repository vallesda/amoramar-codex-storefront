# Conectar la tienda de desarrollo

La aplicación usa un token público de Storefront desde el servidor. Este token no es el de Admin API ni el token privado del canal Headless. La conexión del plugin Shopify en Codex tampoco configura automáticamente esta aplicación.

1. Identificar el dominio permanente `nombre.myshopify.com` de la tienda de desarrollo.
2. En Shopify, configurar el canal Headless y su storefront; obtener su token público de Storefront. Habilitar lectura de productos (`unauthenticated_read_product_listings`). No se necesita el permiso de inventario: la tienda usa `availableForSale` y Shopify valida cantidades en el carrito y al pagar.
3. Publicar al menos un producto con variantes en ese canal, habilitar su disponibilidad para el mercado México y los precios MXN. Publicar las colecciones que deban aparecer en navegación.
4. Completar `SHOPIFY_STORE_DOMAIN` y `SHOPIFY_STOREFRONT_ACCESS_TOKEN` en `.env.local`. Mantener `SHOPIFY_API_VERSION=2026-07`. No subir `.env.local` a GitHub ni pegar el token en una conversación.
5. Ejecutar `npm run shopify:check` con Node 22.18 o superior. Usa `.env.local` y las variables del proceso (estas prevalecen). El comando solo lee: comprueba versión efectiva, permisos del catálogo y disponibilidad, mercado MX/MXN, primer producto y colecciones. Un aviso de metafield no distingue entre un valor vacío y falta de acceso Storefront; revisar ambos en Shopify.
6. Ejecutar `npm run dev`, abrir el catálogo y una ficha. Tras cambiar variables, reiniciar el servidor (o recompilar si se usa `npm run start`). Verificar precio, presentación y disponibilidad contra Shopify.
7. En tienda de desarrollo, probar dos variantes del mismo producto, cambiar cantidad, quitar un artículo y volver desde checkout sin pagar. El siguiente intento debe reutilizar el carrito. Solo después configurar y probar un pago de prueba, entrega e impuestos.

## Carrito implementado

La selección visible sigue en localStorage; conserva el trabajo del comprador si falla Shopify. Al continuar al pago, una Server Action lee una cookie HttpOnly y consulta el carrito. Si existe, aplica altas, cambios y bajas para reflejar la selección; si devuelve `null`, crea uno nuevo. Reconsulta inmediatamente antes de redirigir y comprueba cada variante/cantidad. Errores de red o permisos no provocan recreación automática. Los warnings detienen la redirección; se conserva el carrito parcialmente aceptado para corregirlo sin duplicar creaciones en el siguiente intento.

El ID y su clave no aparecen en props, localStorage ni respuestas de acciones. La cookie es Secure en producción, SameSite=Lax, con expiración de 10 días y nombre específico por tienda. El identificador Shopify se trata como opaco. Los precios finales se confirman en Shopify Checkout.

Pendiente: sincronización al modificar el carrito, conciliación simultánea entre pestañas, descuentos, indicador de cambios de precio y limpieza tras compra confirmada. La selección local no demuestra reserva de stock ni pago. Si se pierde la respuesta de una creación antes de guardar la cookie, el siguiente intento puede crear otro carrito; no se promete idempotencia global ni bloqueo distribuido.

## Estado de esta entrega

Conexión real verificada con Amor a Mar en México/MXN: productos, variantes, disponibilidad y colecciones accesibles. El catálogo muestra 48 productos. Dominio y token se mantienen en `.env.local`, excluido de Git. El origen del producto de comprobación está vacío o no tiene lectura Storefront. La compra de extremo a extremo sigue pendiente.

Fuentes oficiales:
- https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/getting-started
- https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/cart/manage
- https://shopify.dev/docs/api/storefront/2026-07
