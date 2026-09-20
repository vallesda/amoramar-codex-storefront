import type { Metadata } from 'next';
import { Suspense } from 'react';

import { getProducts } from '@/lib/commerce';
import Container from '@/components/ui/container';
import Section from '@/components/ui/section';
import WaveBackdrop from '@/components/ui/wave-backdrop';
import SectionHeader from '@/components/ui/section-header';
import ProductGrid from '@/components/grid/product-grid';
import GridSkeleton from '@/components/grid/grid-skeleton';
import Hero from '@/components/merchandising/hero';
import BestSellers from '@/components/merchandising/best-sellers';
import CatchOfTheWeek from '@/components/merchandising/catch-of-the-week';
import LearnMore from '@/components/merchandising/learn-more';
import { LOCALITY, REGION, SHOP_NAME } from '@/lib/shop';

/**
 * La portada es la página que compite por la búsqueda local, así que declara su
 * propio título en vez de heredar el del layout.
 *
 * El patrón: qué eres · dónde estás · marca. Sin amontonar palabras clave — la
 * repetición mecánica lleva una década penalizada, y a un cliente le lee a
 * desesperado.
 */
export const metadata: Metadata = {
  title: `Pescadería en ${LOCALITY} — mariscos y pescado fresco`,
  description: `${SHOP_NAME}: pescadería y marisquería en ${LOCALITY}, ${REGION}. Pescado y mariscos frescos seleccionados pieza por pieza, con cadena de frío y entrega a domicilio en Monterrey.`,
  alternates: { canonical: '/' },
};

export default function Page() {
  return (
    <>
      <Hero />

      <Section
        id="producto-fresco"
        labelledBy="catalogo-heading"
        className="relative overflow-hidden"
      >
        {/*
          La ola de marca como fondo de la banda del catálogo, espejada para
          que la cresta corra al contrario que la del hero. Los porqués de la
          opacidad y del degradado viven en el componente, que es también quien
          los comparte con las páginas de categoría.
        */}
        <WaveBackdrop flip />

        <Container className="relative z-10">
          <SectionHeader
            id="catalogo-heading"
            title={
              <>
                Los <em>más vendidos</em>
              </>
            }
            lede="Los favoritos de Amor a Mar, listos para llegar a tu cocina."
            // The grid is capped at eight, so the way out of it has to be
            // visible. Without this the only route to the full catalogue from
            // the body of the page was a text link buried in the story section.
            action={{ href: '/search/mas-vendidos', label: 'Ver todos los más vendidos' }}
            className="mb-10"
          />

          <Suspense fallback={<GridSkeleton />}>
            <Catalogue />
          </Suspense>
        </Container>
      </Section>

      {/*
        «Para qué lo quieres» está desmontado a propósito, no borrado.

        La estantería mezclaba categorías destacadas y paquetes, y los paquetes
        todavía no están decididos. Enseñar media sección —categorías bajo un
        título que promete platillos— habría sido peor que no enseñarla.

        Para devolverla: `<ShelfGrid />` dentro de un `<Suspense>` aquí, el
        grupo «Para qué lo quieres» en `collection-nav.tsx`, y las URLs de
        paquete en `sitemap.ts`. Los tres sitios llevan esta misma nota. Nada
        más se tocó: la ruta `/paquete/[handle]`, el modelo, el admin y
        `getShelf()` siguen enteros y funcionando.
      */}

      <Suspense fallback={null}>
        <CatchOfTheWeek />
      </Suspense>

      <Suspense fallback={null}>
        <BestSellers />
      </Suspense>

      <LearnMore />
    </>
  );
}

async function Catalogue() {
  const { items } = await getProducts({ collection: 'mas-vendidos' });
  return <ProductGrid products={items.slice(0, 8)} />;
}
