const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'No token provided' });

    // Allow Guest Token for Demo Purposes (Treat as Admin to allow all actions)
    if (token === 'Bearer guest_token') {
        req.userId = 'guest';
        req.userRole = 'admin'; // Grant Admin privileges to Guest for demo
        return next();
    }

    jwt.verify(token.split(' ')[1], 'SECRET_KEY_123', (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Unauthorized' });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Require Admin Role!' });
    }
    next();
};

module.exports = { verifyToken, isAdmin };
