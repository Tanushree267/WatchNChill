// server/routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';

const router = express.Router();

/**
 * POST /auth/register
 * Body: { name, email, password, image? }
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, image } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      // conflict — user already exists
      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
      _id: email, // using email as ID is simple for exam/demo
      name,
      email,
      image: image || 'default.jpg',
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * POST /auth/login
 * Body: { email, password }
 *
 * Responses:
 * - 400 when request is malformed
 * - 404 when user not found
 * - 401 when password mismatch
 * - 200 when success
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // user not registered
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const match = bcrypt.compareSync(password, user.password);
    if (!match) {
      // wrong password
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // success: return a safe user object (no password)
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: { name: user.name, email: user.email, image: user.image },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;