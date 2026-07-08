import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder } from '../api/endpoints';
import { apiErrorMessage } from '../api/client';
import { input, label, pageHeading, primaryButton } from '../styles';
import { formatCurrency } from '../utils/currency';

export function Checkout() {
  const { items, totalPrice, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState(user?.name ?? '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    if (!orderPlaced && items.length === 0) {
      navigate('/cart', { replace: true });
    }
  }, [items.length, orderPlaced, navigate]);

  if (items.length === 0 && !orderPlaced) {
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const order = await placeOrder({
        items: items.map((item) => ({ variantId: item.variantId, quantity: item.quantity })),
        customerName: customerName || undefined,
        customerPhone,
        shippingAddress,
      });
      setOrderPlaced(true);
      clear();
      navigate(`/order-confirmation/${order.id}`, { state: { order } });
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not place order. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className={`mb-6 ${pageHeading}`}>Checkout</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-md border border-stone-200 bg-white p-6 shadow-sm"
      >
        <label className={label}>
          Full name
          <input
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className={input}
          />
        </label>
        <label className={label}>
          Phone number
          <input
            required
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className={input}
          />
        </label>
        <label className={label}>
          Shipping address
          <textarea
            required
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            rows={3}
            className={input}
          />
        </label>

        <div className="rounded-md bg-stone-50 p-4 text-sm text-stone-600">
          <p>
            No payment is taken here. Once you place this order, the seller will contact you to
            arrange payment (e.g. bank transfer or cash on delivery) and delivery.
          </p>
          <p className="mt-1 font-semibold text-stone-900">Total: {formatCurrency(totalPrice)}</p>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={submitting} className={primaryButton}>
          {submitting ? 'Placing order...' : 'Place order'}
        </button>
      </form>
    </div>
  );
}
