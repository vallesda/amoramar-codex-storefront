import type { Product } from '@/lib/commerce/types';
import ProductCard from './product-card';
import DiscoveryGrid from './discovery-grid';

/**
 * One grid, every collection: 2 columns on mobile, 3 from `sm`, 4 from `lg`.
 *
 * Two columns on mobile and not one — the weekly-pantry shopper is comparing,
 * and a single column turns comparison into scrolling.
 *
 * The vertical gap is nearly twice the horizontal one. Each card now ends in a
 * hairline rule, and rules stacked at an even gap read as a table the shopper
 * did not ask for; the extra air is what keeps a card reading as one object
 * with a line under it rather than as a row in a ledger.
 */
export default function ProductGrid({ products, centered = false }: { products: Product[]; centered?: boolean }) {
  if (products.length === 0) {
    return (
      <p className="border-t border-border py-12 text-center text-muted">
        No hay productos disponibles por ahora.
      </p>
    );
  }

  return (
    <DiscoveryGrid centered={centered}>
      {products.map((product) => (
        <li key={product.id} className={centered ? 'w-[calc((100%-1.25rem)/2)] sm:w-[calc((100%-2.5rem)/3)] md:w-[calc((100%-3rem)/3)] lg:w-[calc((100%-4.5rem)/4)]' : undefined}>
          <ProductCard product={product} />
        </li>
      ))}
    </DiscoveryGrid>
  );
}
