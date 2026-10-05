import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';

const STATUSES = ['Placed', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  const loadOrders = () => api.get('/orders').then((res) => setOrders(res.data));

  useEffect(() => {
    loadOrders();
  }, []);

  const changeStatus = async (id, status) => {
    if (status === 'Cancelled' && !window.confirm('Cancel this order? Items go back to stock.')) return;
    try {
      await api.put(`/orders/${id}/status`, { status });
      setError('');
      loadOrders();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div>
      <h1>Admin - Orders</h1>
      <p><Link to="/admin">Back to products</Link></p>
      {error && <p className="error">{error}</p>}
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <table className="table">
          <thead>
            <tr><th>Date</th><th>Customer</th><th>Items</th><th>Address</th><th>Total</th><th>Status</th></tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>{new Date(o.createdAt).toLocaleString()}</td>
                <td>{o.user?.name}<br />{o.user?.email}</td>
                <td>{o.items.map((i) => `${i.name} x ${i.qty}`).join(', ')}</td>
                <td>{o.address}</td>
                <td>Rs. {o.total}</td>
                <td>
                  <select value={o.status} disabled={o.status === 'Cancelled'}
                    onChange={(e) => changeStatus(o._id, e.target.value)}>
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
