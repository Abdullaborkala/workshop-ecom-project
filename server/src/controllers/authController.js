import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const userResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  isAdmin: user.isAdmin,
  token: createToken(user._id),
});

// POST /api/auth/register
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }
  if (await User.findOne({ email: String(email).toLowerCase() })) {
    return res.status(400).json({ message: 'Email already registered' });
  }
  const user = await User.create({ name, email, password });
  res.status(201).json(userResponse(user));
};

// POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: String(email).toLowerCase() });
  if (!user || !(await user.matchPassword(String(password)))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  res.json(userResponse(user));
};

// GET /api/auth/me
export const getMe = (req, res) => res.json(req.user);
