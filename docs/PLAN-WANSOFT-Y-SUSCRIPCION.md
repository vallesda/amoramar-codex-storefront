# Wansoft y suscripción semanal Amor a Mar

19 de septiembre de 2026. Análisis y propuesta; no se han importado productos, reemplazado imágenes ni activado suscripciones.

## 1. Inventario Wansoft → Shopify

### Insumos y acceso pendientes

- Archivo recibido: productos_amoramar_2026_inicial.numbers. Contiene 94 registros con claves, presentaciones y precios; no contiene existencias físicas ni sucursal. Cruce público documentado en REVISION-CATALOGO-WANSOFT.md. Falta catálogo administrativo completo para confirmar faltantes.
- Catálogo administrativo Shopify, incluyendo productos activos, borradores, archivados y sus variantes. Storefront solo muestra lo publicado para su contexto y no basta para declarar que un producto no existe.
- Acceso administrativo autorizado para altas. El token actual no permite crear productos o actualizar inventario. No compartir contraseñas/tokens en el chat.
- Decisión confirmada: conservar fotos y datos de productos existentes; crear únicamente los productos faltantes con sus imágenes nuevas.

### Cruce propuesto

| Resultado | Criterio | Acción |
|---|---|---|
| Coincidencia exacta | Código Wansoft/SKU inequívoco y misma unidad/presentación | Vincular con producto y variante existentes |
| Coincidencia posible | Nombre similar, código ausente o diferencia de peso/unidad | Revisión; no crear automáticamente |
| Variante faltante | Mismo producto, presentación realmente distinta | Reportar aparte; conservar el producto existente sin modificarlo |
| Producto faltante | Sin coincidencia tras revisar catálogo completo | Preparar nueva ficha e imagen |
| Conflicto | SKU repetido, unidades incompatibles, datos contradictorios | Resolver antes de importar |

Conservar códigos como texto, incluidos ceros iniciales. No confundir kg con piezas o packs. Una existencia de 5 kg no equivale a cinco unidades vendibles de una presentación. Separar insumos internos, servicios y productos terminados. No usar el costo de compra como precio de venta.

Entregable del cruce: fila Wansoft, código original, SKU Shopify, IDs de producto/variante, coincidencia y motivo, diferencias, acción propuesta y estado de ejecución. Conservar un identificador Wansoft estable y registro del lote para que repetir la importación no duplique altas.

### Imágenes y publicación

Propuesta visual: fotografía de producto sobre fondo crema y composición consistente con Amor a Mar, usando la especie, corte y presentación confirmados. Preferir fotografía real como referencia; una imagen generada no prueba el tamaño, origen o aspecto exacto de lo entregado. Si es ilustrativa, indicarlo cuando pueda inducir a confusión. No inventar especies, certificaciones, gramajes o características.

Por cada alta: título, SKU, presentación, precio comprobado, descripción, imagen, texto alternativo y colección correspondiente. Preparar primero el lote como borradores revisables y después publicar las fichas correctas en el canal Headless. Las coincidencias existentes no deben generar duplicados.

Crear la ficha no significa sincronizar existencias: la actualización de stock exige acordar sucursal/ubicación, unidad, fecha de corte y sistema maestro. Un Excel es una instantánea; sobrescribir Shopify más tarde con ese stock podría reponer unidades ya vendidas. Definir si Wansoft conserva la autoridad y cómo se registran las ventas Shopify en él. No asumir que Wansoft dispone de una API accesible.

## 2. Concepto: suscripción semanal Amor a Mar

La propuesta es una compra recurrente con entrega semanal, diferente de una membresía que solo da descuentos. El comprador debe conocer importe, frecuencia de cobro, frecuencia de entrega, contenido comprometido y reglas para omitir, pausar o cancelar.

### Modelo elegido por el usuario

**Caja predeterminada Amor a Mar, personalizada una sola vez al contratar.** El cliente parte de una selección sugerida, cambia productos permitidos y cantidades, y confirma su composición. Esa composición se repite cada semana sin pedirle que vuelva a elegir. No es una selección semanal cambiante del negocio ni un configurador que deba completarse cada semana.

Recomiendo calcular el precio por entrega a partir de los productos y cantidades elegidos, con el descuento recurrente que el negocio defina y el envío claramente separado. Así, aumentar cantidades no deja una caja de precio fijo con costos impredecibles. Si se desea precio fijo, habría que limitar los cambios a equivalencias o cupos previamente costeados. No se proponen importes sin costos reales.

### Recorrido del cliente

1. Entra a la página de suscripción y ve una caja sugerida con productos, presentaciones, cantidades y cobertura.
2. Personaliza una vez: agrega o quita cantidades y cambia productos entre opciones elegibles. El resumen actualiza el total por entrega.
3. Confirma contenido, cobro semanal, envío y condiciones de renovación en Shopify Checkout con un método recurrente compatible.
4. Recibe confirmación de su selección guardada y acceso a gestionar pago, dirección, pausa, omisión o cancelación.
5. Cada semana se repiten las líneas y cantidades del contrato, sin una nueva selección obligatoria. Un recordatorio informa la próxima entrega y su importe.
6. Tras confirmar el cobro, el pedido pasa a preparación y reparto. Si falta un producto o falla el pago, se aplica la política acordada; no se sustituye silenciosamente.

La personalización ocurre en el alta. Una edición posterior voluntaria de la composición podría añadirse como una fase futura, pero no es necesaria para el modelo solicitado. Los cambios de precios deben seguir reglas comunicadas; guardar una selección no equivale a autorizar importes variables ilimitados.

Propuesta de ritmo, pendiente de validación: aviso de próxima entrega → cierre de pausas/omisiones → cobro confirmado → preparación → ruta. No prometer días exactos hasta comprobar el calendario de la aplicación y la capacidad de reparto. Cobrar mensualmente para entregar semanalmente sería otro modelo, especialmente en meses con cinco entregas.

### Viabilidad comercial

Calcular por entrega: ingreso neto menos producto, merma, empaque, frío, preparación, reparto, procesamiento y atención. Separar IVA/impuestos según tratamiento aplicable con el negocio. El precio mínimo depende del costo completo y del margen requerido; no basta con descontar el precio de catálogo.

Medir en un piloto: margen por caja, costo de reparto, permanencia, semanas omitidas, rechazos de cobro, puntualidad, sustituciones y reclamaciones. Limitar cupos al mínimo entre capacidad de preparación, inventario y rutas. Reservar capacidad semanal no equivale a reservar inventario automáticamente en Shopify.

## 3. Compatibilidad con Shopify y nuestro código

Shopify permite suscripciones en custom storefronts y nuestra arquitectura puede ampliarse usando planes de venta. [Guía Storefront](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/products-collections/subscriptions).

Cambios necesarios, todavía no implementados:

- Consultar `sellingPlanGroups`, asignaciones y precios; habilitar el permiso Storefront `unauthenticated_read_selling_plans`.
- Crear un configurador inicial de caja con selección predeterminada, cambios permitidos, cantidades y total recurrente; también mostrar frecuencia y condiciones.
- Representar preferentemente el contenido como variantes reales con planes compatibles y la misma frecuencia, para que cada pedido pueda descontar el inventario de sus componentes. Guardar la configuración en el contrato mediante la aplicación, no solo en localStorage.
- Validar en una prueba técnica si la aplicación agrupa las líneas en un contrato y una entrega, y conserva descuentos/envío en renovaciones. No asumir que varias líneas con planes forman una caja única automáticamente.
- Añadir `sellingPlanId` al payload del carrito y validarlo en servidor contra la variante.
- Cambiar la identidad de líneas de solo variante a variante + plan. Hoy `lib/cart.ts` y `checkout-input.ts` podrían fusionar una compra única y una suscripción de la misma variante.
- Preservar el plan al crear, actualizar y reconciliar líneas Shopify; validar precio y plan devueltos.
- Conectar un portal de gestión de suscripciones y confirmar su funcionamiento desde el dominio headless.
- Delegar contratos, cobros y reintentos a una aplicación compatible, no a un temporizador dentro del frontend.
- Probar renovación, cambio de tarjeta, rechazo, agotado, pausa, cancelación y entrega omitida, además de la compra inicial.

Para el modelo elegido, la caja sería una agrupación visual de productos recurrentes reales, pendiente de validar en la aplicación. Shopify Subscriptions es una opción a evaluar mediante una prueba técnica. Su soporte de custom storefront no instala automáticamente UI en Next.js. Una caja variable no debe asumirse compatible con bundles: la app oficial indica que no admite bundles. Un SKU de caja independiente requerirá gestionar por separado el consumo de sus componentes o elegir otra solución validada. [Consideraciones oficiales](https://help.shopify.com/en/manual/products/purchase-options/subscriptions/shopify-subscriptions/considerations).

### Pagos y pruebas

Priorizar Shopify Checkout con una pasarela admitida para suscripciones. Shopify Payments es una opción compatible; la disponibilidad de otros proveedores depende de región y cuenta. La app oficial limita Stripe a determinados comercios: no basta con que el cliente haya usado Stripe antes. No ofrecer OXXO o transferencia como si autorizaran cargos automáticos recurrentes. [Compatibilidad de pagos](https://help.shopify.com/en/manual/products/purchase-options/subscriptions/shopify-subscriptions/considerations).

**Test payment gateway / Bogus no admite productos de suscripción.** Para este piloto hay que preparar Shopify Payments en modo de prueba, u otra configuración compatible confirmada por el proveedor. El bloqueo actual de checkout también sigue pendiente. [Pruebas oficiales](https://help.shopify.com/en/manual/checkout-settings/test-orders/payments-test-mode).

Stripe Billing directo sería una alternativa arquitectónica distinta, no incorporada aquí: exigiría orquestación propia de cobros y entregas, sincronización de pedidos e inventario y conciliación. La recomendación para este primer piloto es continuar con Shopify y validar su aplicación de suscripciones.

## 4. Orden de trabajo

1. Archivo Numbers recibido y revisado. Recibir exportación/acceso administrativo Shopify; conservar íntegros los productos existentes.
2. Entregar cruce completo con conflictos y altas propuestas; confirmar unidades y autoridad del stock.
3. Preparar imágenes y fichas faltantes, aplicar un lote pequeño y verificar ausencia de duplicados antes del resto.
4. Definir caja predeterminada, cambios permitidos al contratar, costos, sustituciones, cobertura, cortes y política de cancelación.
5. Probar compatibilidad de la aplicación de suscripciones, caja/componentes y pasarela en una tienda separada.
6. Implementar planes en Next.js y probar compra inicial más renovación y fallos.
7. Piloto con cupo limitado y métricas; ampliar solo después de validar operación y margen.

No se han creado productos ni imágenes en esta fase: ya se recibió el archivo, pero falta verificar los candidatos contra el catálogo administrativo completo y resolver los conflictos de clave/presentación. El análisis no implica que el catálogo publicado actual represente todo el inventario administrativo de Shopify.
