// Vercel Serverless Function Bridge

module.exports = async (req, res) => {
    try {
        console.log("Function started. Loading dependencies...");

        // Lazy load dependencies to catch connection/path/dependency errors
        // that happen at the top-level of these files.
        const path = require('path');
        const fs = require('fs');

        // Debug environment
        console.log("Current directory:", __dirname);
        console.log("ENV VERCEL:", process.env.VERCEL);

        const app = require('../backend/src/app');
        const sequelize = require('../backend/src/config/database');
        const Product = require('../backend/src/models/Product');
        const User = require('../backend/src/models/User');
        const bcrypt = require('bcryptjs');

        console.log("Dependencies loaded. Seeding DB...");

        // Sync DB
        // Force sync check
        await sequelize.authenticate();
        console.log("DB Connection OK");

        await sequelize.sync();

        const adminCount = await User.count({ where: { role: 'admin' } });
        if (adminCount === 0) {
            console.log('Seeding Admin User...');
            await User.create({
                username: 'admin',
                password: await bcrypt.hash('admin123', 8),
                role: 'admin'
            });
        }

        console.log("Seeding complete. Forwarding to express...");

        // Forward to Express app
        return app(req, res);

    } catch (error) {
        console.error("CRITICAL SERVERLESS ERROR:", error);

        // Send JSON error even if it was a startup crash
        res.status(500).json({
            status: "error",
            message: "Critical Startup Error",
            error: error.message,
            stack: error.stack,
            env: process.env.NODE_ENV
        });
    }
};
