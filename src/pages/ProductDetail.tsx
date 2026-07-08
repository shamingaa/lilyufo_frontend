import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProduct } from '../api/endpoints';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { pill, primaryButton } from '../styles';
import { formatCurrency } from '../utils/currency';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchProduct(id)
      .then((fetched) => {
        setProduct(fetched);
        const firstInStock = fetched.variants.find((v) => v.stock > 0);
        setSelectedVariantId((firstInStock ?? fetched.variants[0])?.id ?? null);
      })
      .catch(() => setError('Product not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-sm text-stone-500">Loading...</p>;
  if (error || !product) return <p className="text-sm text-red-600">{error ?? 'Not found'}</p>;

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId) ?? null;
  const outOfStock = !selectedVariant || selectedVariant.stock <= 0;

  function handleSelectVariant(variantId: number) {
    setSelectedVariantId(variantId);
    setQuantity(1);
    setAdded(false);
  }

  function handleAddToCart() {
    if (!product || !selectedVariant) return;
    addItem(product, selectedVariant, quantity);
    setAdded(true);
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="aspect-square overflow-hidden rounded-md border border-stone-200 bg-stone-100">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-contain" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-stone-400">No image</div>
        )}
      </div>

      <div>
        <button onClick={() => navigate(-1)} className="mb-4 text-sm text-stone-500 hover:text-stone-900">
          &larr; Back
        </button>
        <h1 className="font-serif text-2xl font-semibold text-stone-900">{product.name}</h1>
        {product.category && (
          <p className="mt-1 text-xs uppercase tracking-wide text-brand-700">{product.category.name}</p>
        )}
        <p className="mt-4 text-xl font-semibold text-stone-900">
          {formatCurrency(selectedVariant?.price ?? 0)}
        </p>
        {product.description && (
          <p className="mt-4 whitespace-pre-line text-sm text-stone-600">{product.description}</p>
        )}

        <div className="mt-6">
          <p className="mb-2 text-sm font-medium text-stone-600">Size</p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => handleSelectVariant(variant.id)}
                disabled={variant.stock <= 0}
                className={`${pill(variant.id === selectedVariantId)} ${
                  variant.stock <= 0 ? 'cursor-not-allowed opacity-40' : ''
                }`}
              >
                {variant.size}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-4 text-sm text-stone-500">
          {outOfStock ? 'Out of stock' : `${selectedVariant.stock} in stock`}
        </p>

        {!outOfStock && (
          <div className="mt-6 flex items-center gap-3">
            <input
              type="number"
              min={1}
              max={selectedVariant.stock}
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, Math.min(selectedVariant.stock, Number(e.target.value))))
              }
              className="w-20 rounded-md border border-stone-300 bg-white px-3 py-2 text-base text-stone-800 focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 sm:text-sm"
            />
            <button onClick={handleAddToCart} className={primaryButton}>
              Add to cart
            </button>
          </div>
        )}
        {added && <p className="mt-2 text-sm text-emerald-600">Added to cart.</p>}
      </div>
    </div>
  );
}
