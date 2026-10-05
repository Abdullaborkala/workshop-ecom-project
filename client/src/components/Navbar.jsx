import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { count } = useCart();
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="brand">Store2</Link>
      <Link to="/cart">Cart ({count})</Link>
      {user ? (
        <>
          <Link to="/profile">Hi, {user.name}</Link>
          <button className="btn" onClick={logout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
}
