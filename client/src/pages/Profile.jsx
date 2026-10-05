import { useEffect, useState } from 'react';
import api from '../api/axios.js';

export default function Profile() {
  const [me, setMe] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/auth/me')
      .then((res) => setMe(res.data))
      .catch((err) => setError(err.response?.data?.message || err.message));
  }, []);

  if (error) return <p className="error">{error}. Please logout and login again.</p>;
  if (!me) return <p>Loading...</p>;

  return (
    <div>
      <h1>My Profile</h1>
      <p>Name: {me.name}</p>
      <p>Email: {me.email}</p>
      <p>Role: {me.isAdmin ? 'Admin' : 'Customer'}</p>
    </div>
  );
}
