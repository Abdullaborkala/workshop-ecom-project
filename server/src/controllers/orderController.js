import Order, { ORDER_STATUSES } from '../models/Order.js';
import Product from '../models/Product.js';

// POST /api/orders   body: { items: [{ product, qty }], address }
export const placeOrder = async (req, res) => {
  const { items, address } = req.body;
  if (!items?.length) return res.status(400).json({ message: 'Cart is empty' });

  // Prices come from the database, never from the client
  const orderItems = [];
  for (const item of items) {
    const qty = Number(item.qty);
    if (!Number.isInteger(qty) || qty < 1) return res.status(400).json({ message: 'Invalid quantity' });
    const product = await Product.findById(item.product);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (qty > product.countInStock) {
      return res.status(400).json({ message: `Only ${product.countInStock} left of ${product.name}` });
    }
    orderItems.push({ product: product._id, name: product.name, price: product.price, qty });
  }

  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, { $inc: { countInStock: -item.qty } });
  }

  const total = orderItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const order = await Order.create({ user: req.user._id, items: orderItems, address, total });
  res.status(201).json(order);
};

// GET /api/orders/mine
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

// GET /api/orders (admin)
export const getAllOrders = async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
};

// PUT /api/orders/:id/status (admin)   body: { status }
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  if (!ORDER_STATUSES.includes(status)) return res.status(400).json({ message: 'Invalid status' });

  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.status === 'Cancelled') {
    return res.status(400).json({ message: 'Cancelled orders cannot be changed' });
  }

  // Cancelling puts the items back in stock
  if (status === 'Cancelled') {
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { countInStock: item.qty } });
    }
  }

  order.status = status;
  await order.save();
  res.json(order);
};
