import type { Collection } from '@/lib/commerce/types';

export type NavLink = { href: string; label: string };

export function getPrimaryLinks(collections: Collection[]): NavLink[] {
  const fresh = collections.find(c => /^(fresco|frescos|producto-fresco)$/.test(c.handle));
  const frozen = collections.find(c => /^(congelado|congelados|producto-congelado)$/.test(c.handle));
  return [
    { href: '/search', label: 'Catálogo' },
    { href: `/search/${fresh?.handle ?? 'fresco'}`, label: 'Fresco' },
    { href: `/search/${frozen?.handle ?? 'congelados'}`, label: 'Congelado' },
    ...INFO_LINKS,
  ];
}

/** Shared informational destinations for the navbar and footer. */
export const INFO_LINKS = [
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/como-funciona', label: 'Cómo funciona' },
  { href: '/preguntas-frecuentes', label: 'Preguntas frecuentes' },
] as const;

/**
 * Los canales públicos de la tienda.
 *
 * Reexportados desde `lib/shop.ts`, que es la fuente única del NAP. Estaban
 * escritos aquí *además* de allí, y el enlace de WhatsApp una tercera vez a
 * mano en la página de Nosotros: tres copias del mismo número es cómo se
 * consigue que una de ellas se quede vieja.
 */
export {
  INSTAGRAM_URL,
  INSTAGRAM_HANDLE,
  WHATSAPP_URL,
  WHATSAPP_LABEL,
} from '@/lib/shop';

/** Curated footer only; the full catalog keeps all published collections. */
export const FOOTER_PRODUCT_LINKS = [
  { href: '/search', label: 'Todo el catálogo' },
  { href: '/search/salsas-y-aderezos', label: 'Salsas y Aderezos' },
  { href: '/search/congelados', label: 'Congelados' },
  { href: '/search/pescado', label: 'Filetes' },
  { href: '/search/fresco', label: 'Frescos' },
] as const;
