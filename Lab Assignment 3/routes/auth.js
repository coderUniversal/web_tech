const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Secret admin registration key — change this to whatever you want
const ADMIN_SECRET_KEY = 'abdullahMaher';

// GET /auth/register
router.get('/register', (req, res) => {
  res.render('auth/register');
});

// POST /auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, adminKey } = req.body;
  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash('error', 'Email already registered. Please login.');
      return res.redirect('/auth/register');
    }

    // Check password length
    if (password.length < 6) {
      req.flash('error', 'Password must be at least 6 characters.');
      return res.redirect('/auth/register');
    }

    // Determine role based on admin key
    let role = 'customer';
    if (adminKey && adminKey === ADMIN_SECRET_KEY) {
      role = 'admin';
    } else if (adminKey && adminKey !== ADMIN_SECRET_KEY) {
      req.flash('error', 'Invalid admin key. Leave it blank to register as a customer.');
      return res.redirect('/auth/register');
    }

    // Create user
    const user = await User.create({ name, email, password, role });
    req.session.user = { id: user._id, name: user.name, role: user.role };
    req.flash('success', `Welcome, ${user.name}! Account created successfully.`);

    // Redirect based on role
    if (user.role === 'admin') {
      res.redirect('/admin');
    } else {
      res.redirect('/home');
    }

  } catch (err) {
    console.error('REGISTER ERROR:', err);
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/auth/register');
  }
});

// GET /auth/login
router.get('/login', (req, res) => {
  res.render('auth/login');
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/auth/login');
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/auth/login');
    }

    // Save user to session
    req.session.user = { id: user._id, name: user.name, role: user.role };
    req.flash('success', `Welcome back, ${user.name}!`);

    // Redirect based on role
    if (user.role === 'admin') {
      res.redirect('/admin');
    } else {
      res.redirect('/home');
    }

  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/auth/login');
  }
});

// GET /auth/logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error(err);
    res.redirect('/');
  });
});

module.exports = router;