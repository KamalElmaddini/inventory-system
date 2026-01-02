const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api', apiRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("EXPRESS GLOBAL ERROR:", err);
    res.status(500).json({
        message: "Express Global Error",
        error: err.message,
        stack: err.stack
    });
});

module.exports = app;
