import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff, Loader2, Lock, Mail, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

const DEMO_ACCOUNTS = [
  { label: 'Admin', email: 'admin@store.com', password: 'admin123' },
  { label: 'Student', email: 'student@store.com', password: 'student123' },
];

export default function Login() {
  const { user, login } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (user) return <Navigate to={location.state?.from || '/'} replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  const fillDemo = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setError('');
  };

  return (
    <Card className="mx-auto mt-4 grid max-w-4xl gap-0 overflow-hidden p-0 md:grid-cols-2">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6 sm:p-10">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Store className="size-6" />
          </span>
          <h1 className="m-0 text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">Login to your Store2 account</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className="h-10 pl-9"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Your password"
              autoComplete="current-password"
              className="h-10 pr-10 pl-9"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="absolute top-1/2 right-1.5 -translate-y-1/2 text-muted-foreground"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </Button>
          </div>
        </div>

        <Button type="submit" size="lg" className="h-10 w-full" disabled={loading}>
          {loading && <Loader2 className="animate-spin" />}
          {loading ? 'Logging in...' : 'Login'}
        </Button>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          Try a demo account
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {DEMO_ACCOUNTS.map((a) => (
            <Button key={a.label} type="button" variant="outline" onClick={() => fillDemo(a)}>
              {a.label}
            </Button>
          ))}
        </div>

        <p className="text-center text-muted-foreground">
          New here?{' '}
          <Link to="/register" className="font-medium text-foreground underline underline-offset-4">
            Create an account
          </Link>
        </p>
      </form>

      <div className="relative hidden md:block">
        <img
          src="https://picsum.photos/seed/store2-login/800/1000"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-10 text-white">
          <p className="text-2xl font-semibold">Everything you love, delivered to your door.</p>
          <p className="mt-2 text-white/80">Free delivery, Cash on Delivery and easy 7-day returns.</p>
        </div>
      </div>
    </Card>
  );
}
