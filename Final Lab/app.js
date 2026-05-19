const salesRoute = require('./routes/sales');
const authRoute = require("./routes/auth");
const apiRoute = require('./routes/api');
const express = require("express");
const mongoose = require("mongoose");
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const flash = require('connect-flash');
require("dotenv").config();

const app = express();

// Import routes
const productsRoute = require("./routes/products");
const adminRoute = require("./routes/admin");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully!"))
    .catch((err) => console.log("MongoDB connection failed!", err));

// Session
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// Flash
app.use(flash());

// Make flash messages & user available in all views
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.session.user || null;
  next();
});

// Use routes
app.get("/", (req, res) => {
    res.render("portal");
});

app.get("/home", (req, res) => {
    res.render("index");
});

app.use("/products", productsRoute);
app.use("/admin", adminRoute);
app.use("/auth", authRoute);
app.use('/api/v1', apiRoute);
app.use("/sales", salesRoute);

// This makes /api/sales-data point to the same /data handler
app.get("/api/sales-data", (req, res, next) => {
    req.url = "/data";
    salesRoute(req, res, next);
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});