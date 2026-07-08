import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteProduct, fetchProducts } from '../../api/endpoints';
import type { Product } from '../../types';
import { apiErrorMessage } from '../../api/client';
import { dangerLink, primaryButton } from '../../styles';
import { formatCurrency } from '../../utils/currency';

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setLoading(true);
    fetchProducts()
      .then((data) => setProducts(data.products))
      .catch(() => setError('Could not load products.'))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function priceLabel(p: Product): string {
    const prices = p.variants.map((v) => Number(v.price));
    if (prices.length === 0) return formatCurrency(0);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? formatCurrency(min) : `${formatCurrency(min)} – ${formatCurrency(max)}`;
  }

  function totalStock(p: Product): number {
    return p.variants.reduce((sum, v) => sum + v.stock, 0);
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      load();
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not delete product.'));
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-serif text-lg font-semibold text-stone-900">Products</h2>
        <Link to="/admin/products/new" className={primaryButton}>
          Add product
        </Link>
      </div>

      {loading && <p className="text-sm text-stone-500">Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="divide-y divide-stone-200 rounded-md border border-stone-200 bg-white px-4 shadow-sm">
        {products.map((p) => (
          <div key={p.id} className="flex items-center gap-4 py-3">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-stone-100">
              {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="h-full w-full object-contain" />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-stone-800">{p.name}</p>
              <p className="text-xs text-stone-500">
                {priceLabel(p)} &middot; {totalStock(p)} in stock
                {p.category ? ` · ${p.category.name}` : ''}
              </p>
            </div>
            <Link to={`/admin/products/${p.id}/edit`} className="text-xs text-stone-600 hover:underline">
              Edit
            </Link>
            <button onClick={() => handleDelete(p.id)} className={dangerLink}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
