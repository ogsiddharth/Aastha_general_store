import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  Package,
  ShoppingCart,
  AlertTriangle,
  RotateCcw,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Sparkles,
  Clock,
  MapPin,
  Phone,
  Lock,
  Eye,
  EyeOff,
  User,
  LogIn,
  Layers,
  Cloud,
  CloudUpload,
  MessageCircle,
  Loader2,
  Check,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useProducts } from './context/ProductContext';
import { useToast } from './context/ToastContext';
import { orderService } from './services/orderService';
import { authService, ADMIN_CONFIG } from './services/authService';
import { isFirebaseConfigured, ADMIN_CREDENTIALS } from './firebase';
import { formatDateTime } from './utils/formatters';
import ProductForm from './components/admin/ProductForm';

const ADMIN_STORAGE_KEY = 'aastha_admin_terminal_session';

export default function AdminApp() {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleStock,
    toggleBestseller,
    seedCatalogToFirestore,
    resetToDefault,
  } = useProducts();
  const { showToast } = useToast();

  // Admin Auth Session
  const [adminSession, setAdminSession] = useState(() => {
    try {
      const stored = sessionStorage.getItem(ADMIN_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active tab: 'inventory' | 'orders'
  const [activeTab, setActiveTab] = useState('inventory');

  // Orders State & Filters
  const [orders, setOrders] = useState(() => orderService.getOrders());
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Inventory Table Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Product Form Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Admin Settings (change username / password)
  const [credForm, setCredForm] = useState({
    currentPassword: '',
    newUsername: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [credError, setCredError] = useState('');
  const [isSavingCreds, setIsSavingCreds] = useState(false);

  // Cloud Seeding State
  const [isSeeding, setIsSeeding] = useState(false);

  // Subscribe to real-time Orders updates from Firestore
  useEffect(() => {
    if (adminSession) {
      const unsubscribe = orderService.subscribeToOrders((updatedOrders) => {
        setOrders(updatedOrders);
      });
      return () => {
        if (typeof unsubscribe === 'function') unsubscribe();
      };
    }
  }, [adminSession]);

  // Compute Quick Stats
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const outOfStockCount = products.filter((p) => !p.inStock).length;
    const bestsellersCount = products.filter((p) => p.isBestseller).length;
    const totalOrdersCount = orders.length;
    const activeCategoriesCount = new Set(products.map((p) => p.category)).size;

    return {
      totalProducts,
      outOfStockCount,
      bestsellersCount,
      totalOrdersCount,
      activeCategoriesCount,
    };
  }, [products, orders]);

  // Filtered Products for Inventory Table
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = product.name?.toLowerCase().includes(q);
        const matchesCat = product.category?.toLowerCase().includes(q);
        const matchesUnit = product.unit?.toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesUnit) return false;
      }
      return true;
    });
  }, [products, selectedCategory, searchQuery]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (orderStatusFilter !== 'All' && order.status !== orderStatusFilter) {
        return false;
      }
      if (orderSearchQuery.trim()) {
        const q = orderSearchQuery.toLowerCase().trim();
        const matchesName = order.customerName?.toLowerCase().includes(q);
        const matchesPhone = order.phone?.includes(q);
        const matchesId = (order.orderId || order.id)?.toLowerCase().includes(q);
        if (!matchesName && !matchesPhone && !matchesId) return false;
      }
      return true;
    });
  }, [orders, orderStatusFilter, orderSearchQuery]);

  // Handle Admin Login
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (!username.trim() || !password) {
      setLoginError('Please enter admin username and password.');
      return;
    }

    setIsLoggingIn(true);
    try {
      const session = await authService.adminLogin(username.trim(), password);
      sessionStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(session));
      setAdminSession(session);
      showToast('Admin session authenticated!', 'success');
      setPassword('');
    } catch (err) {
      setLoginError(err.message || 'Invalid admin credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    setAdminSession(null);
    showToast('Admin session terminated.', 'info');
  };

  const handleSaveCredentials = async (e) => {
    e.preventDefault();
    setCredError('');
    if (credForm.newPassword && credForm.newPassword !== credForm.confirmPassword) {
      setCredError('New passwords do not match.');
      return;
    }
    setIsSavingCreds(true);
    try {
      const res = await authService.changeAdminCredentials({
        currentPassword: credForm.currentPassword,
        newUsername: credForm.newUsername,
        newPassword: credForm.newPassword,
      });
      const updatedSession = { ...adminSession, username: res.username };
      sessionStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(updatedSession));
      setAdminSession(updatedSession);
      setCredForm({ currentPassword: '', newUsername: '', newPassword: '', confirmPassword: '' });
      showToast('Admin credentials updated! Use the new ones next login.', 'success', 5000);
    } catch (err) {
      setCredError(err.message || 'Failed to update credentials.');
    } finally {
      setIsSavingCreds(false);
    }
  };

  // Handlers for Products
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (productData) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        showToast(`Updated "${productData.name}"`, 'success');
      } else {
        await addProduct(productData);
        showToast(`Added "${productData.name}" to inventory`, 'success');
      }
    } catch (err) {
      console.error('[AdminApp] Product save error:', err);
      showToast('Failed to save product.', 'error');
    }
  };

  const handleDeleteWithConfirm = async (product) => {
    if (window.confirm(`Are you sure you want to permanently delete "${product.name}"?`)) {
      try {
        await deleteProduct(product.id);
        showToast(`Deleted "${product.name}"`, 'info');
      } catch (err) {
        showToast('Failed to delete product.', 'error');
      }
    }
  };

  const handleResetInventory = () => {
    if (
      window.confirm(
        'Warning: This will reset the catalog back to default 55 items, undoing custom edits. Proceed?'
      )
    ) {
      resetToDefault();
      showToast('Inventory reset to 55 factory default items!', 'success');
    }
  };

  // 1-Click Cloud Firestore Seed
  const handleSeedFirestore = async () => {
    if (!window.confirm('Populate Cloud Firestore with all 55+ initial products?')) {
      return;
    }

    setIsSeeding(true);
    try {
      const result = await seedCatalogToFirestore();
      if (result.localOnly) {
        showToast(`Seeded ${result.count} items locally (Configure .env for cloud)`, 'info');
      } else {
        showToast(`Successfully seeded ${result.count} products to Cloud Firestore!`, 'success', 5000);
      }
    } catch (err) {
      console.error('[AdminApp] Seeding error:', err);
      showToast('Failed to seed catalog: ' + err.message, 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  // Handlers for Orders
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      showToast(`Order status updated to "${newStatus}"`, 'success');
    } catch (err) {
      showToast('Failed to update status.', 'error');
    }
  };

  const handleClearOrders = () => {
    if (window.confirm('Clear all stored customer orders? This cannot be undone.')) {
      orderService.clearOrders();
      setOrders([]);
      showToast('Orders history cleared.', 'info');
    }
  };

  // LOGIN SCREEN FOR UN-AUTHENTICATED ACCESS
  if (!adminSession) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40">
        <div className="w-full max-w-md space-y-6 animate-fade-in">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/5">
              <ShieldCheck className="w-9 h-9" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Aastha Store Admin Terminal
            </h1>
            <p className="text-xs text-slate-400">
              Restricted management area • Jaunpur (+91 98073 29612)
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-5">
            {/* Connection Status Pill */}
            <div className="flex items-center justify-center">
              {isFirebaseConfigured ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Cloud Firestore Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-950/80 text-amber-400 border border-amber-800/40">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Local Fallback Mode
                </span>
              )}
            </div>

            {loginError && (
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm flex items-start gap-2 animate-slide-up">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Secret Admin ID
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Admin ID"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Password Key
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 active:scale-[0.98] text-white font-bold text-sm shadow-lg shadow-amber-600/30 transition-all disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Unlock Admin Terminal</span>
                  </>
                )}
              </button>
            </form>

          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN DASHBOARD VIEW
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* Admin Dedicated Navbar */}
      <header className="sticky top-0 z-40 w-full bg-slate-900/90 border-b border-slate-800 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-sm sm:text-base tracking-tight text-white flex items-center gap-2">
                Aastha General Store
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold uppercase tracking-wider">
                  Admin Terminal
                </span>
              </span>
              <span className="block text-[10px] text-slate-400 -mt-0.5">
                Jaunpur, UP • +91 98073 29612
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Firestore Connection Status */}
            {isFirebaseConfigured ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Firestore Live Sync
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-800 text-amber-400 border border-slate-700">
                <Cloud className="w-3 h-3 text-amber-400" />
                Local Demo Mode
              </span>
            )}

            <button
              onClick={handleAdminLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-red-950/60 text-slate-300 hover:text-red-400 text-xs font-bold transition-colors border border-slate-700 hover:border-red-800"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Inventory & Order Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Live updates propagate instantly to customer storefront across Jaunpur
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleSeedFirestore}
              disabled={isSeeding}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-950/70 text-blue-300 hover:bg-blue-900 text-xs font-bold border border-blue-700/50 transition-all disabled:opacity-50"
              title="Batch-sync 55+ catalog products directly to Cloud Firestore"
            >
              {isSeeding ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Syncing Cloud...</span>
                </>
              ) : (
                <>
                  <CloudUpload className="w-3.5 h-3.5 text-blue-400" />
                  <span>Seed Firestore Catalog</span>
                </>
              )}
            </button>

            <button
              onClick={handleResetInventory}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-red-950/60 text-slate-400 hover:text-red-400 text-xs font-bold transition-all border border-slate-800"
              title="Reset catalog back to initial 55 items"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Local</span>
            </button>

            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Total Products</span>
              <Package className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-white">{stats.totalProducts}</p>
            <span className="text-[10px] text-emerald-400 font-semibold">Active in Catalog</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Out of Stock</span>
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <p className="text-2xl font-black text-red-400">{stats.outOfStockCount}</p>
            <span className="text-[10px] text-slate-400">Items to restock</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Bestsellers</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-amber-400">{stats.bestsellersCount}</p>
            <span className="text-[10px] text-slate-400">Featured items</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Incoming Orders</span>
              <ShoppingCart className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-black text-blue-400">{stats.totalOrdersCount}</p>
            <span className="text-[10px] text-slate-400">WhatsApp receipts</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-1 overflow-x-auto whitespace-nowrap">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'inventory'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Product Inventory ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Customer Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'settings'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>

        {/* TAB 1: PRODUCT INVENTORY TABLE */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            {/* Filters & Search */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products by name, unit, or category..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">Category:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 text-xs sm:text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  {categories
                    .filter((c) => c !== 'All Items')
                    .map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/60 shadow-xl">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead className="bg-slate-900 text-slate-300 font-bold border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Product</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Stock Status</th>
                    <th className="py-3.5 px-4">Bestseller</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredProducts.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&auto=format&fit=crop&q=80';
                            }}
                            className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-700 bg-slate-800"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-white truncate max-w-xs">
                              {p.name}
                            </p>
                            <span className="text-[11px] text-slate-400">
                              Unit: {p.unit}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-[11px] font-semibold text-slate-300 border border-slate-700">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleStock(p.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                            p.inStock
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 hover:bg-emerald-900'
                              : 'bg-red-950 text-red-400 border border-red-800 hover:bg-red-900'
                          }`}
                          title="Click to toggle in-stock status (instantly updates Cloud Firestore)"
                        >
                          {p.inStock ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          <span>{p.inStock ? 'In Stock' : 'Out of Stock'}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleBestseller(p.id)}
                          className={`p-1.5 rounded-xl transition-all ${
                            p.isBestseller
                              ? 'bg-amber-950/80 text-amber-400 border border-amber-800 hover:bg-amber-900'
                              : 'text-slate-600 hover:text-amber-400'
                          }`}
                          title="Toggle Bestseller Badge"
                        >
                          <Sparkles className={`w-4 h-4 ${p.isBestseller ? 'fill-amber-400' : ''}`} />
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteWithConfirm(p)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="md:hidden space-y-3">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0 bg-slate-800"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-sm text-white truncate">
                        {p.name}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {p.category} • {p.unit}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleStock(p.id)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          p.inStock
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-red-950 text-red-400 border border-red-800'
                        }`}
                      >
                        {p.inStock ? 'In Stock' : 'Out of Stock'}
                      </button>

                      <button
                        onClick={() => toggleBestseller(p.id)}
                        className={`p-1 rounded-lg ${
                          p.isBestseller ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                        }`}
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="p-1.5 rounded-lg text-emerald-400 bg-slate-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteWithConfirm(p)}
                        className="p-1.5 rounded-lg text-red-400 bg-slate-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: INCOMING ORDERS VIEW */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
              <div>
                <h2 className="text-base font-bold text-white">
                  Incoming WhatsApp Customer Orders
                </h2>
                <p className="text-xs text-slate-400">
                  Real-time synchronization via Cloud Firestore
                </p>
              </div>

              {orders.length > 0 && (
                <button
                  onClick={handleClearOrders}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-400 bg-red-950/40 hover:bg-red-900 border border-red-800 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Orders</span>
                </button>
              )}
            </div>

            {/* Orders Filter Controls */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  placeholder="Search orders by customer name, phone, or order ID..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">Status:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 text-xs sm:text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Received">Received</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {filteredOrders.length > 0 ? (
              <div className="space-y-4">
                {filteredOrders.map((ord) => (
                  <div
                    key={ord.id || ord.orderId}
                    className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm sm:text-base text-white">
                            {ord.customerName}
                          </span>
                          <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-950 border border-emerald-800">
                            #{ord.orderId || ord.id}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{formatDateTime(ord.createdAt)}</span>
                        </div>
                      </div>

                      {/* Status Changer & WhatsApp Direct Link */}
                      <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-slate-400">Status:</span>
                          <select
                            value={ord.status || 'Received'}
                            onChange={(e) => handleOrderStatusChange(ord.id, e.target.value)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 focus:outline-none cursor-pointer ${
                              ord.status === 'Delivered'
                                ? 'text-emerald-400 border-emerald-800'
                                : ord.status === 'Dispatched'
                                ? 'text-blue-400 border-blue-800'
                                : ord.status === 'Preparing'
                                ? 'text-yellow-400 border-yellow-800'
                                : ord.status === 'Cancelled'
                                ? 'text-red-400 border-red-800'
                                : 'text-purple-400 border-purple-800'
                            }`}
                          >
                            <option value="Received">Received</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>

                        {/* Direct WhatsApp Customer Contact Button */}
                        {ord.phone && (
                          <a
                            href={`https://wa.me/91${ord.phone.replace(/\D/g, '')}?text=Namaste%20${encodeURIComponent(
                              ord.customerName
                            )}!%20Update%20regarding%20your%20Order%20%23${encodeURIComponent(
                              ord.orderId || ord.id
                            )}%20from%20Aastha%20General%20Store%2C%20Jaunpur%3A%20Current%20status%20is%20${encodeURIComponent(
                              ord.status || 'Received'
                            )}.%20Delivery%20address%3A%20${encodeURIComponent(ord.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp Customer</span>
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                        <a href={`tel:+91${ord.phone}`} className="hover:underline font-bold text-white">
                          +91 {ord.phone}
                        </a>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{ord.address}</span>
                      </div>

                      {ord.note && (
                        <div className="sm:col-span-2 p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/40 text-amber-300 text-xs">
                          <strong>Customer Note:</strong> {ord.note}
                        </div>
                      )}
                    </div>

                    {/* Itemized Order Breakdown */}
                    <div className="pt-2 border-t border-slate-800 space-y-1.5">
                      <p className="text-xs font-bold text-slate-300">
                        Ordered Items ({ord.items?.length || 0}):
                      </p>
                      <div className="space-y-1 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/60">
                        {ord.items?.map((item, idx) => {
                          const prodName = item.product?.name || item.name;
                          const prodUnit = item.product?.unit || item.unit;
                          return (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-xs text-slate-300 py-1"
                            >
                              <span>
                                {item.quantity}× {prodName} {prodUnit ? `(${prodUnit})` : ''}
                              </span>
                              <span className="font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded-md">
                                Qty: {item.quantity}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="pt-1 flex justify-between items-center text-xs text-slate-400">
                        <span>Total Items: {(ord.items || []).reduce((s, i) => s + (i.quantity || 1), 0)} items</span>
                        <span className="text-emerald-400 font-semibold">Free Jaunpur Local Delivery</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
                <ShoppingCart className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="font-bold text-slate-300">
                  No orders match your filter
                </h3>
                <p className="text-xs text-slate-500">
                  When customers submit an order via WhatsApp Checkout, it will instantly appear here in real-time.
                </p>
              </div>
            )}
          </div>
        )}
        {/* TAB 3: ADMIN SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-lg space-y-4">
            <div>
              <h2 className="text-base font-bold text-white">Admin Login Settings</h2>
              <p className="text-xs text-slate-400">
                Current Admin ID: <span className="font-mono text-amber-400">{adminSession?.username}</span>
              </p>
            </div>

            {credError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{credError}</span>
              </div>
            )}

            <form onSubmit={handleSaveCredentials} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              {[
                { key: 'currentPassword', label: 'Current Password *', type: 'password', required: true },
                { key: 'newUsername', label: 'New Admin ID (leave empty to keep same)', type: 'text' },
                { key: 'newPassword', label: 'New Password (min 8 chars, leave empty to keep same)', type: 'password' },
                { key: 'confirmPassword', label: 'Confirm New Password', type: 'password' },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs font-bold text-slate-300 mb-1">{f.label}</label>
                  <input
                    type={f.type}
                    required={f.required}
                    value={credForm[f.key]}
                    onChange={(e) => setCredForm({ ...credForm, [f.key]: e.target.value })}
                    autoComplete="off"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={isSavingCreds}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm disabled:opacity-50"
              >
                {isSavingCreds ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                <span>{isSavingCreds ? 'Saving...' : 'Save Admin Credentials'}</span>
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Product Add / Edit Modal with Firebase Storage live upload */}
      <ProductForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={editingProduct}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
