const { Sequelize } = require('sequelize');
const path = require('path');

const sqlite3 = require('sqlite3');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.VERCEL ? '/tmp/inventory.sqlite' : path.join(__dirname, '../../inventory.sqlite'),
    logging: false,
    dialectModule: sqlite3
});

module.exports = sequelize;
