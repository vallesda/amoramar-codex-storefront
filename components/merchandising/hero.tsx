import Image from 'next/image';
import Link from 'next/link';

import Container from '@/components/ui/container';
import Heading from '@/components/ui/heading';
import { ButtonLink } from '@/components/ui/button';

export default function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative isolate overflow-hidden bg-brand text-background">
      <Image
        src="/brand/ola.png"
        alt=""
        aria-hidden="true"
        width={1100}
        height={1340}
        className="pointer-events-none absolute -bottom-48 -left-40 w-[42rem] max-w-none opacity-[0.08]"
      />
      <Container className="relative grid gap-10 py-10 md:grid-cols-2 md:items-center md:gap-8 md:py-12 lg:gap-16 lg:py-16">
        <div className="relative z-10">
          <div className="set-down">
            <Heading id="hero-heading" as="h1" size="hero" className="max-w-[12ch]">
              Del mar a tu <em className="text-sun">cocina.</em>
            </Heading>
          </div>
          <p className="mt-6 max-w-[35ch] text-base leading-relaxed text-background/85 md:text-lg">
            El sabor de Baja California, más cerca. Pescados y mariscos seleccionados con cuidado y entregados con cadena de frío.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-5">
            <ButtonLink href="#producto-fresco" variant="onBrand" className="min-h-12">
              Explorar los favoritos
            </ButtonLink>
            <Link href="/search" className="border-b border-background/40 py-2 text-sm transition-colors hover:border-sun hover:text-sun">
              Ver todo el catálogo
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[5/4] overflow-hidden rounded-sm md:aspect-[4/5] lg:aspect-[5/6]">
            <Image
              src="/editorial/hero-barco.jpg"
              alt="Barco pesquero navegando al amanecer"
              fill
              preload
              sizes="(min-width: 1360px) 600px, (min-width: 768px) 48vw, 100vw"
              className="object-cover object-right"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
