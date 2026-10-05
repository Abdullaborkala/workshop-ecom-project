import { Link } from 'react-router-dom';
import { LogOut, Package, ShieldCheck, ShoppingCart, Store, User } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Navbar() {
  const { count } = useCart();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center gap-1 px-4">
        <Link to="/" className="mr-auto flex items-center gap-2 text-xl font-bold">
          <Store className="size-6" /> Store2
        </Link>

        <Button variant="ghost" asChild>
          <Link to="/cart">
            <ShoppingCart /> Cart
            {count > 0 && <Badge className="ml-1 px-1.5">{count}</Badge>}
          </Link>
        </Button>

        {user ? (
          <>
            {user.isAdmin && (
              <Button variant="ghost" asChild>
                <Link to="/admin"><ShieldCheck /> Admin</Link>
              </Button>
            )}
            <Button variant="ghost" asChild>
              <Link to="/my-orders"><Package /> My Orders</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/profile"><User /> Hi, {user.name}</Link>
            </Button>
            <Button variant="outline" onClick={logout}>
              <LogOut /> Logout
            </Button>
          </>
        ) : (
          <Button asChild>
            <Link to="/login"><User /> Login</Link>
          </Button>
        )}
      </nav>
    </header>
  );
}
