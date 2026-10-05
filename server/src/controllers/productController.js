import Product from '../models/Product.js';

// GET /api/products
export const getProducts = async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
};

// GET /api/products/:id
export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};
