require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./models/Order');
const Product = require('./models/Product');

async function seedOrders() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get real product IDs from your database
    const products = await Product.find().limit(5);

    if (products.length === 0) {
        console.log('No products found! Run your existing seed.js first.');
        process.exit(1);
    }

    // Clear existing orders (optional)
    await Order.deleteMany({});
    console.log('Cleared old orders');

    const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    const orders = [];

    for (let i = 0; i < 20; i++) {
        // Pick 1-3 random products for this order
        const itemCount = Math.floor(Math.random() * 3) + 1;
        const items = [];
        let totalAmount = 0;

        for (let j = 0; j < itemCount; j++) {
            const product = products[Math.floor(Math.random() * products.length)];
            const quantity = Math.floor(Math.random() * 4) + 1;
            const subtotal = product.price * quantity;

            items.push({
                product:     product._id,
                productName: product.name,
                quantity,
                price:       product.price,
                subtotal
            });

            totalAmount += subtotal;
        }

        orders.push({
            items,
            totalAmount,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            // Spread orders across last 30 days
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        });
    }

    await Order.insertMany(orders);
    console.log(`✅ Inserted ${orders.length} test orders`);

    await mongoose.disconnect();
    process.exit(0);
}

seedOrders().catch(err => {
    console.error(err);
    process.exit(1);
});