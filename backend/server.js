const app = require('./src/app');
const sequelize = require('./src/config/database');
const Product = require('./src/models/Product');
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');

const PORT = process.env.PORT || 5000;

// Sync Database then Start Server
sequelize.sync({ alter: true }).then(async () => {
    console.log('Database synced successfully.');

    // 1. Seed Initial Products if empty
    const productCount = await Product.count();
    if (productCount === 0) {
        await Product.bulkCreate([
            { name: 'MacBook Pro M2', category: 'Electronics', quantity: 8, price: 1999, minStock: 5 },
            { name: 'Logitech MX Master 3', category: 'Accessories', quantity: 25, price: 99, minStock: 10 },
            { name: 'Herman Miller Aeron', category: 'Furniture', quantity: 3, price: 1200, minStock: 5 },
            { name: 'Dell UltraSharp 27"', category: 'Electronics', quantity: 12, price: 450, minStock: 5 },
            { name: 'Standing Desk', category: 'Furniture', quantity: 0, price: 600, minStock: 2 }, // Out of stock
        ]);
        console.log("✅ Seeded initial products");
    }

    // 2. Seed Admin User if not exists
    const adminExists = await User.findOne({ where: { username: 'admin' } });
    if (!adminExists) {
        const hashedPassword = await bcrypt.hash('admin123', 8);
        await User.create({
            username: 'admin',
            password: hashedPassword,
            role: 'admin'
        });
        console.log("✅ Seeded Admin Account: admin / admin123");
    }

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('❌ Failed to sync database:', err);
});
