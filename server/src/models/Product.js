import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: '' },
    countInStock: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
