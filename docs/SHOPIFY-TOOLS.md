# Herramientas de Shopify usadas

Se usó la skill oficial de Shopify para Storefront GraphQL, consultada desde el repositorio `Shopify/shopify-ai-toolkit`. La copia de referencia y sus scripts están en `docs/shopify-storefront-graphql`, con su licencia. No se instalaron instrucciones globales ni se modificó la configuración personal de Codex.

También se inició el Dev MCP oficial mediante `npx -y @shopify/dev-mcp@latest` y se ejecutaron su guía Storefront y validación GraphQL. Este MCP de desarrollo no requiere acceso a una tienda; no administra productos ni obtiene credenciales de la tienda.

Se buscó y ofreció por separado el plugin Shopify para gestión de la tienda. Su conexión no está confirmada. Para usarlo con tu catálogo real, completa la conexión de Shopify en Codex. Para ejecutar esta aplicación, configura además el token Storefront en `.env.local` o Vercel: son dos accesos distintos.

Fuente oficial: https://shopify.dev/docs/apps/build/ai-toolkit
