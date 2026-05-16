require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        await Product.updateMany({}, { $set: { image: 'placeholder.png' } });
        console.log('Done! All products updated.');
        mongoose.disconnect();
    })
    .catch(err => console.log(err));