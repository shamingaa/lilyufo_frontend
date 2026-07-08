import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { pageHeading, primaryButton, subtleLink } from '../styles';
import { formatCurrency } from '../utils/currency';

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
      />
    </svg>
  );
}

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
          <div key={item.variantId} className="flex items-center gap-2 py-4 sm:gap-4">
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
              className="w-12 rounded-md border border-stone-300 px-2 py-1 text-base text-stone-800 focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 sm:w-16 sm:text-sm"
            />
            <p className="w-20 text-right text-sm font-medium text-stone-800 sm:w-28">
              {formatCurrency(item.price * item.quantity)}
            </p>
            <button
              onClick={() => removeItem(item.variantId)}
              aria-label="Remove"
              title="Remove"
              className="shrink-0 text-red-600 transition hover:text-red-700"
            >
              <TrashIcon />
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
