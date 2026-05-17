const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/Product");

const products = [
    { name: "Classic Cotton Shirt", price: 799, category: "Clothes", rating: 4.2, stock: 25, image: "S1.png" },
    { name: "Denim Casual Jacket", price: 2499, category: "Clothes", rating: 4.5, stock: 12, image: "S2.png" },
    { name: "Slim Fit Black Jeans", price: 1799, category: "Clothes", rating: 4.3, stock: 18, image: "S3.png" },
    { name: "Summer Printed Dress", price: 1299, category: "Clothes", rating: 4.6, stock: 8, image: "S4.png" },
    { name: "Winter Grey Hoodie", price: 1599, category: "Clothes", rating: 4.1, stock: 30, image: "S5.png" },
    { name: "Striped Polo Shirt", price: 699, category: "Clothes", rating: 3.9, stock: 40, image: "S6.png" },
    { name: "Leather Fashion Belt", price: 499, category: "Fashion", rating: 4.0, stock: 50, image: "S7.png" },
    { name: "Warm Wool Sweater", price: 1999, category: "Clothes", rating: 4.4, stock: 15, image: "S1.png" },
    { name: "Running Sports Shoes", price: 3499, category: "Fashion", rating: 4.7, stock: 10, image: "S2.png" },
    { name: "Casual White Sneakers", price: 2199, category: "Fashion", rating: 4.3, stock: 20, image: "S3.png" },
    { name: "Formal Leather Shoes", price: 4299, category: "Fashion", rating: 4.5, stock: 7, image: "S4.png" },
    { name: "Trendy Oversized T-Shirt", price: 999, category: "Clothes", rating: 4.6, stock: 22, image: "S5.png" },
    { name: "Classic Wrist Watch", price: 8999, category: "Fashion", rating: 4.8, stock: 5, image: "S6.png" },
    { name: "Streetwear Cargo Pants", price: 1999, category: "Clothes", rating: 4.2, stock: 14, image: "S7.png" },
    { name: "Casual Cotton Cap", price: 299, category: "Fashion", rating: 3.8, stock: 60, image: "S1.png" },
    { name: "Printed Bedtime Pajamas", price: 1199, category: "Clothes", rating: 4.1, stock: 35, image: "S2.png" },
    { name: "Stylish Winter Coat", price: 3499, category: "Clothes", rating: 4.3, stock: 45, image: "S3.png" },
    { name: "Designer Kurta Suit", price: 2799, category: "Clothes", rating: 4.5, stock: 28, image: "S4.png" },
    { name: "Casual Denim Shorts", price: 599, category: "Clothes", rating: 4.0, stock: 33, image: "S5.png" },
    { name: "Fashionable Track Suit", price: 1899, category: "Clothes", rating: 3.9, stock: 19, image: "S6.png" },
    { name: "Premium Leather Wallet", price: 699, category: "Fashion", rating: 4.4, stock: 42, image: "S7.png" },
    { name: "Stylish Sunglasses", price: 1499, category: "Fashion", rating: 4.2, stock: 16, image: "S1.png" },
    { name: "Travel Fashion Backpack", price: 1899, category: "Fashion", rating: 4.6, stock: 11, image: "S2.png" },
    { name: "Elegant Silk Scarf", price: 999, category: "Fashion", rating: 4.3, stock: 23, image: "S3.png" },
    { name: "Gym Wear Tracks", price: 1299, category: "Clothes", rating: 4.5, stock: 0, image: "S4.png" },
];

async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected!");

        // Clear existing products first
        await Product.deleteMany({});
        console.log("Old products cleared.");

        // Insert all new products
        await Product.insertMany(products);
        console.log(`${products.length} products inserted successfully!`);

        mongoose.connection.close();
    } catch (err) {
        console.error("Seeding failed:", err);
        mongoose.connection.close();
    }
}

seedDB();