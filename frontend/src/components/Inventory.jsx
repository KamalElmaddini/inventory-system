import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Search, Filter, Download, Pencil, Trash2, X, Save, Box, Check, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Inventory = ({ role, theme }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Filter States
    const [showFilters, setShowFilters] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [formData, setFormData] = useState({ name: '', category: '', quantity: 0, price: 0, minStock: 0 });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('/api/products');
            setProducts(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching products", err);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (role !== 'admin') return;
        if (!window.confirm("Are you sure?")) return;
        try {
            await axios.delete(`/api/products/${id}`);
            fetchProducts();
        } catch (err) { alert("Failed to delete"); }
    };

    const handleEdit = (item) => {
        setCurrentItem(item);
        setFormData(item);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setCurrentItem(null);
        setFormData({ name: '', category: '', quantity: 0, price: 0, minStock: 5 });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name: formData.name,
                category: formData.category,
                quantity: Number(formData.quantity),
                price: Number(formData.price),
                minStock: Number(formData.minStock)
            };

            if (currentItem) {
                await axios.put(`/api/products/${currentItem.id}`, payload);
            } else {
                await axios.post('/api/products', payload);
            }
            setIsModalOpen(false);
            fetchProducts();
        } catch (err) {
            console.error("Operation failed:", err);
            alert("Operation failed");
        }
    };

    const downloadPDF = () => {
        window.open('http://localhost:5000/api/export/pdf', '_blank');
    };

    // Logic for Filters
    const uniqueCategories = ['All', ...new Set(products.map(p => p.category))];

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;

        const isLowStock = p.quantity <= p.minStock;
        const isOutOfStock = p.quantity === 0;

        let matchesStatus = true;
        if (statusFilter === 'Low Stock') matchesStatus = isLowStock && !isOutOfStock;
        if (statusFilter === 'Out of Stock') matchesStatus = isOutOfStock;
        if (statusFilter === 'In Stock') matchesStatus = !isLowStock && !isOutOfStock;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    const clearFilters = () => {
        setCategoryFilter('All');
        setStatusFilter('All');
        setSearchTerm('');
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Inventory</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Manage and track your equipment assets.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={downloadPDF}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 font-medium transition-all shadow-sm hover:shadow-md"
                    >
                        <Download size={18} /> Export
                    </button>
                    <button
                        onClick={handleAddNew}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 transition-all hover:-translate-y-0.5"
                    >
                        <Plus size={18} /> Add Item
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="p-2 border-b border-slate-100 dark:border-slate-700 flex gap-4 items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search products, SKUs, categories..."
                            className="w-full pl-12 pr-4 py-3 border-none rounded-xl focus:ring-0 text-slate-700 dark:text-white placeholder:text-slate-400 bg-transparent outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="h-8 w-px bg-slate-100 dark:bg-slate-700 mx-2"></div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${showFilters
                            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                            : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                            }`}
                    >
                        <Filter size={18} /> Filters {(categoryFilter !== 'All' || statusFilter !== 'All') && <span className="w-2 h-2 rounded-full bg-indigo-500"></span>}
                    </button>
                </div>

                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 overflow-hidden"
                        >
                            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Category</label>
                                    <select
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-700 dark:text-slate-200"
                                    >
                                        {uniqueCategories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Stock Status</label>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-700 dark:text-slate-200"
                                    >
                                        <option value="All">All Statuses</option>
                                        <option value="In Stock">In Stock</option>
                                        <option value="Low Stock">Low Stock</option>
                                        <option value="Out of Stock">Out of Stock</option>
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={clearFilters}
                                        className="px-4 py-2.5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium flex items-center gap-2"
                                    >
                                        <RefreshCw size={16} /> Reset Filters
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-700/30 border-b border-slate-100 dark:border-slate-700">
                                <th className="px-6 py-5 font-semibold text-slate-500 dark:text-slate-400 text-sm">Product Name</th>
                                <th className="px-6 py-5 font-semibold text-slate-500 dark:text-slate-400 text-sm">Category</th>
                                <th className="px-6 py-5 font-semibold text-slate-500 dark:text-slate-400 text-sm text-right">Unit Price</th>
                                <th className="px-6 py-5 font-semibold text-slate-500 dark:text-slate-400 text-sm text-center">Stock Level</th>
                                <th className="px-6 py-5 font-semibold text-slate-500 dark:text-slate-400 text-sm text-center">Status</th>
                                <th className="px-6 py-5 font-semibold text-slate-500 dark:text-slate-400 text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map(product => {
                                    const isLowStock = product.quantity <= product.minStock;
                                    const isOutOfStock = product.quantity === 0;
                                    return (
                                        <tr key={product.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                                        <Box size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-slate-900 dark:text-white">{product.name}</div>
                                                        <div className="text-xs text-slate-400">ID: #{product.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-xs font-semibold uppercase tracking-wide">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-slate-700 dark:text-slate-300">
                                                ${product.price.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-center text-slate-600 dark:text-slate-400 font-medium">
                                                {product.quantity}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${isOutOfStock
                                                    ? 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600'
                                                    : isLowStock
                                                        ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900/50'
                                                        : 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-900/50'
                                                    }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${isOutOfStock ? 'bg-slate-500' : isLowStock ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                                                    {isOutOfStock ? 'OUT OF STOCK' : isLowStock ? 'LOW STOCK' : 'IN STOCK'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleEdit(product)}
                                                        className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={18} />
                                                    </button>

                                                    {role === 'admin' && (
                                                        <button
                                                            onClick={() => handleDelete(product.id)}
                                                            className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                                        <div className="flex flex-col items-center">
                                            <Search size={48} className="mb-4 opacity-20" />
                                            <p>No products found matching your search.</p>
                                            <button onClick={clearFilters} className="mt-4 text-indigo-500 hover:underline">Clear all filters</button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl relative overflow-hidden ring-1 ring-slate-900/5"
                        >
                            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-700/30">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{currentItem ? 'Edit Product' : 'Add New Product'}</h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Product Name</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="e.g. Dell XPS 15"
                                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="Electronics"
                                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white"
                                                value={formData.category}
                                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Price ($)</label>
                                            <input
                                                required
                                                type="number"
                                                min="0"
                                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white"
                                                value={formData.price}
                                                onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Quantity</label>
                                            <input
                                                required
                                                type="number"
                                                min="0"
                                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white"
                                                value={formData.quantity}
                                                onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Min. Stock Alert</label>
                                            <input
                                                required
                                                type="number"
                                                min="0"
                                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white"
                                                value={formData.minStock}
                                                onChange={e => setFormData({ ...formData, minStock: Number(e.target.value) })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium flex justify-center items-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40 transition-all hover:translate-y-px"
                                    >
                                        <Save size={18} /> Save Product
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Inventory;
