import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { storageService } from '../services/storageService';

const CART_STORAGE_KEY = 'aastha_cart';
const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    return storageService.getItem(CART_STORAGE_KEY, []);
  });

  // Sync cart changes to localStorage
  useEffect(() => {
    storageService.setItem(CART_STORAGE_KEY, items);
  }, [items]);

  // Add product to cart with specified quantity (default 1)
  const addToCart = (product, quantity = 1) => {
    if (!product || !product.inStock) return;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const next = [...prevItems];
        const newQty = Math.min(99, Math.max(1, next[existingIndex].quantity + quantity));
        next[existingIndex] = { ...next[existingIndex], quantity: newQty };
        return next;
      }
      return [...prevItems, { product, quantity: Math.min(99, Math.max(1, quantity)) }];
    });
  };

  // Remove single product completely from cart
  const removeFromCart = (productId) => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  // Update quantity directly (min 1, max 99)
  const updateQuantity = (productId, quantity) => {
    const validQty = Math.min(99, Math.max(1, parseInt(quantity, 10) || 1));
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity: validQty } : item
      )
    );
  };

  // Clear all cart items
  const clearCart = () => {
    setItems([]);
  };

  // Get current quantity of a specific product
  const getItemQuantity = (productId) => {
    const item = items.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  // Total quantity of units in cart
  const itemCount = useMemo(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  // Grand total in INR
  const cartTotal = useMemo(() => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [items]);

  const value = {
    items,
    itemCount,
    cartTotal,
    isEmpty: items.length === 0,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
