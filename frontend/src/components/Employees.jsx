import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, UserPlus, Users, User, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const Employees = ({ theme }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newUser, setNewUser] = useState({ username: '', password: '', role: 'employee' });
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/users');
            setUsers(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching users", err);
            // alert("Failed to fetch users. Are you Admin?");
            setLoading(false);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/users', newUser);
            setNewUser({ username: '', password: '', role: 'employee' });
            setShowAddForm(false);
            fetchUsers();
            alert("Employee added successfully!");
        } catch (err) {
            alert("Failed to add user");
        }
    };

    const handleDelete = async (id, isAdmin) => {
        console.log("Delete Requested for ID:", id);

        if (isAdmin && !window.confirm("Deleting an Admin! Are you sure?")) return;
        if (!isAdmin && !window.confirm("Are you sure you want to remove this employee?")) return;

        try {
            const response = await axios.delete(`http://localhost:5000/api/users/${id}`);

            if (response.status === 200) {
                alert("Success: User deleted.");
                fetchUsers();
            }
        } catch (err) {
            console.error("Delete Error:", err);
            const errMsg = err.response?.data?.message || err.message || "Unknown error";
            alert(`Error Deleting: ${errMsg}`);
        }
    };

    if (loading) return <div className="p-8">Loading employees...</div>;

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Staff Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Manage access and roles for your team.</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40 transition-all hover:-translate-y-0.5"
                >
                    <UserPlus size={18} /> {showAddForm ? 'Cancel' : 'Add Employee'}
                </button>
            </div>

            {showAddForm && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700"
                >
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">New Employee Details</h3>
                    <form onSubmit={handleAddUser} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Username</label>
                            <input
                                required
                                type="text"
                                placeholder="jdoe"
                                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white"
                                value={newUser.username}
                                onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                            />
                        </div>
                        <div className="flex-1 w-full">
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Password</label>
                            <input
                                required
                                type="text"
                                placeholder="Secret123"
                                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white"
                                value={newUser.password}
                                onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                            />
                        </div>
                        <div className="w-full md:w-32">
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Role</label>
                            <select
                                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white"
                                value={newUser.role}
                                onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                            >
                                <option value="employee">Employee</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full md:w-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
                            Save User
                        </button>
                    </form>
                </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map(user => (
                    <motion.div
                        key={user.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 relative group"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${user.role === 'admin'
                                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                                    : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                                    }`}>
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">{user.username}</h3>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        {user.role === 'admin' ? <Shield size={14} className="text-purple-500" /> : <User size={14} className="text-indigo-500" />}
                                        <span className={`text-xs font-semibold uppercase tracking-wide ${user.role === 'admin' ? 'text-purple-500' : 'text-indigo-500'
                                            }`}>{user.role}</span>
                                    </div>
                                </div>
                            </div>
                            {user.username !== 'admin' && ( // Prevent deleting main admin
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(user.id, user.role === 'admin'); }}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                    title="Delete User"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-700/50 flex justify-between text-xs text-slate-400">
                            <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                            <span>Active</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Employees;
