const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Import routes
const productsRoute = require("./routes/products");
const adminRoute = require("./routes/admin");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");
    })
    .catch((err) => {
        console.log("MongoDB connection failed!", err);
    });

// Use routes
app.get("/", (req, res) => {
    res.render("index");
});

app.use("/products", productsRoute);
app.use("/admin", adminRoute); 

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});