import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { dangerLink, pageHeading, primaryButton, subtleLink } from '../styles';
import { formatCurrency } from '../utils/currency';

export function Cart() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="text-center">
        <p className="text-sm text-stone-500">Your cart is empty.</p>
        <Link to="/" className={`mt-4 inline-block ${subtleLink}`}>
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className={`mb-6 ${pageHeading}`}>Your Cart</h1>
      <div className="divide-y divide-stone-200 rounded-md border border-stone-200 bg-white px-4 shadow-sm">
        {items.map((item) => (
          <div key={item.variantId} className="flex items-center gap-4 py-4">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-stone-100">
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.name} className="h-full w-full object-contain" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-stone-800">
                {item.name} <span className="text-stone-500">({item.size})</span>
              </p>
              <p className="text-sm text-stone-500">{formatCurrency(item.price)}</p>
            </div>
            <input
              type="number"
              min={1}
              max={item.stock}
              value={item.quantity}
              onChange={(e) => updateQuantity(item.variantId, Number(e.target.value))}
              className="w-16 rounded-md border border-stone-300 px-2 py-1 text-sm text-stone-800 focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
            />
            <p className="w-28 text-right text-sm font-medium text-stone-800">
              {formatCurrency(item.price * item.quantity)}
            </p>
            <button onClick={() => removeItem(item.variantId)} className={dangerLink}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-stone-200 pt-4">
        <span className="font-serif text-lg font-semibold text-stone-900">
          Total: {formatCurrency(totalPrice)}
        </span>
        <button onClick={() => navigate('/checkout')} className={primaryButton}>
          Checkout
        </button>
      </div>
    </div>
  );
}
