# Evidencia de validación

17 de septiembre de 2026.

- Skill oficial `shopify-storefront-graphql` v1.15.0: consulta documental ejecutada; operaciones validadas con sus scripts contra Storefront 2026-07.
- Dev MCP oficial `@shopify/dev-mcp`: ejecutados `learn_shopify_api` y `validate_graphql_codeblocks`. Resultado: 5/5 operaciones válidas (Products, Product, CollectionProducts, Collections, CartCreate).
- `npm run typecheck`: correcto.
- `npm run lint`: correcto.
- `npm test`: 55 pruebas correctas en 11 archivos. Incluye rechazo de precios manipulados y GIDs inválidos, separación de variantes y manejo de warnings de disponibilidad. Happy DOM emite avisos al bloquear el iframe del mapa; no hay pruebas fallidas. Node 26 emite un aviso experimental de localStorage en los tests heredados.
- Compilación de producción con Next.js 16.3.5 / Webpack: correcta. Se dejó `next build --webpack` como script estándar. Turbopack falló por restricción de apertura de puertos internos del entorno. Google Fonts requiere red durante el build, igual que la base original.
- Auditoría de npm tras actualizar Next.js a 16.3.5 y PostCSS a 8.5.28: 0 vulnerabilidades reportadas.
- Navegador local: portada y `/checkout` cargan; marca y estilos originales visibles, aviso de tienda en preparación y carrito vacío con enlace al catálogo. No se verificó una compra con datos reales ni una comparación visual exhaustiva.

## Límites de la validación inicial

Sin dominio/token de la tienda real, no se verificaron publicaciones, precios, inventario, envíos, impuestos, pago ni pedido de extremo a extremo. La validación del esquema no demuestra que la tienda tenga los permisos o configuración necesarios. No se desplegó en Vercel ni se modificó la tienda original.

Las pruebas del checkout del proveedor anterior y de su cliente REST no se trasladaron: ese flujo se reemplazó. `PRUEBAS.md` se conserva como referencia histórica, no como evidencia de esta implementación.

## Avance previo de integración · rama codex/shopify-integration

- TypeScript y ESLint: correctos.
- 71 pruebas correctas en 13 archivos. Cobertura añadida: token y dominio válidos, códigos 401/403/429, discrepancias de versión, errores GraphQL parciales, cookie de carrito, reutilización, expiración, variantes y cantidades, sincronización de líneas y ausencia de reintentos automáticos ante timeout.
- 6 operaciones de carrito/conexión validadas con el esquema oficial 2026-07.
- Build de producción con Webpack: correcto.
- `npm run shopify:check`: fallo esperado por falta de dominio/token reales. No se realizó una compra ni se modificó una tienda Shopify.

## Conexión real y disponibilidad sin conteo de inventario

- `shopify:check` correcto contra Amor a Mar, Storefront 2026-07, contexto MX/ES y precios MXN. Productos, variantes y colecciones accesibles.
- Eliminado `quantityAvailable`; cuatro consultas de catálogo/conexión validadas con el esquema oficial. La UI usa `availableForSale` y un tope de cantidad de 99, que no representa existencias.
- Navegador: catálogo con 48 productos, ficha de Filete de Salmón Canadiense 180gr a $139 MXN y agregado a la selección local comprobados.
- Corregidas etiquetas de congelación sin respaldo y enlace de categoría que asumía equivalencia entre productType y handle de colección.
- Pendiente: compra de extremo a extremo, envíos, impuestos, publicación selectiva de productos auxiliares y metafields. Estas verificaciones no crearon pedidos ni pagos.
- Validación final: TypeScript, ESLint, 73 pruebas en 13 archivos y build de producción correctos.
