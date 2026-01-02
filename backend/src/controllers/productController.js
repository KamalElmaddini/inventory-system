const Product = require('../models/Product');
const { Op } = require('sequelize');

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await Product.update(req.body, { where: { id } });
        const updated = await Product.findByPk(id);
        res.json(updated);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const productId = parseInt(id, 10);
        if (isNaN(productId)) return res.status(400).json({ message: "Invalid ID" });

        const result = await Product.destroy({ where: { id: productId } });

        if (result === 0) {
            return res.status(404).json({ message: 'Product not found or already deleted' });
        }
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Advanced Dashboard Stats
const getDashboardStats = async (req, res) => {
    try {
        const products = await Product.findAll();

        // 1. Basic Counts
        const lowStockItems = products.filter(p => p.quantity <= p.minStock);
        const outOfStockItems = products.filter(p => p.quantity === 0);
        const totalValue = products.reduce((acc, p) => acc + (p.price * p.quantity), 0);

        // 2. Category Distribution
        const categoryMap = {};
        const categoryValueMap = {};

        products.forEach(p => {
            // Quantity Distribution
            if (!categoryMap[p.category]) categoryMap[p.category] = 0;
            categoryMap[p.category] += p.quantity;

            // Value Distribution
            if (!categoryValueMap[p.category]) categoryValueMap[p.category] = 0;
            categoryValueMap[p.category] += (p.price * p.quantity);
        });

        const categoryDistribution = Object.keys(categoryMap).map(key => ({
            name: key,
            value: categoryMap[key]
        }));

        const categoryValueDistribution = Object.keys(categoryValueMap).map(key => ({
            name: key,
            value: categoryValueMap[key]
        }));

        // 3. Recent Activity (Mocked for now since we don't have Audit table yet)
        // In a real app, we'd query the StockTransaction table.
        const recentActivity = products.slice(0, 5).map(p => ({
            id: p.id,
            action: 'Restocked',
            item: p.name,
            time: '2 hours ago', // Mock
            user: 'Admin'
        }));

        res.json({
            totalProducts: products.length,
            lowStockCount: lowStockItems.length,
            outOfStockCount: outOfStockItems.length,
            totalValue: totalValue,
            lowStockItems: lowStockItems,
            categoryDistribution: categoryDistribution,
            categoryValueDistribution: categoryValueDistribution,
            recentActivity: recentActivity
        });
    } catch (err) {
        console.error("Dashboard Error:", err);
        res.status(500).send(err.message);
    }
};

module.exports = { getAllProducts, createProduct, updateProduct, deleteProduct, getDashboardStats };
