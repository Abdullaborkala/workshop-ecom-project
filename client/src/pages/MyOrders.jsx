import { useEffect, useState } from 'react';
import api from '../api/axios.js';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders/mine').then((res) => setOrders(res.data));
  }, []);

  if (orders.length === 0) return <p>No orders yet.</p>;

  return (
    <div>
      <h1>My Orders</h1>
      <table className="table">
        <thead>
          <tr><th>Date</th><th>Items</th><th>Total</th><th>Status</th></tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td>{new Date(o.createdAt).toLocaleString()}</td>
              <td>{o.items.map((i) => `${i.name} x ${i.qty}`).join(', ')}</td>
              <td>Rs. {o.total}</td>
              <td>{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
