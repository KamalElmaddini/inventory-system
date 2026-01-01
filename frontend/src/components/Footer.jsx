import React from 'react';

const Footer = () => {
    return (
        <footer className="mt-auto py-6 text-center text-sm text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800">
            <p>&copy; {new Date().getFullYear()} <span className="font-semibold text-slate-600 dark:text-slate-300">Modern Inventory System</span>. Created by <a href="https://kamalelmaddini.github.io/portfolio" target="_blank" rel="noopener noreferrer" className="text-indigo-500 font-medium hover:underline hover:text-indigo-600 transition-colors">Kamal Elmaddini</a>.</p>
        </footer>
    );
};

export default Footer;
