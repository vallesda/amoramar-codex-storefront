import type { Metadata } from 'next';
import Checkout from './shopify-checkout';
export const metadata: Metadata = { title: 'Tu pedido', robots: { index: false, follow: false } };
export default function Page() { return <Checkout />; }
