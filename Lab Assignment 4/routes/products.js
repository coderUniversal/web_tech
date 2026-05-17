const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

router.get("/", async (req, res) => {
    try {
        // values get from Url query parameters
        const page = parseInt(req.query.page) || 1;
        const search = req.query.search || "";
        const category = req.query.category || "";
        const minPrice = req.query.minPrice || "";
        const maxPrice = req.query.maxPrice || "";

        const productsPerPage = 8;

        //  build the filter object
        let filter = {};

        // search by name
        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }

        // filter by category
        if (category) {
            filter.category = category;
        }

        // flter by price range
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseInt(minPrice);
            if (maxPrice) filter.price.$lte = parseInt(maxPrice);
        }

        //count total matching product
        const totalProducts = await Product.countDocuments(filter);

        //calculate total page
        const totalPages = Math.ceil(totalProducts / productsPerPage);

        //fetch only products for current page
        const products = await Product.find(filter)
            .skip((page - 1) * productsPerPage)
            .limit(productsPerPage);

        // get all unique categories for dropdown
        const categories = await Product.distinct("category");

        //send everything to EJS view
        res.render("products", {
            products,
            currentPage: page,
            totalPages,
            search,
            category,
            minPrice,
            maxPrice,
            categories,
            totalProducts
        });

    } catch (err) {
        console.log("Error fetching products:", err);
        res.status(500).send("Something went wrong!");
    }
});

module.exports = router;