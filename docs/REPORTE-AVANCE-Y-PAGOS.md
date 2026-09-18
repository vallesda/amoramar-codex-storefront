# Amor a Mar · Reporte de avance y opciones de pago

Fecha de corte: 17 de septiembre de 2026. Repositorio: [amoramar-codex-storefront](https://github.com/vallesda/amoramar-codex-storefront). Destino de integración: `main`. Este reporte distingue implementación, verificación y propuestas; integrar código no equivale a lanzar la tienda.

## 1. Estado ejecutivo

El storefront independiente conserva el diseño de Amor a Mar y utiliza Next.js/React, por decisión confirmada del negocio. Shopify reemplaza al proveedor de comercio anterior para catálogo y carrito. Se verificaron 48 productos publicados, precios MXN, colecciones, variantes, fichas y selección local. La interfaz está preparada para Vercel, pero no se ha desplegado desde esta tarea ni se ha cambiado el dominio del negocio.

El paso al checkout se implementó y se reprodujo en navegador. Shopify devuelve «Esta tienda todavía no está configurada para recibir pedidos», antes del formulario de pago. La captura proporcionada por el usuario muestra Test payment gateway activo, pero no se ha completado una compra simulada ni real. Falta revisar el estado del plan y del checkout desde Shopify Admin; no existe una sesión administrativa autenticada disponible para esta tarea.

**Recomendación:** conservar Shopify Checkout y resolver su configuración, aislar las pruebas en otra tienda Shopify y cerrar una compra de prueba antes de lanzar. Investigar la conexión histórica con Stripe antes de reemplazar un proveedor existente. Stripe directo sería otro proyecto de integración, no un cambio de credenciales.

## 2. Cambios realizados

### Base técnica y catálogo

- Proyecto separado del storefront original, con Next.js 16, React 19, Tailwind y recursos de marca conservados. No se migró a Nuxt.
- Adaptador de Storefront GraphQL, versión fijada `2026-07`, país México, idioma español y validación de precios MXN.
- Configuración de dominio/token validada, errores de red y GraphQL controlados, paginación de catálogo y comando `npm run shopify:check`.
- Token Storefront utilizado en servidor; `.env.local` excluido de Git. No se incorporaron credenciales al reporte ni al repositorio.
- Identidad de líneas basada en variantes Shopify: dos presentaciones del mismo producto conservan sus precios e identificadores propios.
- Disponibilidad mediante `availableForSale`, sin mostrar el conteo de existencias. El límite 99 es de interfaz, no inventario. Se retiró la consulta `quantityAvailable` que requería permisos adicionales.
- Retiradas etiquetas de congelación no respaldadas por datos y enlaces que confundían `productType` con el handle de una colección.

### Carrito y checkout

La selección visible persiste en localStorage. Al continuar al pago, el servidor crea o reutiliza un carrito Shopify, sincroniza altas/cambios/bajas y consulta de nuevo el `checkoutUrl`. El identificador completo del carrito Shopify se conserva en cookie HttpOnly, Secure en producción y SameSite=Lax. Se revisan las variantes y cantidades aceptadas antes de redirigir; errores o advertencias impiden afirmar que el pedido se completó.

La sincronización con Shopify ocurre al continuar al pago, no en cada clic del carrito. Agregar productos no reserva inventario. No se ha implementado todavía limpieza tras compra confirmada, conciliación entre pestañas, descuentos propios o una notificación explícita de cambios de precio.

Este recorrido sigue el patrón oficial de Cart API → `checkoutUrl` → Shopify Checkout. [Guía oficial de carritos](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/cart/manage).

### Navegación y contenido

- Navbar de escritorio y móvil: Catálogo, Fresco, Congelado; separados visualmente de Nosotros, Cómo funciona y Preguntas frecuentes.
- Pie de página con selección independiente: Todo el catálogo, Salsas y Aderezos, Congelados, Filetes y Frescos. Las demás categorías siguen en el catálogo.
- «La pesca de la semana» toma el primer producto de `mas-vendidos`, respetando el orden de esa página. Al verificarlo era Filete Atún Aleta Azul 180gr. Si la colección queda vacía, la sección se oculta.
- Reemplazo de las FAQ por las 13 respuestas del negocio, sin numeración, con una misma fuente para pantalla y datos estructurados.
- Nuevas páginas `/terminos-y-condiciones` y `/envios`, con textos suministrados por el negocio y enlaces desde el pie y la revisión del pedido; incluidas en sitemap.
- Estas páginas publican contenido: no configuran tarifas, cobertura o políticas dentro del checkout alojado de Shopify.

### Animaciones

Fotografías de los productos con entrada suave de 420 ms al aparecer al recorrer la página y escalonado de hasta 180 ms. La primera pantalla, precios y controles permanecen inmediatos. Se añadieron destello de confirmación al agregar desde tarjetas y respuesta del contador del carrito. Se usan Intersection Observer, Web Animations API y CSS, sin instalar Motion. Se respeta movimiento reducido y el contenido permanece visible sin JavaScript. No se implementaron parallax editorial ni transiciones complejas entre filtros.

## 3. Validación y límites

| Verificación | Resultado |
|---|---|
| TypeScript y ESLint | Correctos, repetidos antes de integrar |
| Suite automatizada | 73 pruebas correctas en 13 archivos |
| Build de producción | Correcto en la revisión de código `c9b3afd`; cambios posteriores de esta entrega son documentación |
| Esquema Storefront | Consultas verificadas con herramientas oficiales durante la integración |
| Tienda real | Catálogo, variantes, MXN, colecciones y fichas comprobados |
| Navegador | Selección local, navegación, FAQ, portada, pie y apertura del checkout comprobados |
| Pago completo y pedido | Pendiente: checkout bloqueado en Shopify |
| Despliegue Vercel y dominios | Pendiente |

Las pruebas emiten avisos conocidos por el iframe del mapa bloqueado en Happy DOM y por localStorage experimental en Node 26; no hay pruebas fallidas. Se recomienda el runtime documentado Node 22.18+ para el proyecto. El build necesita acceso a Google Fonts.

No están verificados aún envíos, impuestos, devoluciones operativas, actualización de inventario tras compra, notificaciones y conciliación de pedidos. Los tests con mocks y la lectura del catálogo no sustituyen esa aceptación.

## 4. Shopify, Stripe y Shop Pay: qué hace cada uno

| Concepto | Función |
|---|---|
| Storefront propio | Catálogo, marca, navegación y selección del cliente |
| Shopify Checkout | Entrega, métodos de pago y cierre de compra alojado por Shopify |
| Shopify Payments | Servicio de procesamiento gestionado desde Shopify |
| Stripe independiente | Cuenta y procesamiento contratados y gestionados con Stripe |
| Shop Pay | Experiencia de pago acelerado; no es la app obligatoria para comprar |
| Test payment gateway / Bogus | Simulador de cobros, sin pagos reales |

Shopify identifica a Stripe Payments Mexico como procesador de Shopify Payments en México. Eso no convierte a Shopify Payments en la misma cuenta independiente de Stripe que podría tener el cliente. [Procesadores oficiales](https://www.shopify.com/legal/processor-list).

## 5. Opciones de pago para este proyecto

| Ruta | Compatibilidad actual | Gestión operativa | Trabajo pendiente |
|---|---|---|---|
| Shopify Checkout + Shopify Payments | Encaja con el código actual | Desde Shopify | Alta/verificación, banco, métodos, pruebas y checkout habilitado |
| Shopify Checkout + Stripe externo histórico | Posible si la integración existente sigue habilitada y admitida | Shopify para pedidos; proveedor para su procesamiento | Comprobar configuración y transacciones históricas; no asumir reactivación |
| Shopify Checkout + otro proveedor compatible | Encaja sin reescribir el carrito | Shopify y el proveedor elegido | Revisar disponibilidad para esa cuenta/país y condiciones |
| Storefront + Stripe Checkout directo | No implementado | Backend propio + Stripe; integración adicional si Shopify conserva pedidos | Nuevo flujo de pago, sincronización y conciliación |

### A. Shopify Payments en México

Admite Visa, Mastercard y UnionPay; American Express se puede habilitar para pagos MXN. También hay Apple Pay, Google Pay y Shop Pay. OXXO y meses sin intereses requieren activación y elegibilidad; no se asume que todos estén habilitados en esta cuenta. [Métodos oficiales para México](https://help.shopify.com/en/manual/payments/shopify-payments/supported-countries/mexico/payment-methods).

Para Amor a Mar proponemos iniciar con tarjetas y compra como invitado, y valorar OXXO/MSI según la operación. En pagos diferidos debe definirse cuándo se prepara el producto y cómo se gestiona la disponibilidad mientras el pago está pendiente. El checkout decide qué métodos presenta según configuración y elegibilidad. La app Shop no es requisito de nuestro storefront.

### B. Stripe a través de Shopify

El cliente puede estar describiendo una conexión histórica real. Shopify Payments llegó a México el 3 de marzo de 2025. Hoy Shopify indica que Stripe independiente no está disponible para nuevas activaciones en países donde existe Shopify Payments. No se infiere de esto que una conexión histórica específica siga funcionando o haya sido migrada. [Lanzamiento](https://changelog.shopify.com/posts/shopify-payments-available-in-mexico), [disponibilidad actual](https://help.shopify.com/en/manual/payments/third-party-providers/payment-gateway-availability).

Antes de cambiarla: identificar el proveedor en Configuración → Pagos, revisar una transacción antigua y confirmar si los abonos se consultaban en Stripe o Shopify. El test gateway actual no demuestra cuál era el proveedor anterior. Si Shopify mantiene esa conexión externa operativa, el storefront utilizará el checkout configurado sin necesitar claves Stripe en Next.js.

Los proveedores externos pueden generar comisiones de transacción de Shopify además del costo del procesador. Comparar el plan y condiciones reales; no se presentan tasas estimadas como cotización. [Proveedores externos](https://help.shopify.com/en/manual/payments/third-party-providers).

### C. Stripe directamente desde nuestro storefront

Es técnicamente una arquitectura distinta: Next.js → servidor propio → Stripe Checkout Sessions → webhook → registro/conciliación del pedido. Shopify Cart API no procesa un pago Stripe externo ni convierte automáticamente ese pago en un pedido Shopify.

La propuesta técnica, si se elige esa ruta, requeriría:

1. Validar productos, cantidades, precios y moneda en servidor antes de crear una sesión Stripe.
2. Definir una fuente de verdad para inventario, reservas, impuestos, descuentos y tarifas de envío.
3. Confirmar pagos mediante webhooks firmados, manejar pagos diferidos y evitar pedidos duplicados con idempotencia.
4. Persistir pedidos y estados, y sincronizar con Shopify mediante una integración administrativa autorizada si Shopify seguirá como sistema operativo.
5. Resolver pagos cobrados cuyo pedido no pudo registrarse, reintentos, reembolsos, cancelaciones, disputas y trazabilidad.
6. Validar con Shopify que el modelo de venta externa/importación es compatible con el contrato, plan y permisos aplicables. No tratarlo como un atajo para un checkout deshabilitado.

Stripe exige que la entrega automatizada no dependa solo de que el navegador vuelva a una página de éxito; su guía contempla webhooks y procesamiento seguro ante ejecuciones repetidas. [Confirmación de pedidos con Stripe](https://docs.stripe.com/checkout/fulfillment?payment-ui=stripe-hosted).

Esta alternativa ofrece control propio, pero amplía el alcance y la operación. No se ha agregado el SDK de Stripe, ni claves Stripe, ni endpoints de cobro a este proyecto. Para el alcance actual recomendamos mantener Shopify Checkout.

## 6. Bloqueo actual y pruebas de pago

Hecho observado: al pulsar Continuar al pago, Shopify muestra «Esta tienda todavía no está configurada para recibir pedidos». No se llegó a introducir una tarjeta ni a crear una orden pagada.

Acciones: revisar Configuración → Plan, estado de la tienda y avisos de administración; comprobar que el test gateway pertenece a la misma tienda conectada; si todo está habilitado, consultar soporte Shopify con el error. No está confirmada la causa. Pause and Build desactiva checkout; una tienda comercial debe cumplir los requisitos de plan para probar pagos. [Pausa de tienda](https://help.shopify.com/en/manual/your-account/pause-store), [pruebas de pagos](https://help.shopify.com/en/manual/checkout-settings/test-orders/payments-test-mode).

Una vez habilitado: Test payment gateway como nombre de tarjeta; número `1` aprobado, `2` rechazado, `3` error; vencimiento futuro y CVV de tres dígitos. Verificar pedido de prueba, variantes, cantidades, envío y total en Shopify. El simulador no valida la liquidación bancaria real ni todas las particularidades de métodos locales. Las tiendas de desarrollo permiten probar con Bogus o modo de prueba según su tipo. [Tiendas de desarrollo](https://shopify.dev/docs/apps/build/stores/development-stores).

## 7. Separar pruebas y producción

Propuesta todavía no provisionada:

| Capa | Pruebas | Producción |
|---|---|---|
| Código | Ramas y revisión previa | `main` validado |
| Hosting | Preview protegida | Dominio definitivo |
| Shopify | Tienda de desarrollo separada | Tienda Amor a Mar |
| Datos | Productos/pedidos de prueba | Inventario y pedidos reales |
| Pago | Bogus o modo de prueba | Proveedor real confirmado |

Configurar por entorno `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN`, `SHOPIFY_API_VERSION` y `NEXT_PUBLIC_SITE_URL`. No mezclar variantes o carritos de tiendas distintas: las identidades Shopify son diferentes. Dos frontends apuntando a una tienda comparten su operación y no aíslan pagos o inventario.

Vercel permite variables separadas para Local, Preview y Production. Al crear el proyecto, revisar la configuración del primer despliegue: Vercel lo considera Production, incluso si procede de otra rama. Mantener protegido y sin el dominio comercial hasta la aceptación. [Entornos Vercel](https://vercel.com/docs/deployments/environments).

## 8. Próximas fases y criterios de salida

| Prioridad | Trabajo | Criterio para cerrar |
|---|---|---|
| 1 | Acceso administrativo y diagnóstico del bloqueo | Checkout accesible y proveedor real/histórico identificado |
| 2 | Aislamiento de pruebas | Preview conectada a otra tienda, variables y datos verificados |
| 3 | Pago de extremo a extremo | Aprobado, rechazado y error; pedido único, totales y variantes correctos |
| 4 | Operación del carrito | Recuperación, cambios de precio/stock, varias pestañas y limpieza tras compra confirmada |
| 5 | Entregas, recogida e impuestos | Direcciones dentro/fuera de cobertura y tarifas contrastadas con el negocio |
| 6 | Contenido y catálogo | Políticas coherentes, productos auxiliares revisados y metafields completos |
| 7 | Lanzamiento | Proveedor real activo, dominios/SEO, móvil/accesibilidad y rollback revisados |

Pendientes específicos de contenido: las FAQ dicen 1–3 días hábiles y envíos nacionales, mientras la política nueva indica 24–48 horas y cobertura local. Se solicitó confirmación y aún no se unificaron. También falta revisar el aviso de privacidad y reflejar las políticas en el checkout Shopify. El contenido proporcionado no constituye una revisión legal ni una configuración operativa de Shopify.

Pendientes de catálogo: productos auxiliares de recogida y coordenadas publicados, origen sin valor o acceso Storefront, y reglas de paquetes/encargos sin definir. La pesca semanal ya sigue Más vendidos; la fila independiente de destacados todavía utiliza el tag `featured`.

## 9. Integración de código

Se integrará `codex/shopify-integration` en `main` con un commit de merge explícito y se enviará a `origin/main`, incluyendo este reporte. Base previa de `main`: `f609fd7`. Última revisión de funcionalidad: `c9b3afd`. El hash final de merge queda en el historial Git y se confirma en la entrega, evitando una referencia circular dentro del propio commit.

No se borra la rama de trabajo ni se cambia el proveedor de pagos, plan, dominio o datos comerciales por esta integración. El original en `/Users/dvalles/Projects/admin-dashboard/storefront` permanece separado.
