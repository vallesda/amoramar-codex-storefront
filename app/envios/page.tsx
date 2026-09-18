import type { Metadata } from 'next';
import ColorField from '@/components/ui/color-field';
import { WHATSAPP_URL } from '@/lib/shop';

export const metadata: Metadata = {
  title: 'Política de envíos',
  description: 'Plazos, cobertura, costos de envío y atención de entregas de Amor a Mar.',
};

export default function Page() {
  return (
    <ColorField tone="cream" as="h1" id="envios" title={<>Política de <em>envíos</em></>}>
      <div className="max-w-[70ch] space-y-10 text-base leading-relaxed md:text-lg">
        <section aria-labelledby="plazos">
          <h2 id="plazos" className="mb-4 font-display text-3xl">Plazos y notificaciones</h2>
          <p>Los envíos a domicilio se completan en un plazo de 24 a 48 hrs posteriores al momento de realizar tu compra. Te notificaremos tan pronto cuando tu pedido salga en ruta; de igual manera, recibirás una notificación cuando se haya completado la entrega. Esta última comunicación es para informarte en caso de que no te encuentres en casa, permitiéndote saber que tu pedido ya ha sido recibido en tu domicilio.</p>
        </section>
        <section aria-labelledby="entregas">
          <h2 id="entregas" className="mb-4 font-display text-3xl">Atención de entregas</h2>
          <p>En situaciones en las que tu pedido aparece como entregado, pero no lo hayas recibido, te invitamos a contactarnos a través de nuestro apartado de soporte. Estamos comprometidos a resolver cualquier problema de manera rápida y eficiente para garantizar tu satisfacción.</p>
          <p className="mt-4">En caso que tu pedido no haya podido ser entregado por motivos terceros, el pedido se regresará a la tienda, donde se conservará idóneamente; podrás recolectar en tienda a partir de este punto. Tu pedido tendrá vigencia en tienda de 48 hrs naturales. Pasando el plazo mencionado, el pedido será pausado para preservar la calidad del producto y puedas recibirlo en condiciones óptimas.</p>
          <a href={WHATSAPP_URL} className="mt-4 inline-block text-brand underline underline-offset-4">Contactar a soporte por WhatsApp</a>
        </section>
        <section aria-labelledby="costos">
          <h2 id="costos" className="mb-4 font-display text-3xl">Costo de envío</h2>
          <p>Es importante destacar que el costo de envío varía según las zonas seleccionadas; podrás conocer el costo específico al ingresar la información de tu domicilio durante el proceso de compra. Actualmente la zona próxima (Zona Valle) es gratuita, y de ahí la tarifa aumentará según la distancia.</p>
        </section>
        <section aria-labelledby="cobertura">
          <h2 id="cobertura" className="mb-4 font-display text-3xl">Cobertura</h2>
          <p>Actualmente nuestros servicios de entrega están disponibles en el área de San Pedro y Santa Catarina, Zona Pte.</p>
        </section>
      </div>
    </ColorField>
  );
}
