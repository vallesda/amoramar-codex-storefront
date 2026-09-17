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

## Límites

Sin dominio/token de la tienda real, no se verificaron publicaciones, precios, inventario, envíos, impuestos, pago ni pedido de extremo a extremo. La validación del esquema no demuestra que la tienda tenga los permisos o configuración necesarios. No se desplegó en Vercel ni se modificó la tienda original.

Las pruebas del checkout del proveedor anterior y de su cliente REST no se trasladaron: ese flujo se reemplazó. `PRUEBAS.md` se conserva como referencia histórica, no como evidencia de esta implementación.
