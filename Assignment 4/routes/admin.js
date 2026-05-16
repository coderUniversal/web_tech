const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const upload = require("../middleware/upload");

// GET /admin — Dashboard
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        const successMsg = req.query.success || null;
        res.render("admin/dashboard", { products, successMsg });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error loading dashboard.");
    }
});

// GET /admin/add — Show Add Product Form
router.get("/add", (req, res) => {
    res.render("admin/add-product", { error: null });
});

// POST /admin/add — Process Add Product Form
router.post("/add", (req, res, next) => {
    upload.single("image")(req, res, (err) => {
        if (err) {
            return res.render("admin/add-product", {
                error: "Image too large. Please upload an image under 5MB."
            });
        }
        next();
    });
}, async (req, res) => {
    const { name, price, category, rating, stock } = req.body;

    // Validation: check all required fields are not empty
    if (!name || !price || !category || !rating || !stock) {
        return res.render("admin/add-product", {
            error: "All fields are required. Please fill in every field."
        });
    }

    try {
        const newProduct = new Product({
            name,
            price,
            category,
            rating,
            stock,
            image: req.file ? req.file.filename : "placeholder.png"
        });

        await newProduct.save();
        res.redirect("/admin?success=Product added successfully!");
    } catch (err) {
        console.error(err);
        res.render("admin/add-product", {
            error: "Something went wrong while saving. Please try again."
        });
    }
});

// GET /admin/edit/:id — Show Edit Product Form
router.get("/edit/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send("Product not found.");
        res.render("admin/edit-product", { product, error: null });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error loading edit form.");
    }
});

// POST /admin/edit/:id — Process Edit Product Form
router.post("/edit/:id", (req, res, next) => {
    upload.single("image")(req, res, async (err) => {
        if (err) {
            try {
                const product = await Product.findById(req.params.id);
                return res.render("admin/edit-product", {
                    product,
                    error: "Image too large. Please upload an image under 5MB."
                });
            } catch (e) {
                return res.status(500).send("Server error.");
            }
        }
        next();
    });
}, async (req, res) => {
    const { name, price, category, rating, stock } = req.body;

    // Validation: check all required fields are not empty
    if (!name || !price || !category || !rating || !stock) {
        try {
            const product = await Product.findById(req.params.id);
            return res.render("admin/edit-product", {
                product,
                error: "All fields are required. Please fill in every field."
            });
        } catch (err) {
            return res.status(500).send("Server error.");
        }
    }

    try {
        // Build update object
        const updateData = { name, price, category, rating, stock };

        // Only update image if a new file was uploaded
        if (req.file) {
            updateData.image = req.file.filename;
        }

        await Product.findByIdAndUpdate(req.params.id, updateData);
        res.redirect("/admin?success=Product updated successfully!");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error updating product.");
    }
});

// POST /admin/delete/:id — Delete Product
router.post("/delete/:id", async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect("/admin?success=Product deleted successfully!");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error deleting product.");
    }
});

module.exports = router;