const express = require("express");
const router  = express.Router();
const Order   = require("../models/Order");
const { isAdmin } = require("../middleware/auth");

// ── Shared helper: fetch stats from DB ─────────────────
async function getSalesStats() {
    const totalOrders = await Order.countDocuments();

    const revenueResult = await Order.aggregate([
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    const topProductResult = await Order.aggregate([
        { $unwind: "$items" },
        {
            $group: {
                _id: "$items.product",
                productName: { $first: "$items.productName" },
                totalSold:   { $sum: "$items.quantity" }
            }
        },
        { $sort: { totalSold: -1 } },
        { $limit: 1 }
    ]);
    const topProduct = topProductResult.length > 0
        ? { name: topProductResult[0].productName, unitsSold: topProductResult[0].totalSold }
        : { name: "No sales yet", unitsSold: 0 };

    const recentOrders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("user", "name email");

    const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;

    return { totalRevenue, totalOrders, topProduct, recentOrders, avgOrderValue };
}

// ── GET /sales  →  render the dashboard page (SSR) ─────
router.get("/", isAdmin, async (req, res) => {
    try {
        const stats = await getSalesStats();
        res.render("admin/sales", { title: "Sales Dashboard", ...stats });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error loading sales dashboard.");
    }
});

// ── GET /sales/data  →  JSON for AJAX polling ──────────
router.get("/data", isAdmin, async (req, res) => {
    try {
        const stats = await getSalesStats();
        res.json({
            totalRevenue:  stats.totalRevenue,
            totalOrders:   stats.totalOrders,
            topProduct:    stats.topProduct,
            avgOrderValue: stats.avgOrderValue,
            recentOrders:  stats.recentOrders.map(o => ({
                id:        o._id,
                total:     o.totalAmount,
                status:    o.status,
                itemCount: o.items.length,
                date:      o.createdAt,
                user:      o.user ? (o.user.name || o.user.email) : "Guest"
            }))
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error." });
    }
});

module.exports = router;