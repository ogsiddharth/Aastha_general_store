import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
              <div className="min-h-screen text-slate-800 dark:text-slate-100 selection:bg-emerald-500 selection:text-white">
                <AppRoutes />
              </div>
            </CartProvider>
          </ProductProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
