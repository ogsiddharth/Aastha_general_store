import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { productService } from '../services/productService';
import { CATEGORIES } from '../data/productsData';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => productService.getProducts());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Subscribe to real-time Firestore sync & local storage changes
    const unsubscribe = productService.subscribeToProducts((updatedProducts) => {
      if (Array.isArray(updatedProducts)) {
        setProducts(updatedProducts);
      }
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const refreshProducts = useCallback(() => {
    const fresh = productService.getProducts(true);
    setProducts(fresh);
  }, []);

  const addProduct = useCallback(async (productData) => {
    setLoading(true);
    try {
      const created = await productService.addProduct(productData);
      refreshProducts();
      return created;
    } finally {
      setLoading(false);
    }
  }, [refreshProducts]);

  const updateProduct = useCallback(async (id, updateData) => {
    setLoading(true);
    try {
      const updated = await productService.updateProduct(id, updateData);
      refreshProducts();
      return updated;
    } finally {
      setLoading(false);
    }
  }, [refreshProducts]);

  const deleteProduct = useCallback(async (id) => {
    setLoading(true);
    try {
      const success = await productService.deleteProduct(id);
      refreshProducts();
      return success;
    } finally {
      setLoading(false);
    }
  }, [refreshProducts]);

  const toggleStock = useCallback(async (id) => {
    const updated = await productService.toggleStock(id);
    refreshProducts();
    return updated;
  }, [refreshProducts]);

  const toggleBestseller = useCallback(async (id) => {
    const updated = await productService.toggleBestseller(id);
    refreshProducts();
    return updated;
  }, [refreshProducts]);

  const seedCatalogToFirestore = useCallback(async () => {
    setLoading(true);
    try {
      const result = await productService.seedCatalogToFirestore();
      refreshProducts();
      return result;
    } finally {
      setLoading(false);
    }
  }, [refreshProducts]);

  const resetToDefault = useCallback(() => {
    const def = productService.resetToDefaultProducts();
    setProducts(def);
    return def;
  }, []);

  // Memoized Bestsellers
  const bestsellers = useMemo(() => {
    return products.filter((p) => p.isBestseller);
  }, [products]);

  // Memoized Out of Stock count
  const outOfStockCount = useMemo(() => {
    return products.filter((p) => !p.inStock).length;
  }, [products]);

  const value = {
    products,
    categories: CATEGORIES,
    bestsellers,
    outOfStockCount,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleStock,
    toggleBestseller,
    seedCatalogToFirestore,
    resetToDefault,
    refreshProducts,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
