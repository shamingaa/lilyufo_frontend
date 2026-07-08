import { useEffect, useState } from 'react';
import { fetchOrders } from '../api/endpoints';
import type { Order } from '../types';
import { OrderStatusBadge } from '../components/OrderStatusBadge';
import { card, pageHeading } from '../styles';
import { formatCurrency } from '../utils/currency';

export function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders()
      .then(setOrders)
      .catch(() => setError('Could not load your orders.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-stone-500">Loading...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (orders.length === 0) return <p className="text-sm text-stone-500">You have no orders yet.</p>;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className={`mb-6 ${pageHeading}`}>My Orders</h1>
      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <div key={order.id} className={`${card} p-4`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-stone-700">Order #{order.id}</span>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="mt-1 text-xs text-stone-500">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
            <div className="mt-3 divide-y divide-stone-200 text-sm text-stone-600">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between py-1.5">
                  <span>
                    {item.productName} ({item.size}) x{item.quantity}
                  </span>
                  <span>{formatCurrency(Number(item.unitPrice) * item.quantity)}</span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-right text-sm font-semibold text-stone-900">
              Total: {formatCurrency(order.totalAmount)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
