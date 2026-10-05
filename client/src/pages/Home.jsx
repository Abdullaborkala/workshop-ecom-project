import { useEffect, useState } from 'react';
import api from '../api/axios.js';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/products')
      .then((res) => setProducts(res.data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map((p) => (
          <li key={p._id}>{p.name} - Rs. {p.price}</li>
        ))}
      </ul>
    </div>
  );
}
