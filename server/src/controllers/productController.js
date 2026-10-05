import Product from '../models/Product.js';

const pickFields = ({ name, description, price, image, countInStock }) =>
  ({ name, description, price, image, countInStock });

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

// POST /api/products (admin)
export const createProduct = async (req, res) => {
  const product = await Product.create(pickFields(req.body));
  res.status(201).json(product);
};

// PUT /api/products/:id (admin)
export const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, pickFields(req.body), {
    returnDocument: 'after',
    runValidators: true,
  });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

// DELETE /api/products/:id (admin)
export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product deleted' });
};
