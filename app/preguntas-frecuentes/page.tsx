import type { Metadata } from 'next';
import Link from 'next/link';

import ColorField from '@/components/ui/color-field';
import Heading from '@/components/ui/heading';
import { ButtonLink } from '@/components/ui/button';
import { jsonLdScript } from '@/lib/shop';
import questions from './content.json';

export const metadata: Metadata = {
  title: 'Preguntas frecuentes',
  description:
    'Cómo funciona el catálogo, cómo se prepara tu pedido, cómo se entrega y cómo se paga en Amor a Mar.',
};

// Visible answers and structured data share the business-provided source.
const GROUPS = [
  { id: 'pedido', title: <>Tu <em>pedido</em></>, items: questions.slice(0, 3) },
  { id: 'conservacion', title: <>Frescura y <em>conservación</em></>, items: questions.slice(3, 7) },
  { id: 'producto', title: <>Del mar a <em>tu mesa</em></>, items: questions.slice(7) },
];

function faqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: GROUPS.flatMap((group) =>
      group.items.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    ),
  };
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(faqJsonLd()) }}
      />

      <ColorField
        tone="coral"
        id="faq-intro"
        as="h1"
        title={
          <>
            Preguntas <em>frecuentes</em>
          </>
        }
        lede="Cómo funciona el catálogo, cómo preparamos tu pedido y cómo se entrega y se paga. Si algo no está aquí, escríbenos."
      />

      {/*
        One band for all three groups, not one band each. Three stacked
        sections put their own vertical rhythm end to end and opened ~130px of
        empty cream between "El catálogo" and "Tu pedido" — the page read as
        three unrelated screens rather than one list of answers.

        ## Por qué las respuestas se quedan sobre crema

        Los campos de color de esta página son la entrada y la salida; el centro
        no. Coral y turquesa sostienen texto —6.09 y 5.18— pero eso es el
        mínimo para leer una etiqueta, no para leer treinta respuestas seguidas.
        El color aquí marca los grupos, no los fondos: una barra de 3px por
        grupo, que es información —dónde empieza cada tema— y no decoración.
      */}
      <ColorField tone="cream">
        <div className="flex flex-col gap-16">
          {GROUPS.map((group, i) => (
            <section key={group.id} aria-labelledby={`${group.id}-heading`}>
              {/*
                La barra, no un filete gris. Tres colores para tres temas, y a
                3px de alto es una superficie, no texto: no le aplica el mínimo
                de 4.5 que sí descarta al coral como tinta.
              */}
              <div
                aria-hidden="true"
                className={`h-[3px] w-16 ${GROUP_BARS[i % GROUP_BARS.length]}`}
              />

              <Heading
                id={`${group.id}-heading`}
                size="section"
                className="mb-8 mt-5"
              >
                {group.title}
              </Heading>

              <div className="max-w-[68ch] border-t border-border">
                {group.items.map((item) => (
                  <details key={item.q} className="group border-b border-border">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-4 font-sans text-base font-medium marker:content-[''] hover:text-brand">
                      {item.q}
                      <span
                        aria-hidden="true"
                        className="mt-1 shrink-0 text-muted transition-transform duration-200 ease-board group-open:rotate-180"
                      >
                        <ChevronIcon />
                      </span>
                    </summary>
                    <div className="whitespace-pre-line pb-5 leading-relaxed text-muted">
                      {item.answer}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      </ColorField>

      <ColorField
        tone="mint"
        id="faq-cta"
        title="¿No encontraste tu respuesta?"
      >
        <p className="max-w-[54ch] text-lg leading-relaxed">
          Escríbenos por WhatsApp al{' '}
          <a
            href="https://wa.me/528129162142"
            className="tabular-nums underline underline-offset-4"
          >
            (81) 2916 2142
          </a>{' '}
          o revisa{' '}
          <Link href="/como-funciona" className="underline underline-offset-4">
            cómo funciona
          </Link>
          .
        </p>
        <ButtonLink href="/search" className="mt-8">
          Ver lo que hay
        </ButtonLink>
      </ColorField>
    </>
  );
}

/** Un color por grupo, fijo. Ver la nota sobre por qué son barras y no fondos. */
const GROUP_BARS = ['bg-brand', 'bg-turquoise', 'bg-coral'] as const;

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none">
      <path
        d="M4 6.5 8 10.5 12 6.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
