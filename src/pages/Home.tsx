import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchCategories, fetchProducts } from '../api/endpoints';
import type { Category, Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { pill, primaryButton } from '../styles';

export function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') ?? '';
  const search = searchParams.get('search') ?? '';

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => undefined);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchProducts({ category: category || undefined, search: search || undefined })
      .then((data) => setProducts(data.products))
      .catch(() => setError('Could not load products. Please try again.'))
      .finally(() => setLoading(false));
  }, [category, search]);

  function handleCategoryClick(slugOrId: string) {
    const next = new URLSearchParams(searchParams);
    if (slugOrId) {
      next.set('category', slugOrId);
    } else {
      next.delete('category');
    }
    setSearchParams(next);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (searchInput) {
      next.set('search', searchInput);
    } else {
      next.delete('search');
    }
    setSearchParams(next);
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-md border border-stone-300 bg-white px-4 py-2 text-base text-stone-800 shadow-sm placeholder:text-stone-400 focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 sm:w-64 sm:text-sm"
          />
          <button type="submit" className={primaryButton}>
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleCategoryClick('')} className={pill(!category)}>
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => handleCategoryClick(String(c.id))}
              className={pill(category === String(c.id))}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="text-sm text-stone-500">Loading products...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="text-sm text-stone-500">No products found.</p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
