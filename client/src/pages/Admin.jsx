import { useEffect, useState } from 'react';
import api from '../api/axios.js';

const emptyForm = { name: '', description: '', price: '', image: '', countInStock: 0 };

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const loadProducts = () => api.get('/products').then((res) => setProducts(res.data));

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await api.put(`/products/${editingId}`, form);
      else await api.post('/products', form);
      setForm(emptyForm);
      setEditingId(null);
      setError('');
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const startEdit = (p) => {
    setEditingId(p._id);
    setForm({ name: p.name, description: p.description, price: p.price, image: p.image, countInStock: p.countInStock });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  return (
    <div>
      <h1>Admin - Products</h1>

      <form className="form" onSubmit={handleSubmit}>
        <h3>{editingId ? 'Edit product' : 'Add product'}</h3>
        {error && <p className="error">{error}</p>}
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} />
        <input name="countInStock" type="number" placeholder="Stock" value={form.countInStock} onChange={handleChange} />
        <button className="btn">{editingId ? 'Update' : 'Create'}</button>
        {editingId && (
          <button type="button" className="btn" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</button>
        )}
      </form>

      <table className="table">
        <thead>
          <tr><th>Name</th><th>Price</th><th>Stock</th><th></th></tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>Rs. {p.price}</td>
              <td>{p.countInStock}</td>
              <td>
                <button className="btn" onClick={() => startEdit(p)}>Edit</button>{' '}
                <button className="btn btn-danger" onClick={() => handleDelete(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
