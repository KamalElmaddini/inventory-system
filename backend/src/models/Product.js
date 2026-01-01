const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    price: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0
    },
    minStock: {
        type: DataTypes.INTEGER,
        defaultValue: 5
    }
});

module.exports = Product;
