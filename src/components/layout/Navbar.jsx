import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  ShoppingCart,
  User,
  ShieldCheck,
  Sun,
  Moon,
  Store,
  Search,
  Sparkles,
  LogIn,
  MapPin,
  ExternalLink,
  Phone,
  Truck,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { getTimeBasedGreeting, STORE_MAPS_URL, STORE_PHONE } from '../../utils/formatters';
import CartDrawer from '../cart/CartDrawer';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { itemCount } = useCart();
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      navigate(`/shop?q=${encodeURIComponent(quickSearch.trim())}`);
      setQuickSearch('');
    }
  };

  // Pure customer navigation links (NO ADMIN LINKS)
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop Catalog', path: '/shop' },
  ];

  return (
    <>
      {/* Sleek Modern Promotional Top Announcement Bar */}
      <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-950 text-slate-200 text-[11px] sm:text-xs py-2 px-3 sm:px-6 border-b border-emerald-900/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Promotional highlights */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex items-center gap-1.5 font-extrabold text-emerald-400 shrink-0">
              <Truck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="hidden xs:inline">Free Delivery:</span>
            </span>
            <span className="truncate text-slate-200 font-medium">
              Free local doorstep delivery across Jaunpur city on all WhatsApp orders!
            </span>
            <span className="hidden lg:inline text-slate-500">•</span>
            <span className="hidden lg:inline text-slate-300">
              📍 Station Road, Harlalka Rd, Shakar Mandi (222001)
            </span>
          </div>

          {/* Store Location Map & Phone */}
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            <a
              href={STORE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-emerald-300 hover:text-white font-extrabold transition-colors bg-emerald-900/50 hover:bg-emerald-800/60 px-2.5 py-0.5 rounded-full border border-emerald-700/50 shadow-sm"
              title="Open physical store in Google Maps"
            >
              <MapPin className="w-3 h-3 text-emerald-300" />
              <span>Store Map</span>
              <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
            </a>

            <span className="hidden md:inline text-slate-700">|</span>

            <a
              href="tel:+919807329612"
              className="hidden md:inline-flex items-center gap-1 text-slate-300 hover:text-emerald-400 font-semibold transition-colors"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>+91 98073 29612</span>
            </a>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 w-full glass-header transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Store className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="font-black text-base sm:text-lg tracking-tight bg-gradient-to-r from-emerald-700 via-emerald-600 to-amber-600 dark:from-emerald-400 dark:to-amber-400 bg-clip-text text-transparent block truncate">
                Aastha General Store
              </span>
              <span className="block text-[10px] text-slate-500 dark:text-slate-400 -mt-0.5 font-semibold tracking-wide truncate">
                Station Road, Harlalka Rd, Shakar Mandi, Jaunpur
              </span>
            </div>
          </Link>

          {/* Dynamic Indian Greeting on Desktop */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 px-3 py-1.5 rounded-full bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/40">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{getTimeBasedGreeting(user ? user.name.split(' ')[0] : 'Jaunpur')}</span>
          </div>

          {/* Quick Search in Navbar (Tablet / Desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center relative max-w-xs flex-1 mx-2"
          >
            <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              placeholder="Search groceries, snacks, chocolates..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </form>

          {/* Customer Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Dark Mode"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            {/* Cart Drawer Trigger Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              aria-label="Open Cart"
              className="relative p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors touch-manipulation"
            >
              <ShoppingCart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center animate-fade-in shadow-sm">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            {/* Customer Profile / Auth Shortcut */}
            {user ? (
              <Link
                to="/settings"
                aria-label="User Account"
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-emerald-500/50"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <span className="hidden sm:inline text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[80px] truncate">
                  {user.name.split(' ')[0]}
                </span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartDrawerOpen} onClose={() => setIsCartDrawerOpen(false)} />
    </>
  );
}
