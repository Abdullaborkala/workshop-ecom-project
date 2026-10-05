import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios.js';
import { useCart } from '../context/CartContext.jsx';

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => setError(err.response?.data?.message || err.message));
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!product) return <p>Loading...</p>;

  return (
    <div className="details">
      <img src={product.image} alt={product.name} />
      <div>
        <h1>{product.name}</h1>
        <p className="price">Rs. {product.price}</p>
        <p>{product.description}</p>
        <p>{product.countInStock > 0 ? `In stock: ${product.countInStock}` : 'Out of stock'}</p>
        <button className="btn" disabled={product.countInStock === 0} onClick={() => addToCart(product)}>
          Add to cart
        </button>
      </div>
    </div>
  );
}
