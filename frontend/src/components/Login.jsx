import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, ArrowRight, Sun, Moon } from 'lucide-react';
import Footer from './Footer';

const Login = ({ setAuth, theme, toggleTheme }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [formData, setFormData] = useState({ username: '', password: '', role: 'employee' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';

        try {
            const res = await axios.post(`http://localhost:5000${endpoint}`, formData);

            if (isRegistering) {
                setIsRegistering(false);
                setFormData({ ...formData, password: '' });
                alert("Registration successful! Please login.");
            } else {
                const { accessToken, role, username } = res.data;
                localStorage.setItem('token', accessToken);
                localStorage.setItem('role', role);
                setAuth({ token: accessToken, role, username });
                navigate('/');
            }
        } catch (err) {
            console.error("Sign Up/In Error:", err);
            const msg = err.response?.data?.message || err.message || 'An error occurred';
            const details = err.response?.data?.error || '';
            setError(`${msg} ${details}`);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 transition-colors duration-300 relative">
            <button
                onClick={toggleTheme}
                className="absolute top-6 right-8 p-3 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-amber-400 hover:text-indigo-600 transition-all z-50 hover:scale-110 active:scale-95"
                title="Toggle Theme"
            >
                {theme === 'dark' ? <Sun size={24} fill="currentColor" /> : <Moon size={24} fill="currentColor" />}
            </button>

            <div className="flex-1 flex items-center justify-center p-4 z-10">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100 dark:border-slate-700 relative">
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-indigo-600 rounded-xl mx-auto flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40">
                            <Lock size={24} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{isRegistering ? 'Create Account' : 'Welcome Back'}</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Inventory Management System</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-6 border border-red-100 dark:border-red-900/30 flex items-center gap-2">
                            <span className="font-bold">Error:</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Username</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white"
                                    value={formData.username}
                                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        {isRegistering && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Role</label>
                                <select
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white"
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="employee">Employee</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40 transition-all flex justify-center items-center gap-2"
                        >
                            {isRegistering ? 'Sign Up' : 'Sign In'} <ArrowRight size={18} />
                        </button>

                        {!isRegistering && (
                            <button
                                type="button"
                                onClick={() => {
                                    localStorage.setItem('token', 'guest_token');
                                    localStorage.setItem('role', 'guest');
                                    setAuth({ token: 'guest_token', role: 'guest', username: 'Guest' });
                                    navigate('/');
                                }}
                                className="w-full mt-4 bg-white dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 text-slate-600 dark:text-slate-300 py-3 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-slate-600 transition-all flex justify-center items-center gap-2"
                            >
                                Try as Guest
                            </button>
                        )}
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => setIsRegistering(!isRegistering)}
                            className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium hover:underline"
                        >
                            {isRegistering ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Login;
