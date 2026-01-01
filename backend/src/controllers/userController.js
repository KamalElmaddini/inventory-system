const User = require('../models/User');
const bcrypt = require('bcryptjs');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'role', 'createdAt']
        });
        res.json(users);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const createUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 8);

        const user = await User.create({
            username,
            password: hashedPassword,
            role: role || 'employee'
        });

        res.status(201).json({ message: "User created", user: { id: user.id, username: user.username, role: user.role } });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = parseInt(id, 10);
        console.log(`[UserId: ${req.userId}] Attempting to delete user with ID: ${userId} (Raw: ${id})`);

        if (isNaN(userId)) return res.status(400).json({ message: "Invalid ID" });
        if (userId === 1) return res.status(403).json({ message: "Cannot delete Admin" });

        const result = await User.destroy({ where: { id: userId } });
        console.log(`Delete result: ${result}`);

        if (result === 0) {
            return res.status(404).json({ message: 'User not found or already deleted' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error("Delete User Error:", err);
        res.status(500).send(err.message);
    }
};

module.exports = { getAllUsers, createUser, deleteUser };
