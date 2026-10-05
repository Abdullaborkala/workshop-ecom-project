import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { useCart } from '../context/CartContext.jsx';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const placeOrder = async (e) => {
    e.preventDefault();
    try {
      await api.post('/orders', {
        items: items.map((i) => ({ product: i._id, qty: i.qty })),
        address,
      });
      clearCart();
      navigate('/my-orders');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  if (items.length === 0) return <p>Your cart is empty.</p>;

  return (
    <form className="form" onSubmit={placeOrder}>
      <h1>Checkout</h1>
      {error && <p className="error">{error}</p>}
      {items.map((i) => (
        <p key={i._id}>{i.name} x {i.qty} = Rs. {i.price * i.qty}</p>
      ))}
      <h3>Total: Rs. {total}</h3>
      <textarea placeholder="Shipping address" value={address} onChange={(e) => setAddress(e.target.value)} required />
      <button className="btn">Place order (Cash on Delivery)</button>
    </form>
  );
}
