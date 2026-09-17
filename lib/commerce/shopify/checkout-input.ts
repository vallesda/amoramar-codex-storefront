import { CommerceError } from './errors';
export function checkoutLines(input: unknown): { merchandiseId: string; quantity: number }[] {
  if (!Array.isArray(input) || input.length === 0 || input.length > 100) {
    throw new CommerceError('invalid_cart', 'Agrega entre 1 y 100 presentaciones al carrito.', 422);
  }
  const merged = new Map<string, number>();
  for (const line of input) {
    if (!line || typeof line !== 'object' || typeof line.productId !== 'string' || !/^gid:\/\/shopify\/ProductVariant\/\d+$/.test(line.productId) || !Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > 99) {
      throw new CommerceError('invalid_line', 'Hay una presentación inválida. Quita ese artículo y agrégalo de nuevo.', 422);
    }
    const quantity = (merged.get(line.productId) ?? 0) + line.quantity;
    if (quantity > 99) throw new CommerceError('invalid_quantity', 'El máximo es 99 unidades por presentación.', 422);
    merged.set(line.productId, quantity);
  }
  return [...merged].map(([merchandiseId, quantity]) => ({ merchandiseId, quantity }));
}
