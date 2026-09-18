import type { Collection } from '@/lib/commerce/types';

export type NavLink = { href: string; label: string };

export function getPrimaryLinks(collections: Collection[]): NavLink[] {
  const fresh = collections.find(c => /^(fresco|frescos|producto-fresco)$/.test(c.handle));
  const frozen = collections.find(c => /^(congelado|congelados|producto-congelado)$/.test(c.handle));
  return [
    { href: '/search', label: 'Catálogo' },
    { href: `/search/${fresh?.handle ?? 'fresco'}`, label: 'Fresco' },
    { href: `/search/${frozen?.handle ?? 'congelados'}`, label: 'Congelado' },
  ];
}

/** Informational links remain available in the footer. */
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
