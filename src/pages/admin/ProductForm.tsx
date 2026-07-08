import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createProduct,
  fetchCategories,
  fetchProduct,
  updateProduct,
} from '../../api/endpoints';
import type { ProductFormValues, VariantFormValues } from '../../api/endpoints';
import type { Category } from '../../types';
import { apiErrorMessage } from '../../api/client';
import { input, label, primaryButton, secondaryButton } from '../../styles';
import { CurrencyInput } from '../../components/CurrencyInput';

const EMPTY_VARIANT: VariantFormValues = { size: '', price: '', stock: '' };

const EMPTY: ProductFormValues = {
  name: '',
  description: '',
  categoryId: '',
  variants: [EMPTY_VARIANT],
  image: null,
};

export function AdminProductForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [values, setValues] = useState<ProductFormValues>(EMPTY);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!id) return;
    fetchProduct(id).then((product) => {
      setValues({
        name: product.name,
        description: product.description ?? '',
        categoryId: product.categoryId ? String(product.categoryId) : '',
        variants:
          product.variants.length > 0
            ? product.variants.map((v) => ({ size: v.size, price: v.price, stock: String(v.stock) }))
            : [EMPTY_VARIANT],
        image: null,
      });
      setCurrentImageUrl(product.imageUrl);
    });
  }, [id]);

  useEffect(() => {
    return () => {
      if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
    };
  }, [localPreviewUrl]);

  function handleImageChange(file: File | null) {
    setValues((v) => ({ ...v, image: file }));
    setLocalPreviewUrl(file ? URL.createObjectURL(file) : null);
  }

  function updateVariant(index: number, field: keyof VariantFormValues, fieldValue: string) {
    setValues((v) => ({
      ...v,
      variants: v.variants.map((row, i) => (i === index ? { ...row, [field]: fieldValue } : row)),
    }));
  }

  function addVariantRow() {
    setValues((v) => ({ ...v, variants: [...v.variants, { ...EMPTY_VARIANT }] }));
  }

  function removeVariantRow(index: number) {
    setValues((v) => ({ ...v, variants: v.variants.filter((_, i) => i !== index) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (isEditing && id) {
        await updateProduct(Number(id), values);
      } else {
        await createProduct(values);
      }
      navigate('/admin');
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not save product.'));
    } finally {
      setSubmitting(false);
    }
  }

  const previewSrc = localPreviewUrl ?? currentImageUrl;

  return (
    <div className="mx-auto max-w-md">
      <h2 className="mb-4 font-serif text-lg font-semibold text-stone-900">
        {isEditing ? 'Edit product' : 'Add product'}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-md border border-stone-200 bg-white p-6 shadow-sm"
      >
        <label className={label}>
          Name
          <input
            required
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            className={input}
          />
        </label>

        <label className={label}>
          Description
          <textarea
            value={values.description}
            onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
            rows={3}
            className={input}
          />
        </label>

        <div>
          <p className={label}>Sizes &amp; pricing</p>
          <div className="mt-1 flex flex-col gap-2">
            {values.variants.map((variant, index) => (
              <div key={index} className="flex items-end gap-2">
                <div className="w-20">
                  <span className="text-xs text-stone-500">Size</span>
                  <input
                    required
                    value={variant.size}
                    onChange={(e) => updateVariant(index, 'size', e.target.value)}
                    placeholder="M"
                    className="mt-1 w-full rounded-md border border-stone-300 bg-white px-2 py-2 text-base text-stone-800 focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 sm:text-sm"
                  />
                </div>
                <div className="flex-1">
                  <span className="text-xs text-stone-500">Price</span>
                  <CurrencyInput
                    required
                    value={variant.price}
                    onChange={(raw) => updateVariant(index, 'price', raw)}
                  />
                </div>
                <div className="w-20">
                  <span className="text-xs text-stone-500">Stock</span>
                  <input
                    required
                    type="number"
                    min="0"
                    value={variant.stock}
                    onChange={(e) => updateVariant(index, 'stock', e.target.value)}
                    className="mt-1 w-full rounded-md border border-stone-300 bg-white px-2 py-2 text-base text-stone-800 focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 sm:text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeVariantRow(index)}
                  disabled={values.variants.length <= 1}
                  className="mb-0.5 h-9 shrink-0 text-xs text-stone-400 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addVariantRow} className={`mt-3 ${secondaryButton}`}>
            + Add another size
          </button>
        </div>

        <label className={label}>
          Category
          <select
            value={values.categoryId}
            onChange={(e) => setValues((v) => ({ ...v, categoryId: e.target.value }))}
            className={input}
          >
            <option value="">No category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className={label}>
          Image
          {previewSrc && (
            <img
              src={previewSrc}
              alt="Product preview"
              className="mt-2 h-32 w-32 rounded-md border border-stone-200 bg-stone-50 object-contain"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
            className="mt-2 w-full text-sm text-stone-600"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={submitting} className={primaryButton}>
          {submitting ? 'Saving...' : 'Save product'}
        </button>
      </form>
    </div>
  );
}
