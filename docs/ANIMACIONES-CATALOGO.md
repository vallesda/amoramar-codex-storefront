# Animación al recorrer productos

Revisión: 17 de septiembre de 2026. Implementado: revelado de fotografías con Intersection Observer y Web Animations API; confirmación visual en el control de cantidad y contador del carrito.

Para el catálogo actual, usar CSS + Intersection Observer: aparición con opacidad y desplazamiento vertical de 8–12 px durante 420 ms, con hasta 180 ms de entrada escalonada, una sola vez al entrar en pantalla. No retrasar la primera fila ni bloquear enlaces o controles. Mantener el contenido visible si JavaScript falla y desactivar el efecto cuando el usuario prefiera movimiento reducido.

Motion para React es una alternativa si se incorporan transiciones de filtros, reordenamiento de tarjetas y animaciones compartidas. Ofrece `whileInView`, `viewport.once` y configuración de movimiento reducido. No hace falta añadir una dependencia para el efecto sencillo propuesto.

Fuentes primarias:
- https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion
- https://motion.dev/docs/react-scroll-animations
- https://motion.dev/docs/react-motion-config
