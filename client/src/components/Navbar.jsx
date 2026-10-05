import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
  const { count } = useCart();

  return (
    <nav className="navbar">
      <Link to="/" className="brand">Store2</Link>
      <Link to="/cart">Cart ({count})</Link>
    </nav>
  );
}
