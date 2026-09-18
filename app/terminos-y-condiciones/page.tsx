import type { Metadata } from 'next';
import ColorField from '@/components/ui/color-field';

export const metadata: Metadata = {
  title: 'Términos y condiciones',
  description: 'Reglas y condiciones de uso de la plataforma de Amor a Mar Honest Seafood.',
};

export default function Page() {
  return (
    <ColorField tone="cream" as="h1" id="terminos" title={<>Términos y <em>condiciones</em></>}>
      <div className="max-w-[70ch] space-y-6 text-base leading-relaxed md:text-lg">
        <p>Sea bienvenido a Amor a Mar Honest Seafood. Estos términos y condiciones describen las reglas y regulaciones para el uso de nuestra plataforma <a href="https://amoramar-mx.myshopify.com/" className="break-words text-brand underline underline-offset-4">https://amoramar-mx.myshopify.com/</a></p>
        <p>Honest Seafood SA de CV con oficinas ubicadas en Río Amazonas #132 Loc 1A, Col del Valle, San Pedro Garza García, Nuevo León, C.P. 66220 asume íntegramente que al acceder a nuestra plataforma aceptas estos términos y condiciones.</p>
        <p>Estos términos aseguran la oferta, aceptación y consideración de pago para efectuar un proceso de atención a todos nuestros clientes de la manera más adecuada, ya sea a través de servicio digital o físico, pues nos comprometemos a conocer las necesidades respecto a la provisión de servicios/productos declarados de Amor a Mar.</p>
        <p>Cualquier uso de la terminología anterior u otras palabras en singular, plural, mayúscula y/o, él/ella o ellos, se consideran intercambiables, por lo tanto, se refieren a lo mismo.</p>
      </div>
    </ColorField>
  );
}
