import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, Package, Shield, ChevronLeft, ChevronRight, LogOut, Settings, Moon, Sun, User as UserIcon, Users } from 'lucide-react';
import axios from 'axios';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Employees from './components/Employees';
import Login from './components/Login';
import Footer from './components/Footer';

// Configure Axios
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const Sidebar = ({ role, logout }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path) => location.pathname === path
    ? 'bg-indigo-500/10 text-indigo-400 border-r-2 border-indigo-400'
    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5';

  return (
    <div className={`${collapsed ? 'w-20' : 'w-72'} bg-[#0f172a] text-white min-h-screen flex flex-col transition-all duration-300 border-r border-slate-800 relative shadow-2xl z-20`}>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 bg-indigo-500 rounded-full p-1 text-white shadow-lg border-2 border-[#0f172a] hover:bg-indigo-600 transition-colors z-30"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className={`h-24 flex items-center ${collapsed ? 'justify-center' : 'px-8'} border-b border-slate-800/50`}>
        <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">I</div>
        {!collapsed && (
          <span className="ml-4 text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Invento<span className="font-extralight">Pro</span>
          </span>
        )}
      </div>

      <nav className="flex-1 py-8 space-y-2 px-3">
        <Link to="/" className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group ${isActive('/')}`}>
          <LayoutDashboard size={22} className={location.pathname === '/' ? 'text-indigo-400' : 'group-hover:text-white'} />
          {!collapsed && <span className="font-medium tracking-wide">Dashboard</span>}
        </Link>
        <Link to="/inventory" className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group ${isActive('/inventory')}`}>
          <Package size={22} className={location.pathname === '/inventory' ? 'text-indigo-400' : 'group-hover:text-white'} />
          {!collapsed && <span className="font-medium tracking-wide">Inventory</span>}
        </Link>
        {role === 'admin' && (
          <Link to="/employees" className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group ${isActive('/employees')}`}>
            <Users size={22} className={location.pathname === '/employees' ? 'text-indigo-400' : 'group-hover:text-white'} />
            {!collapsed && <span className="font-medium tracking-wide">Staff</span>}
          </Link>
        )}
      </nav>

      <div className="p-4 border-t border-slate-800/50 bg-[#0b1120]">
        {!collapsed && (
          <div className="flex items-center gap-3 px-1">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px]">
              <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center">
                <UserIcon size={20} className="text-gray-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white capitalize">{localStorage.getItem('role')}</span>
              <span className="text-xs text-indigo-400">Online</span>
            </div>
            <button onClick={logout} className="ml-auto text-slate-500 hover:text-white">
              <LogOut size={16} />
            </button>
          </div>
        )}
        {collapsed && (
          <button onClick={logout} className="flex justify-center w-full text-slate-500 hover:text-white">
            <LogOut size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

function App() {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    role: localStorage.getItem('role'),
    username: ''
  });

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setAuth({ token: null, role: null, username: '' });
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!auth.token ? <Login setAuth={setAuth} theme={theme} toggleTheme={toggleTheme} /> : <Navigate to="/" />} />

        <Route path="/*" element={auth.token ? (
          <div className="flex flex-row bg-slate-50 dark:bg-slate-900 min-h-screen font-sans selection:bg-indigo-500/30 transition-colors duration-300">
            <Sidebar role={auth.role} logout={logout} />
            <main className="flex-1 flex flex-col h-screen relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-indigo-50 to-transparent dark:from-indigo-900/20 dark:to-transparent -z-10"></div>

              <button
                onClick={toggleTheme}
                className="fixed top-6 right-8 p-3 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-amber-400 hover:text-indigo-600 transition-all z-50 hover:scale-110 active:scale-95"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={24} fill="currentColor" /> : <Moon size={24} fill="currentColor" />}
              </button>

              <div className="flex-1 overflow-y-auto p-8 lg:p-12 flex flex-col">
                <div className="flex-1">
                  <Routes>
                    <Route path="/" element={<Dashboard theme={theme} />} />
                    <Route path="/inventory" element={<Inventory role={auth.role} theme={theme} />} />
                    <Route path="/employees" element={auth.role === 'admin' ? <Employees theme={theme} /> : <Navigate to="/" />} />
                  </Routes>
                </div>
                <Footer />
              </div>
            </main>
          </div>
        ) : (
          <Navigate to="/login" />
        )} />
      </Routes>
    </Router>
  );
}

export default App;
