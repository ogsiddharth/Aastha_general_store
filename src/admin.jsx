import React from 'react';
import ReactDOM from 'react-dom/client';
import AdminApp from './AdminApp';
import { ToastProvider } from './context/ToastContext';
import { ProductProvider } from './context/ProductContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('admin-root')).render(
  <React.StrictMode>
    <ToastProvider>
      <ProductProvider>
        <AdminApp />
      </ProductProvider>
    </ToastProvider>
  </React.StrictMode>
);
