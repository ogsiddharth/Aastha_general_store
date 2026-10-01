import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Customer Storefront Pages (Admin Panel is isolated in /manager-portal-sec-x9k2.html)
const HomePage = lazy(() => import('../pages/HomePage'));
const ShopPage = lazy(() => import('../pages/ShopPage'));
const CartPage = lazy(() => import('../pages/CartPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner message="Loading Aastha General Store..." />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
