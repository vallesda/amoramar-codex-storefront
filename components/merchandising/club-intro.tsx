import Link from 'next/link';

import Heading from '@/components/ui/heading';
import { ButtonLink } from '@/components/ui/button';
import { WHATSAPP_URL } from '@/lib/shop';

const benefits = [
  { title: 'Tu selección, cada semana', text: 'Recibe tus productos del mar a domicilio o recógelos en tienda, con una entrega programada semanalmente.' },
  { title: 'Precios para miembros', text: 'Disfruta de precios especiales en productos seleccionados. Cada artículo tiene su propio precio.' },
  { title: 'A tu ritmo', text: 'Sin compromiso a largo plazo. Puedes pausar o cancelar tu suscripción cuando lo necesites.' },
];

const questions = [
  {
    title: '¿Cómo funcionan los cobros y los cambios de productos?',
    text: 'El cobro se realiza semanalmente los lunes y corresponde únicamente a los productos enviados. Para agregar un artículo a tu suscripción, selecciona ese producto: cada uno tiene un precio diferente. Si hay un problema de inventario, te notificaremos por correo electrónico y te ofreceremos alternativas sin costo adicional.',
  },
  {
    title: '¿Puedo pausar, cancelar o cambiar mi dirección?',
    text: 'Puedes pausar o cancelar en cualquier momento, por ejemplo, si no estarás en casa durante la semana de envío. Para cambiar tu dirección de entrega, accede a tu perfil y actualiza la información. Si el pago con tarjeta es declinado, el envío se posterga hasta resolver el inconveniente.',
  },
  {
    title: '¿Dónde entregan y cuánto cuesta el envío?',
    text: 'Las entregas están disponibles en San Pedro y en la zona poniente de Santa Catarina. El envío en la zona próxima, Zona Valle, es gratuito. En las demás zonas, la tarifa aumenta según la distancia. Podrás consultar el costo correspondiente a tu domicilio durante el proceso de compra. También puedes recoger tu pedido en tienda.',
  },
  {
    title: '¿Qué sucede si no se puede entregar mi pedido?',
    text: 'Si la entrega no puede completarse por motivos ajenos a la tienda, el pedido regresa y se conserva en condiciones adecuadas para que puedas recogerlo. Tienes un plazo de 48 horas naturales para hacerlo. Después de ese plazo, el pedido se pausa para preservar la calidad del producto y coordinar su recepción en condiciones óptimas.',
  },
];

export default function ClubIntro() {
  return (
    <div className="mb-14 md:mb-20">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-16">
        <div>
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.15em] text-muted">Una forma de consumir con más cuidado</p>
          <Heading as="h1" size="editorial">Club <em>Amor a Mar</em></Heading>
          <p className="mt-6 max-w-[40ch] font-display text-2xl leading-snug md:text-3xl">Haz del buen pescado una costumbre semanal.</p>
          <p className="mt-5 max-w-[55ch] leading-relaxed text-muted">Te invitamos a suscribirte para recibir pescado y mariscos cada semana, con precios especiales en productos seleccionados y la libertad de recibirlos en casa o recogerlos en tienda.</p>
          <div className="mt-7 flex flex-wrap items-center gap-5">
            <ButtonLink href="#productos-club">Ver productos del Club</ButtonLink>
            <a href={WHATSAPP_URL} className="border-b border-brand py-2 text-sm text-brand">Consultar cómo suscribirme</a>
          </div>
        </div>
        <aside className="rounded-sm bg-brand p-7 text-background md:p-10" aria-labelledby="club-mision">
          <Heading id="club-mision" size="section">Un pedido anticipado.<br /><em>Un mar más cuidado.</em></Heading>
          <p className="mt-6 leading-relaxed text-background/85">Cuidar la sustentabilidad y reducir la sobreexplotación del mar es parte de nuestra filosofía. Al conocer tu pedido con anticipación, podemos planear la extracción del pescado que necesitamos.</p>
          <p className="mt-5 border-t border-background/25 pt-5 leading-relaxed text-background/85">Creemos que cambiar nuestros hábitos de consumo puede impactar de forma duradera el rumbo de nuestros mares. El Club es una invitación a hacerlo juntos.</p>
        </aside>
      </div>
    </div>
  );
}

export function ClubDetails() {
  return (
    <div className="mt-14 md:mt-20">
      <div className="my-12 grid gap-7 md:my-16 md:grid-cols-3 md:gap-10">
        {benefits.map(({ title, text }) => (
          <section key={title} className="border-t border-border pt-5">
            <Heading as="h2" size="sub">{title}</Heading>
            <p className="mt-3 text-sm leading-relaxed text-muted">{text}</p>
          </section>
        ))}
      </div>

      <section aria-labelledby="club-detalles" className="grid gap-6 lg:grid-cols-[1fr_2fr] lg:gap-12">
        <div>
          <Heading id="club-detalles" size="section">Así funciona<br /><em>tu suscripción</em></Heading>
          <p className="mt-4 text-sm leading-relaxed text-muted">Lo que necesitas saber para organizar tus pedidos semanales.</p>
        </div>
        <div className="border-t border-border">
          {questions.map(({ title, text }) => (
            <details key={title} className="group border-b border-border py-5">
              <summary className="cursor-pointer text-base font-medium marker:text-brand">{title}</summary>
              <p className="mt-4 max-w-[75ch] text-sm leading-relaxed text-muted">{text}</p>
            </details>
          ))}
          <details className="border-b border-border py-5">
            <summary className="cursor-pointer text-base font-medium marker:text-brand">Mi pedido aparece entregado, pero no lo recibí</summary>
            <p className="mt-4 text-sm leading-relaxed text-muted">Contacta a nuestro <a href={WHATSAPP_URL} className="underline underline-offset-4">equipo de soporte</a> para revisar lo sucedido y ayudarte a resolverlo lo antes posible.</p>
          </details>
          <Link href="/envios" className="mt-5 inline-block border-b border-brand py-1 text-sm text-brand">Consultar información de envíos</Link>
        </div>
      </section>
    </div>
  );
}
