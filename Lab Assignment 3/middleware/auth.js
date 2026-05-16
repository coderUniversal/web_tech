// Middleware: check if user is logged in
const isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  req.flash('error', 'You must be logged in to access that page.');
  res.redirect('/auth/login');
};

// Middleware: check if user is an admin
const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  req.flash('error', 'Access Denied. Admins only.');
  res.redirect('/');
};

module.exports = { isLoggedIn, isAdmin };