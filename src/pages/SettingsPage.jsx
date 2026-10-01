import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Settings,
  Camera,
  Trash2,
  Lock,
  Moon,
  Sun,
  LogOut,
  ShieldCheck,
  Check,
  AlertCircle,
  Phone,
  MapPin,
  Save,
  Package,
  Clock,
  MessageCircle,
  Loader2,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { orderService } from '../services/orderService';
import { firebaseStorageService } from '../services/firebaseStorageService';
import { formatDateTime } from '../utils/formatters';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, updateProfile, changePassword, logout } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const fileInputRef = useRef(null);

  // Tab State: 'profile' | 'orders' | 'security'
  const [activeTab, setActiveTab] = useState('profile');

  // Edit Profile Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  // Order History State
  const [userOrders, setUserOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Avatar Upload State
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Status feedback
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Keep form data synced when user session loads
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  // Real-time Order History Subscription for current customer
  useEffect(() => {
    if (user) {
      setOrdersLoading(true);
      const userId = user.id || user.uid;
      const unsubscribe = orderService.subscribeToUserOrders(userId, (orders) => {
        setUserOrders(orders);
        setOrdersLoading(false);
      });
      return () => {
        if (typeof unsubscribe === 'function') unsubscribe();
      };
    }
  }, [user]);

  // If not logged in, prompt sign in
  if (!user) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 text-center rounded-3xl glass-card border border-white/60 dark:border-white/10 shadow-glass space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
          Sign In to Access Settings & Orders
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Sign in to track your past grocery orders, manage delivery addresses, and update your profile photo.
        </p>
        <div className="pt-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/30 transition-all"
          >
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  // Handle Avatar Upload directly to Firebase Storage with progress tracking
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    setUploadProgress(10);
    try {
      const userId = user.id || user.uid;
      const downloadURL = await firebaseStorageService.uploadAvatar(userId, file, (percent) => {
        setUploadProgress(percent);
      });

      await updateProfile({ avatar: downloadURL });
      showToast('Profile photo uploaded and saved!', 'success');
    } catch (err) {
      console.error('[SettingsPage] Avatar upload failed:', err);
      showToast(err.message || 'Failed to upload photo.', 'error');
    } finally {
      setIsUploadingAvatar(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      await updateProfile({ avatar: '' });
      showToast('Profile photo removed.', 'info');
    } catch (err) {
      showToast('Failed to remove photo.', 'error');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        name: profileData.name.trim(),
        phone: profileData.phone.trim(),
        address: profileData.address.trim(),
      });
      setProfileSuccessMsg('Profile details saved successfully!');
      showToast('Profile updated!', 'success');
      setTimeout(() => setProfileSuccessMsg(''), 3000);
    } catch (err) {
      showToast(err.message || 'Failed to update profile.', 'error');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!passwordData.currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordSuccess('Password changed successfully with verification!');
      showToast('Password updated successfully!', 'success');
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      setTimeout(() => setPasswordSuccess(''), 3500);
    } catch (err) {
      setPasswordError(err.message || 'Failed to change password. Please check your current password.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    showToast('Signed out of Aastha Store.', 'info');
    navigate('/');
  };

  // Helper for status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-300/40';
      case 'Dispatched':
        return 'bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border-blue-300/40';
      case 'Preparing':
        return 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-300/40';
      case 'Cancelled':
        return 'bg-red-100 dark:bg-red-950/70 text-red-800 dark:text-red-300 border-red-300/40';
      default:
        return 'bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border-purple-300/40';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-24 md:pb-16">
      {/* Header Banner (NO ADMIN LINKS) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            My Account & Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Manage your personal profile, order history, and security credentials
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'profile'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile & Avatar</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'orders'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Order History</span>
          {userOrders.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white text-emerald-700 font-extrabold">
              {userOrders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'security'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Security & Password</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Quick Info Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-white/60 dark:border-white/10 text-center space-y-4 shadow-glass">
            {/* Avatar with Upload & Delete */}
            <div className="relative inline-block mx-auto">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-28 h-28 rounded-full object-cover border-4 border-emerald-500/30 shadow-md"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-emerald-600 to-amber-500 text-white flex items-center justify-center text-4xl font-black shadow-md">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}

              {/* Upload trigger button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute bottom-0 right-0 p-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 transition-transform active:scale-95 disabled:opacity-50"
                title="Upload Photo to Firebase Storage"
              >
                {isUploadingAvatar ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            {/* Upload Progress Bar */}
            {isUploadingAvatar && (
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-600 h-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}

            {user.avatar && !isUploadingAvatar && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 font-semibold flex items-center justify-center gap-1 mx-auto"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Avatar</span>
              </button>
            )}

            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {user.name}
              </h2>
              <p className="text-xs text-slate-400 font-medium">{user.email || user.username}</p>
              <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                Customer Account
              </div>
            </div>

            {/* Quick Stats */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-left space-y-1 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Orders Placed:</span>
                <span className="font-bold text-slate-900 dark:text-white">{userOrders.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Store Hub:</span>
                <span className="font-medium text-emerald-600">Jaunpur, UP</span>
              </div>
            </div>

            {/* Logout Action */}
            <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs sm:text-sm font-bold transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Tab Content */}
        <div className="md:col-span-2 space-y-6">
          {/* TAB 1: PROFILE FORM */}
          {activeTab === 'profile' && (
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/60 dark:border-white/10 shadow-glass space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
                <div className="flex items-center gap-2.5">
                  <User className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">
                    Personal Information
                  </h3>
                </div>
                {profileSuccessMsg && (
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 animate-fade-in">
                    <Check className="w-4 h-4" />
                    {profileSuccessMsg}
                  </span>
                )}
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    WhatsApp Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="9807329612"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Pre-fills your WhatsApp orders for swift Jaunpur delivery.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    Saved Delivery Address (Jaunpur, UP)
                  </label>
                  <textarea
                    rows={3}
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    placeholder="House/Colony, Street, Near landmark, Jaunpur"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/30 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Profile Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: ORDER HISTORY TRACKING (NO PRICES) */}
          {activeTab === 'orders' && (
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/60 dark:border-white/10 shadow-glass space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
                <div className="flex items-center gap-2.5">
                  <Package className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">
                    My Order History
                  </h3>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {userOrders.length} {userOrders.length === 1 ? 'Order' : 'Orders'}
                </span>
              </div>

              {ordersLoading ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-3">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                  <p className="text-xs text-slate-500">Loading order records from Firestore...</p>
                </div>
              ) : userOrders.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
                  <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
                    No orders placed yet
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    When you place an order with WhatsApp checkout, your order will automatically be tracked here in real-time.
                  </p>
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {userOrders.map((ord) => (
                    <div
                      key={ord.id || ord.orderId}
                      className="p-4 sm:p-5 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs sm:text-sm font-black text-emerald-700 dark:text-emerald-400">
                            #{ord.orderId || ord.id}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                              ord.status
                            )}`}
                          >
                            {ord.status || 'Received'}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{formatDateTime(ord.createdAt)}</span>
                        </div>
                      </div>

                      {/* Items Preview (NO PRICES) */}
                      <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                        {(ord.items || []).map((item, idx) => (
                          <div key={idx} className="py-1.5 flex items-center justify-between">
                            <span className="text-slate-700 dark:text-slate-300 font-medium">
                              {item.name} {item.unit ? `(${item.unit})` : ''}
                            </span>
                            <span className="font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                              Qty: {item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Footer & Action */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] text-slate-400">Total Items:</span>
                          <span className="ml-1 text-xs font-bold text-slate-800 dark:text-slate-200">
                            {(ord.items || []).reduce((s, i) => s + (i.quantity || 1), 0)} items
                          </span>
                        </div>

                        <a
                          href={`https://wa.me/919807329612?text=Namaste!%20Inquiry%20regarding%20Order%20%23${encodeURIComponent(
                            ord.orderId || ord.id
                          )}%20placed%20at%20Aastha%20General%20Store.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-bold transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>WhatsApp Store Support</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SECURITY & PASSWORD */}
          {activeTab === 'security' && (
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/60 dark:border-white/10 shadow-glass space-y-6">
              <div className="pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
                <div className="flex items-center gap-2.5">
                  <Lock className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">
                    Change Password
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Requires current-password verification via Firebase Auth before updating.
                </p>
              </div>

              {passwordError && (
                <div className="p-3 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Current Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    New Password (Min 6 chars) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Confirm New Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordData.confirmNewPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/30 transition-all disabled:opacity-50"
                  >
                    {isUpdatingPassword ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying & Updating...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Update Password</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
