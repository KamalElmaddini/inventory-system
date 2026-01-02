const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.VERCEL ? '/tmp/inventory.sqlite' : path.join(__dirname, '../../inventory.sqlite'),
    logging: false
});

module.exports = sequelize;
