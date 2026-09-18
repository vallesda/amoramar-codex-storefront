'use client';
import { useActionState } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/cart/cart-context';
import Container from '@/components/ui/container';
import Button from '@/components/ui/button';
import { formatMoney } from '@/lib/format';
import { beginCheckout } from './actions';
export default function Checkout() {
  const { cart, subtotalCents } = useCart();
  const [state, action, pending] = useActionState(beginCheckout, { error: null });
  return <Container className="py-16">
    <h1 className="font-display text-5xl">Tu pedido, <em>del mar a tu mesa.</em></h1>
    <p className="mt-5 max-w-xl text-muted">Confirma tus productos. En el siguiente paso podrás revisar la entrega y pagar de forma segura.</p>
    {cart.lines.length === 0 ? <p className="mt-10">Tu carrito está vacío. <Link href="/search" className="underline">Ver catálogo</Link></p> :
      <form action={action} className="mt-10 max-w-2xl">
        <ul>{cart.lines.map(line => <li key={line.productId} className="flex justify-between gap-4 border-b border-border py-4"><span>{line.quantity} × {line.name}</span><span>{formatMoney({ amountCents: line.quantity * line.unitPrice.amountCents, currency: 'MXN' })}</span></li>)}</ul>
        <p className="my-6 text-xl">Subtotal estimado: {formatMoney({ amountCents: subtotalCents, currency: 'MXN' })}</p>
        <p className="mb-6 text-sm text-muted">El precio final, envío y disponibilidad se confirman al pagar.</p>
        <p className="mb-6 text-sm text-muted">Consulta nuestros <Link href="/terminos-y-condiciones" className="underline">términos y condiciones</Link> y la <Link href="/envios" className="underline">política de envíos</Link>.</p>
        <input type="hidden" name="lines" value={JSON.stringify(cart.lines.map(l => ({ productId: l.productId, quantity: l.quantity })))} />
        {state.error && <p role="alert" className="mb-5">{state.error}</p>}
        <Button type="submit" disabled={pending}>{pending ? 'Preparando tu pago…' : 'Continuar al pago'}</Button>
        <Link className="ml-6 underline" href="/search">Seguir comprando</Link>
      </form>}
  </Container>;
}
