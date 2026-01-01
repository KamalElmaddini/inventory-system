const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();

app.use(cors());
app.use(express.json());

console.log("Mounting API Routes...");
app.use('/api', apiRoutes);
console.log("API Routes Mounted.");

module.exports = app;
