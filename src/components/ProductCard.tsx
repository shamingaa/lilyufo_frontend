import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { formatCurrency } from '../utils/currency';

export function ProductCard({ product }: { product: Product }) {
  const variants = product.variants ?? [];
  const outOfStock = variants.every((v) => v.stock <= 0);
  const prices = variants.map((v) => Number(v.price));
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
  const priceLabel =
    variants.length > 1 && minPrice !== maxPrice
      ? `From ${formatCurrency(minPrice)}`
      : formatCurrency(minPrice);

  return (
    <Link
      to={`/products/${product.id}`}
      className="group block overflow-hidden rounded-md border border-stone-200 bg-white transition hover:shadow-md"
    >
      <div className="aspect-square w-full overflow-hidden bg-stone-100">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-contain transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-stone-400">
            No image
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="truncate text-sm font-medium text-stone-800">{product.name}</h3>
        {product.category && (
          <p className="text-xs uppercase tracking-wide text-brand-700">{product.category.name}</p>
        )}
        <div className="mt-1 flex items-center justify-between">
          <span className="font-serif font-semibold text-stone-900">{priceLabel}</span>
          {outOfStock && <span className="text-xs text-stone-400">Out of stock</span>}
        </div>
      </div>
    </Link>
  );
}
