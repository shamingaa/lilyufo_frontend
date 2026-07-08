import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { fetchOrder } from '../api/endpoints';
import type { Order } from '../types';
import { pageHeading, subtleLink } from '../styles';
import { formatCurrency } from '../utils/currency';

export function OrderConfirmation() {
  const { id } = useParams();
  const location = useLocation();
  const stateOrder = (location.state as { order?: Order } | null)?.order ?? null;

  const [order, setOrder] = useState<Order | null>(stateOrder);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (stateOrder || !id) return;
    fetchOrder(id)
      .then(setOrder)
      .catch(() => setError(null));
  }, [id, stateOrder]);

  return (
    <div className="mx-auto max-w-md text-center">
      <h1 className={pageHeading}>Thank you!</h1>
      <p className="mt-2 text-sm text-stone-500">
        Your order has been placed. The seller will contact you to arrange delivery and payment.
      </p>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {order && (
        <div className="mt-6 rounded-md border border-stone-200 bg-white p-4 text-left text-sm shadow-sm">
          <p>
            <span className="font-medium text-stone-700">Order #</span> {order.id}
          </p>
          <p>
            <span className="font-medium text-stone-700">Status:</span> {order.status}
          </p>
          <div className="mt-3 divide-y divide-stone-200">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between py-2 text-stone-600">
                <span>
                  {item.productName} ({item.size}) x{item.quantity}
                </span>
                <span>{formatCurrency(Number(item.unitPrice) * item.quantity)}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-right font-semibold text-stone-900">
            Total: {formatCurrency(order.totalAmount)}
          </p>
        </div>
      )}

      <Link to="/" className={`mt-6 inline-block ${subtleLink}`}>
        Continue shopping
      </Link>
    </div>
  );
}
