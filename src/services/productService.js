/**
 * Product Service for Aastha General Store
 * Fully integrated with Firebase Cloud Firestore for real-time inventory management.
 * Provides live syncing across customer storefront and admin dashboard.
 * Includes graceful offline/local fallback.
 */

import {
  collection,
  doc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured, COLLECTIONS } from '../firebase';
import { storageService } from './storageService';
import { INITIAL_PRODUCTS } from '../data/productsData';

const PRODUCTS_STORAGE_KEY = 'aastha_products';
const UPDATE_EVENT_KEY = 'aastha_products_updated';

// In-memory cache for ultra-fast synchronous reads
let memoryProductsCache = null;

// Cross-tab broadcast channel for instantaneous zero-refresh synchronization
const syncChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('aastha_product_sync_channel')
  : null;

// Helper to notify local listeners and cross-tab channels
function notifyProductChange(products) {
  memoryProductsCache = products;
  storageService.setItem(PRODUCTS_STORAGE_KEY, products);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT_KEY, { detail: products }));
  }
  if (syncChannel) {
    try {
      syncChannel.postMessage({ type: 'PRODUCTS_UPDATED', products });
    } catch (err) {
      console.warn('[productService] BroadcastChannel postMessage error:', err);
    }
  }
}

export const productService = {
  /**
   * Synchronous getter for immediate render from cache or initial seed
   * @param {boolean} [forceRefresh=false]
   * @returns {Array} List of products
   */
  getProducts: (forceRefresh = false) => {
    if (!forceRefresh && memoryProductsCache && Array.isArray(memoryProductsCache) && memoryProductsCache.length > 0) {
      return memoryProductsCache;
    }
    const stored = storageService.getItem(PRODUCTS_STORAGE_KEY, null);
    if (stored && Array.isArray(stored) && stored.length > 0) {
      memoryProductsCache = stored;
      return stored;
    }
    memoryProductsCache = INITIAL_PRODUCTS;
    storageService.setItem(PRODUCTS_STORAGE_KEY, INITIAL_PRODUCTS);
    return INITIAL_PRODUCTS;
  },

  /**
   * Subscribe to real-time product updates.
   * If Firebase is active, connects via Firestore onSnapshot for multi-device live sync.
   * Also connects to BroadcastChannel and window storage events for instantaneous multi-tab sync.
   * @param {Function} callback - Called with updated products array
   * @returns {Function} Unsubscribe function
   */
  subscribeToProducts: (callback) => {
    let firestoreUnsubscribe = null;

    if (isFirebaseConfigured && db) {
      try {
        const productsCol = collection(db, COLLECTIONS.PRODUCTS);
        // Real-time listener from Firestore
        firestoreUnsubscribe = onSnapshot(
          productsCol,
          (snapshot) => {
            if (!snapshot.empty) {
              const remoteProducts = snapshot.docs.map((docSnap) => {
                const data = docSnap.data();
                return {
                  id: docSnap.id,
                  ...data,
                  price: Number(data.price) || 0,
                  inStock: data.inStock !== undefined ? Boolean(data.inStock) : true,
                  isBestseller: Boolean(data.isBestseller),
                };
              });

              // Stable sort by createdAt DESC, then by name ASC
              remoteProducts.sort((a, b) => {
                const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt || 0).getTime();
                const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt || 0).getTime();
                if (timeB !== timeA) return timeB - timeA;
                return (a.name || '').localeCompare(b.name || '');
              });

              memoryProductsCache = remoteProducts;
              storageService.setItem(PRODUCTS_STORAGE_KEY, remoteProducts);
              callback(remoteProducts);
            } else {
              // Remote collection is empty: Provide initial seed and allow 1-click cloud sync
              console.info('[productService] Firestore products collection is empty. Initial seed available.');
              const localProducts = productService.getProducts();
              callback(localProducts);
            }
          },
          (error) => {
            console.warn('[productService] Firestore onSnapshot error, falling back to local cache:', error);
            callback(productService.getProducts());
          }
        );
      } catch (err) {
        console.error('[productService] Failed to set up Firestore listener:', err);
      }
    }

    // Local in-window custom event handler
    const handleLocalUpdate = (e) => {
      const updated = e.detail || productService.getProducts(true);
      callback(updated);
    };

    // Cross-tab storage event listener: invalidate cache and trigger callback
    const handleStorageUpdate = (e) => {
      if (e.key === PRODUCTS_STORAGE_KEY) {
        memoryProductsCache = null;
        const fresh = productService.getProducts(true);
        callback(fresh);
      }
    };

    // Cross-tab BroadcastChannel listener for immediate sync
    const handleBroadcastMessage = (event) => {
      if (event.data?.type === 'PRODUCTS_UPDATED' && Array.isArray(event.data.products)) {
        memoryProductsCache = event.data.products;
        callback(event.data.products);
      }
    };

    window.addEventListener(UPDATE_EVENT_KEY, handleLocalUpdate);
    window.addEventListener('storage', handleStorageUpdate);
    if (syncChannel) {
      syncChannel.addEventListener('message', handleBroadcastMessage);
    }

    // Initial trigger with current products
    callback(productService.getProducts());

    return () => {
      if (typeof firestoreUnsubscribe === 'function') {
        firestoreUnsubscribe();
      }
      window.removeEventListener(UPDATE_EVENT_KEY, handleLocalUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
      if (syncChannel) {
        syncChannel.removeEventListener('message', handleBroadcastMessage);
      }
    };
  },

  /**
   * Find product by ID
   * @param {string} id 
   * @returns {Object|null}
   */
  getProductById: (id) => {
    const products = productService.getProducts();
    return products.find((p) => p.id === id) || null;
  },

  /**
   * Add a new product to inventory. Saves to Firestore when online.
   * @param {Object} productData 
   * @returns {Promise<Object>} Created product
   */
  addProduct: async (productData) => {
    const newProduct = {
      name: productData.name.trim(),
      price: Number(productData.price) || 0,
      category: productData.category || 'General Groceries',
      image: productData.image?.trim() || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
      unit: productData.unit?.trim() || '1 pc',
      isBestseller: Boolean(productData.isBestseller),
      inStock: productData.inStock !== undefined ? Boolean(productData.inStock) : true,
      description: productData.description?.trim() || 'Fresh stock available at Aastha General Store, Jaunpur.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isFirebaseConfigured && db) {
      try {
        const docRef = await addDoc(collection(db, COLLECTIONS.PRODUCTS), {
          ...newProduct,
          serverTimestamp: serverTimestamp(),
        });
        const created = { id: docRef.id, ...newProduct };
        // Update local cache optimistically
        const existing = productService.getProducts();
        notifyProductChange([created, ...existing]);
        return created;
      } catch (err) {
        console.error('[productService] Firestore addDoc failed:', err);
      }
    }

    // Local fallback
    const id = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const created = { id, ...newProduct };
    const existing = productService.getProducts();
    const updated = [created, ...existing];
    notifyProductChange(updated);
    return created;
  },

  /**
   * Update an existing product. Syncs with Firestore.
   * @param {string} id 
   * @param {Object} updateData 
   * @returns {Promise<Object|null>} Updated product
   */
  updateProduct: async (id, updateData) => {
    const cleanUpdate = {
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    if (cleanUpdate.price !== undefined) cleanUpdate.price = Number(cleanUpdate.price);
    if (cleanUpdate.inStock !== undefined) cleanUpdate.inStock = Boolean(cleanUpdate.inStock);
    if (cleanUpdate.isBestseller !== undefined) cleanUpdate.isBestseller = Boolean(cleanUpdate.isBestseller);

    // Fetch existing product data to ensure complete upsert if doc doesn't exist yet in Firestore
    const current = productService.getProductById(id);
    const mergedDocData = {
      ...(current || {}),
      ...cleanUpdate,
    };

    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, COLLECTIONS.PRODUCTS, id);
        // Use setDoc with merge: true so both existing and non-pre-seeded items are safely updated
        await setDoc(docRef, mergedDocData, { merge: true });
      } catch (err) {
        console.error('[productService] Firestore setDoc upsert failed:', err);
      }
    }

    // Update local cache and notify listeners
    const products = productService.getProducts();
    let updatedProduct = null;
    const updatedList = products.map((item) => {
      if (item.id === id) {
        updatedProduct = { ...item, ...cleanUpdate };
        return updatedProduct;
      }
      return item;
    });

    if (updatedProduct) {
      notifyProductChange(updatedList);
    }
    return updatedProduct;
  },

  /**
   * Delete product by ID. Removes from Firestore.
   * @param {string} id 
   * @returns {Promise<boolean>}
   */
  deleteProduct: async (id) => {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, COLLECTIONS.PRODUCTS, id);
        await deleteDoc(docRef);
      } catch (err) {
        console.error('[productService] Firestore deleteDoc failed:', err);
      }
    }

    const products = productService.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    notifyProductChange(filtered);
    return true;
  },

  /**
   * Toggle in-stock status
   * @param {string} id 
   */
  toggleStock: async (id) => {
    const product = productService.getProductById(id);
    if (!product) return null;
    return await productService.updateProduct(id, { inStock: !product.inStock });
  },

  /**
   * Toggle bestseller status
   * @param {string} id 
   */
  toggleBestseller: async (id) => {
    const product = productService.getProductById(id);
    if (!product) return null;
    return await productService.updateProduct(id, { isBestseller: !product.isBestseller });
  },

  /**
   * Seed all 50+ initial products directly into Cloud Firestore
   * Admin utility to populate the cloud catalog in 1 click.
   * @returns {Promise<{ success: boolean, count: number }>}
   */
  seedCatalogToFirestore: async () => {
    if (!isFirebaseConfigured || !db) {
      // If not connected to Firebase, simply reseed local storage
      productService.resetToDefaultProducts();
      return { success: true, count: INITIAL_PRODUCTS.length, localOnly: true };
    }

    try {
      const batch = writeBatch(db);
      const productsCol = collection(db, COLLECTIONS.PRODUCTS);

      // Firestore batches are limited to 500 writes
      INITIAL_PRODUCTS.forEach((prod) => {
        const docRef = doc(productsCol, prod.id);
        batch.set(docRef, {
          name: prod.name,
          price: prod.price,
          category: prod.category,
          image: prod.image,
          unit: prod.unit,
          isBestseller: prod.isBestseller,
          inStock: prod.inStock,
          description: prod.description,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      });

      await batch.commit();
      console.info(`[productService] Successfully seeded ${INITIAL_PRODUCTS.length} products to Firestore!`);
      return { success: true, count: INITIAL_PRODUCTS.length, localOnly: false };
    } catch (err) {
      console.error('[productService] Error batch seeding Firestore:', err);
      throw err;
    }
  },

  /**
   * Reset local catalog to initial 55 items
   */
  resetToDefaultProducts: () => {
    notifyProductChange(INITIAL_PRODUCTS);
    return INITIAL_PRODUCTS;
  },
};
