const express = require('express');
const { register, login } = require('../controllers/authController');
const { getAllProducts, createProduct, updateProduct, deleteProduct, getDashboardStats } = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const PDFDocument = require('pdfkit');
const Product = require('../models/Product');

const router = express.Router();

// Auth Routes
router.post('/auth/register', register);
router.post('/auth/login', login);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Product Routes
router.get('/products', getAllProducts);
router.post('/products', verifyToken, createProduct); // Any logged in user can add?
router.put('/products/:id', verifyToken, updateProduct);
router.put('/products/:id', verifyToken, updateProduct);
router.delete('/products/:id', [verifyToken, isAdmin], deleteProduct);

// User Management Routes (Admin Only)
const { getAllUsers, createUser, deleteUser } = require('../controllers/userController');
router.get('/users', [verifyToken, isAdmin], getAllUsers);
router.post('/users', [verifyToken, isAdmin], createUser);
router.delete('/users/:id', [verifyToken, isAdmin], deleteUser);

// PDF Export (Keep simple for now)
router.get('/export/pdf', async (req, res) => {
    const products = await Product.findAll();
    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=inventory_report.pdf');

    doc.pipe(res);
    doc.fontSize(20).text('Inventory Report', { align: 'center' });
    doc.moveDown();

    products.forEach((p, i) => {
        doc.fontSize(12).text(`${i + 1}. ${p.name} - Qty: ${p.quantity} - Price: $${p.price}`);
    });
    doc.end();
});

module.exports = router;
