'use server';
import { redirect } from 'next/navigation';
import { syncCheckoutCart } from '@/lib/commerce/shopify/cart-session';
import { CommerceError } from '@/lib/commerce/shopify/errors';
import { checkoutLines } from '@/lib/commerce/shopify/checkout-input';
export type CheckoutState = { error: string | null };
export async function beginCheckout(_previous: CheckoutState, form: FormData): Promise<CheckoutState> {
  let url: string;
  try {
    const raw = String(form.get('lines') ?? '[]');
    if (raw.length > 25000) return { error: 'El carrito es demasiado grande.' };
    const lines = checkoutLines(JSON.parse(raw));
    url = await syncCheckoutCart(lines);
  } catch (error) {
    return { error: error instanceof CommerceError ? error.message : 'No pudimos iniciar el pago. Revisa tu carrito e inténtalo de nuevo.' };
  }
  // Shopify is the authority for prices, shipping, payment and order creation.
  // No order is asserted or local cart cleared before payment.
  redirect(url);
}
