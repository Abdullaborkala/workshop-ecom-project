import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Product from './models/Product.js';

const img = (seed) => `https://picsum.photos/seed/${seed}/400/300`;

const products = [
  { name: 'Wireless Headphones', price: 2499, countInStock: 10, image: img('headphones'), description: 'Bluetooth over-ear headphones with 30h battery.' },
  { name: 'Smart Watch', price: 3999, countInStock: 5, image: img('watch'), description: 'Fitness tracking, heart rate and notifications.' },
  { name: 'Backpack', price: 1299, countInStock: 20, image: img('backpack'), description: 'Water resistant laptop backpack, 25L.' },
  { name: 'Running Shoes', price: 2999, countInStock: 8, image: img('shoes'), description: 'Lightweight shoes for daily running.' },
  { name: 'Coffee Mug', price: 299, countInStock: 50, image: img('mug'), description: 'Ceramic mug, 350ml.' },
  { name: 'Desk Lamp', price: 899, countInStock: 0, image: img('lamp'), description: 'LED lamp with 3 brightness levels.' },
];

await connectDB();
await Product.deleteMany();
await Product.insertMany(products);
console.log(`Seeded ${products.length} products`);
await mongoose.disconnect();
