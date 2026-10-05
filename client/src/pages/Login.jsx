import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate(location.state?.from || '/');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h1>Login</h1>
      {error && <p className="error">{error}</p>}
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button className="btn">Login</button>
      <p>New here? <Link to="/register">Create an account</Link></p>
    </form>
  );
}
