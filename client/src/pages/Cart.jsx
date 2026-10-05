import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function Cart() {
  const { items, updateQty, removeFromCart, total } = useCart();

  if (items.length === 0) return <p>Your cart is empty. <Link to="/">Go shopping</Link></p>;

  return (
    <div>
      <h1>Cart</h1>
      <table className="table">
        <thead>
          <tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th><th></th></tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i._id}>
              <td>{i.name}</td>
              <td>Rs. {i.price}</td>
              <td>
                <input type="number" min="1" max={i.countInStock} value={i.qty}
                  onChange={(e) => updateQty(i._id, Math.max(1, Number(e.target.value)))} />
              </td>
              <td>Rs. {i.price * i.qty}</td>
              <td><button className="btn btn-danger" onClick={() => removeFromCart(i._id)}>Remove</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Total: Rs. {total}</h2>
    </div>
  );
}
