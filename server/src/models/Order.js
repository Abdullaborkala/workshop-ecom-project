import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  price: Number,
  qty: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    address: { type: String, required: true },
    total: { type: Number, required: true },
    status: { type: String, default: 'Placed' },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
