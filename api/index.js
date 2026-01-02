// Vercel Serverless Function Bridge
const app = require('../backend/src/app');
const sequelize = require('../backend/src/config/database');
const Product = require('../backend/src/models/Product');
const User = require('../backend/src/models/User');
const bcrypt = require('bcryptjs');

// Helper to seed initial data if DB is empty (since /tmp is ephemeral)
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
    }
};

// Initialize DB on cold start
seedDatabase();

module.exports = app;
