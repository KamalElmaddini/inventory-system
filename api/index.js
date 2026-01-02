// Vercel Serverless Function Bridge
const app = require('../backend/src/app');
const sequelize = require('../backend/src/config/database');
const Product = require('../backend/src/models/Product');
const User = require('../backend/src/models/User');
const bcrypt = require('bcryptjs');

// Helper to seed initial data if DB is empty
const seedDatabase = async () => {
    try {
        await sequelize.sync(); // Create tables
        const adminCount = await User.count({ where: { role: 'admin' } });
        if (adminCount === 0) {
            console.log('Seeding Admin User...');
            await User.create({
                username: 'admin',
                password: await bcrypt.hash('admin123', 8),
                role: 'admin'
            });
        }
    } catch (error) {
        console.error("Database seed error:", error);
        throw error; // Re-throw to catch in the handler
    }
};

module.exports = async (req, res) => {
    try {
        // Ensure DB is ready before handling request
        await seedDatabase();

        // Forward to Express app
        return app(req, res);
    } catch (error) {
        console.error("Serverless Function Error:", error);
        res.status(500).json({
            message: "Critical Server Error",
            error: error.message,
            stack: error.stack
        });
    }
};
