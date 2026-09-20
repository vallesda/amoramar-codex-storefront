import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { getCollections, getProducts, getShelf } from '@/lib/commerce';
import { LOCALITY, REGION } from '@/lib/shop';
import Container from '@/components/ui/container';
import SectionHeader from '@/components/ui/section-header';
import ProductGrid from '@/components/grid/product-grid';
import ResultRule from '@/components/grid/result-rule';
import CollectionNav from '@/components/layout/collection-nav';
import GridSkeleton from '@/components/grid/grid-skeleton';
import { RHYTHM } from '@/components/ui/section';
import WaveBackdrop from '@/components/ui/wave-backdrop';
import ClubIntro, { ClubDetails } from '@/components/merchandising/club-intro';
import { CLUB_COLLECTION_HANDLE } from '@/components/layout/nav-links';

type Props = { params: Promise<{ collection: string }> };

/**
 * NOTE — no `loading.tsx` in this segment, for the same reason as the product
 * page: a route-level loading boundary commits a 200 before the page has
 * decided whether the collection exists, turning every unknown handle into a
 * soft 404 that search engines index as a live page.
 */

/**
 * Resolves a handle to a real category.
 *
 * It used to resolve to a category *or* a hardcoded "occasion" — Sashimi,
 * Ceviche — which had no data behind it, so those pages rendered the entire
 * catalogue under a note apologising for it. Occasions are packages now, they
 * live at `/paquete/[handle]`, and this route went back to doing one thing.
 *
 * A handle that is not a category but *is* a published package is redirected
 * rather than 404'd: those four URLs were live on this route until today, and
 * anyone holding one should land on the thing it became.
 */
async function resolve(handle: string) {
  const collections = await getCollections();
  const collection = collections.find((c) => c.handle === handle);
  // Keep the primary Fresco destination usable until its collection is published.
  return collection ?? (handle === 'fresco'
    ? { handle, title: 'Fresco', showInNav: false }
    : undefined);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collection: handle } = await params;
  const found = await resolve(handle);

  if (!found) return { title: 'Colección no encontrada' };

  if (handle === CLUB_COLLECTION_HANDLE) {
    return {
      title: 'Club Amor a Mar — pescado y mariscos cada semana',
      description: 'Conoce el Club Amor a Mar: productos seleccionados con precios especiales, entregas semanales o recolección en tienda y una forma de consumir con más cuidado.',
      alternates: { canonical: `/search/${handle}` },
    };
  }

  return {
    title: `${found.title} en ${LOCALITY}`,
    description: `${found.title} en ${LOCALITY}, ${REGION}. Selección del día en Amor a Mar, con entrega a domicilio en la zona metropolitana de Monterrey.`,
    alternates: { canonical: `/search/${handle}` },
  };
}

/**
 * A collection page: one category, filtered.
 *
 * It carries a plain ruled header rather than an editorial photograph, and that
 * is the distinction worth keeping. "Mariscos" is a filter; dressing a filter up
 * as a campaign is how a shop starts lying to itself about which of its pages
 * are merchandising. The proposition pages — "you are making ceviche" — are
 * packages, and they get the photograph.
 */
export default async function Page({ params }: Props) {
  const { collection: handle } = await params;
  const found = await resolve(handle);

  if (!found) {
    // The four occasion slugs used to answer on this route. If the handle is a
    // package now, send the visitor to it instead of a dead end.
    const shelf = await getShelf().catch(() => []);
    const bundle = shelf.find(
      (item) => item.kind === 'package' && item.handle === handle,
    );
    if (bundle) redirect(`/paquete/${handle}`);

    // Neither a category nor a package: a genuine 404, not an empty grid.
    notFound();
  }

  return (
    /*
      La ola de fondo, en su orientación original.
      
      Sin espejar a propósito: la portada usa la espejada porque tiene el hero
      justo encima y dos olas iguales seguidas leen como una repetición. Aquí
      no hay nada antes con lo que competir, así que vale la del manual.

      `relative overflow-hidden` en el envoltorio y `relative z-10` en el
      contenido son requisito del componente, no adorno: sin lo primero la ola
      se sale de la sección, sin lo segundo tapa el catálogo.

      El envoltorio es un `div` y no un `Section`: esta página ya es una
      sección entera —su `h1` es el título de la categoría— y anidar un
      `<section>` dentro no añade estructura, sólo un nivel de landmark que un
      lector de pantalla tendría que anunciar sin que signifique nada.
    */
    <div className="relative overflow-hidden">
      <WaveBackdrop />

      <Container className={`relative z-10 ${RHYTHM.sm}`}>
        {handle === CLUB_COLLECTION_HANDLE ? (
          <ClubIntro />
        ) : <SectionHeader as="h1" title={found.title} className="mb-10" />}

        {handle !== CLUB_COLLECTION_HANDLE ? <div className="mb-10">
          <Suspense fallback={null}>
            <CollectionNav active={handle} />
          </Suspense>
        </div> : null}

        <div id={handle === CLUB_COLLECTION_HANDLE ? 'productos-club' : undefined} className="scroll-mt-36">
          <Suspense key={handle} fallback={<GridSkeleton />}>
            <CollectionProducts handle={handle} />
          </Suspense>
        </div>
        {handle === CLUB_COLLECTION_HANDLE ? <ClubDetails /> : null}
      </Container>
    </div>
  );
}

async function CollectionProducts({ handle }: { handle: string }) {
  const { items, total } = await getProducts({ collection: handle });

  if (items.length === 0) {
    return (
      <div className="border-t border-border py-14">
        <p className="max-w-[46ch] text-muted">
          Hoy no hay nada en esta categoría. El catálogo cambia con lo que
          llega, así que vale la pena volver a consultar.
        </p>
      </div>
    );
  }

  return (
    <div>
      {handle !== CLUB_COLLECTION_HANDLE ? <ResultRule total={total} /> : null}
      <ProductGrid products={items} centered={handle === CLUB_COLLECTION_HANDLE} />
    </div>
  );
}
