const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Product = require('../models/Product');
const { verifyToken, verifyAdmin } = require('../middleware/verifyToken');

// ─────────────────────────────────────────
// POST /api/v1/auth/login — Generate JWT
// ─────────────────────────────────────────
router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { user_id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─────────────────────────────────────────
// GET /api/v1/products — Public
// ─────────────────────────────────────────
router.get('/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.search) filter.name = { $regex: req.query.search, $options: 'i' };
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
    }

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter).skip(skip).limit(limit);

    res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
      products
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─────────────────────────────────────────
// GET /api/v1/products/:id — Public
// ─────────────────────────────────────────
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    res.status(200).json({ success: true, product });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─────────────────────────────────────────
// GET /api/v1/user/profile — Protected
// ─────────────────────────────────────────
router.get('/user/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.user_id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.status(200).json({ success: true, user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─────────────────────────────────────────
// POST /api/v1/orders — Protected
// ─────────────────────────────────────────
router.post('/orders', verifyToken, async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ success: false, message: 'No products in order.' });
    }

    let total = 0;
    const orderItems = [];

    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.productId} not found.` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}.` });
      }
      orderItems.push({
        product: product.name,
        quantity: item.quantity,
        price: product.price,
        subtotal: product.price * item.quantity
      });
      total += product.price * item.quantity;
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: {
        user: req.user.user_id,
        items: orderItems,
        total,
        placedAt: new Date()
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;