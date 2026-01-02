const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        const user = await User.create({
            username,
            password: hashedPassword,
            role: role || 'employee'
        });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error("REGISTRATION ERROR:", error);
        res.status(500).json({
            message: 'Error registering user',
            error: error.message,
            details: error.toString()
        });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).json({ message: 'Invalid Password' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, 'SECRET_KEY_123', { expiresIn: 86400 }); // 24 hours

        res.status(200).json({
            id: user.id,
            username: user.username,
            role: user.role,
            accessToken: token
        });
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

module.exports = { register, login };
