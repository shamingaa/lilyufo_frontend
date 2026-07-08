import { useEffect, useState } from 'react';
import { fetchOrders, updateOrderStatus } from '../../api/endpoints';
import type { Order, OrderStatus } from '../../types';
import { OrderStatusBadge } from '../../components/OrderStatusBadge';
import { apiErrorMessage } from '../../api/client';
import { card } from '../../styles';
import { formatCurrency } from '../../utils/currency';

const STATUSES: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setLoading(true);
    fetchOrders()
      .then(setOrders)
      .catch(() => setError('Could not load orders.'))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleStatusChange(id: number, status: OrderStatus) {
    setError(null);
    try {
      await updateOrderStatus(id, status);
      load();
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not update order status.'));
    }
  }

  if (loading) return <p className="text-sm text-stone-500">Loading...</p>;

  return (
    <div>
      <h2 className="mb-4 font-serif text-lg font-semibold text-stone-900">Orders</h2>
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      {orders.length === 0 && <p className="text-sm text-stone-500">No orders yet.</p>}

      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <div key={order.id} className={`${card} p-4`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-sm font-medium text-stone-700">Order #{order.id}</span>
                <span className="ml-2 text-xs text-stone-500">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <OrderStatusBadge status={order.status} />
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                  className="rounded-md border border-stone-300 px-2 py-1 text-xs text-stone-800 focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-2 text-xs text-stone-500">
              {order.customerName} &middot; {order.customerPhone} &middot; {order.shippingAddress}
            </div>

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
