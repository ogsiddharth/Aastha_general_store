/**
 * Order Service for Aastha General Store
 * Fully integrated with Firebase Cloud Firestore for real-time order processing.
 * Powers WhatsApp checkout persistence, live admin order management, and customer order history.
 */

import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured, COLLECTIONS } from '../firebase';
import { storageService } from './storageService';

const ORDERS_STORAGE_KEY = 'aastha_orders';
const ORDERS_UPDATE_EVENT = 'aastha_orders_updated';

// In-memory cache for fast local reads
let memoryOrdersCache = null;

function notifyOrderChange(orders) {
  memoryOrdersCache = orders;
  storageService.setItem(ORDERS_STORAGE_KEY, orders);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(ORDERS_UPDATE_EVENT, { detail: orders }));
  }
}

export const orderService = {
  /**
   * Fetch all cached local orders
   * @returns {Array}
   */
  getOrders: () => {
    if (memoryOrdersCache && Array.isArray(memoryOrdersCache)) {
      return memoryOrdersCache;
    }
    const orders = storageService.getItem(ORDERS_STORAGE_KEY, []);
    memoryOrdersCache = Array.isArray(orders) ? orders : [];
    return memoryOrdersCache;
  },

  /**
   * Generate clean Aastha Store Order ID (e.g. AST-7329-8142)
   */
  generateOrderId: () => {
    const timestampPart = Date.now().toString().slice(-4);
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `AST-${timestampPart}-${randomPart}`;
  },

  /**
   * Save a customer order. Writes directly to Firestore 'orders' collection.
   * @param {Object} orderData 
   * @returns {Promise<Object>} Created order document
   */
  saveOrder: async (orderData) => {
    const orderId = orderService.generateOrderId();
    const cleanOrder = {
      orderId,
      customerName: orderData.customerName?.trim() || 'Valued Customer',
      phone: orderData.phone?.trim() || '',
      address: orderData.address?.trim() || '',
      note: orderData.note?.trim() || '',
      items: (orderData.items || []).map((item) => ({
        id: item.product?.id || item.id,
        name: item.product?.name || item.name,
        price: item.product?.price || item.price,
        unit: item.product?.unit || item.unit || '1 pc',
        quantity: item.quantity || 1,
        image: item.product?.image || item.image || '',
      })),
      total: Number(orderData.total) || 0,
      itemCount: orderData.items?.reduce((sum, i) => sum + (i.quantity || 1), 0) || 0,
      status: 'Received', // 'Received' | 'Preparing' | 'Dispatched' | 'Delivered' | 'Cancelled'
      userId: orderData.userId || null,
      userEmail: orderData.userEmail || null,
      createdAt: new Date().toISOString(),
    };

    if (isFirebaseConfigured && db) {
      try {
        const docRef = await addDoc(collection(db, COLLECTIONS.ORDERS), {
          ...cleanOrder,
          serverTimestamp: serverTimestamp(),
        });
        const savedOrder = { id: docRef.id, ...cleanOrder };
        
        // Optimistic local update
        const existing = orderService.getOrders();
        notifyOrderChange([savedOrder, ...existing]);
        return savedOrder;
      } catch (err) {
        console.error('[orderService] Firestore saveOrder error:', err);
      }
    }

    // Local fallback
    const savedOrder = { id: orderId, ...cleanOrder };
    const existing = orderService.getOrders();
    const updated = [savedOrder, ...existing];
    notifyOrderChange(updated);
    return savedOrder;
  },

  /**
   * Subscribe to real-time incoming orders for Admin Panel.
   * Listens via Firestore onSnapshot for multi-device real-time alerts.
   * @param {Function} callback 
   * @returns {Function} Unsubscribe function
   */
  subscribeToOrders: (callback) => {
    if (isFirebaseConfigured && db) {
      try {
        const ordersCol = collection(db, COLLECTIONS.ORDERS);
        const unsubscribe = onSnapshot(
          ordersCol,
          (snapshot) => {
            const list = snapshot.docs.map((docSnap) => ({
              id: docSnap.id,
              ...docSnap.data(),
            }));

            // Sort newest first
            list.sort((a, b) => {
              const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt || 0).getTime();
              const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt || 0).getTime();
              return timeB - timeA;
            });

            memoryOrdersCache = list;
            storageService.setItem(ORDERS_STORAGE_KEY, list);
            callback(list);
          },
          (err) => {
            console.warn('[orderService] Firestore subscription error, using local fallback:', err);
            callback(orderService.getOrders());
          }
        );
        return unsubscribe;
      } catch (err) {
        console.error('[orderService] Error attaching Firestore order listener:', err);
      }
    }

    // Local fallback listener
    const handleLocalUpdate = (e) => {
      const updated = e.detail || orderService.getOrders();
      callback(updated);
    };

    window.addEventListener(ORDERS_UPDATE_EVENT, handleLocalUpdate);
    window.addEventListener('storage', (e) => {
      if (e.key === ORDERS_STORAGE_KEY) {
        callback(orderService.getOrders());
      }
    });

    callback(orderService.getOrders());

    return () => {
      window.removeEventListener(ORDERS_UPDATE_EVENT, handleLocalUpdate);
    };
  },

  /**
   * Subscribe to customer-specific orders for Order History tracking
   * @param {string} userId 
   * @param {Function} callback 
   * @returns {Function}
   */
  subscribeToUserOrders: (userId, callback) => {
    if (!userId) {
      callback([]);
      return () => {};
    }

    if (isFirebaseConfigured && db) {
      try {
        const ordersCol = collection(db, COLLECTIONS.ORDERS);
        const q = query(ordersCol, where('userId', '==', userId));

        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const list = snapshot.docs.map((docSnap) => ({
              id: docSnap.id,
              ...docSnap.data(),
            }));
            list.sort((a, b) => {
              const timeA = new Date(a.createdAt || 0).getTime();
              const timeB = new Date(b.createdAt || 0).getTime();
              return timeB - timeA;
            });
            callback(list);
          },
          (err) => {
            console.warn('[orderService] Error fetching user orders from Firestore:', err);
            // Fallback: filter local orders by userId
            const local = orderService.getOrders().filter((o) => o.userId === userId);
            callback(local);
          }
        );
        return unsubscribe;
      } catch (err) {
        console.error('[orderService] Failed user orders query:', err);
      }
    }

    // Local fallback
    const filterAndCallback = () => {
      const local = orderService.getOrders().filter((o) => o.userId === userId);
      callback(local);
    };

    window.addEventListener(ORDERS_UPDATE_EVENT, filterAndCallback);
    filterAndCallback();

    return () => {
      window.removeEventListener(ORDERS_UPDATE_EVENT, filterAndCallback);
    };
  },

  /**
   * Update order fulfillment status (Received -> Preparing -> Dispatched -> Delivered -> Cancelled)
   * @param {string} id 
   * @param {string} status 
   */
  updateOrderStatus: async (id, status) => {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, COLLECTIONS.ORDERS, id);
        await updateDoc(docRef, {
          status,
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.error('[orderService] Firestore updateOrderStatus error:', err);
      }
    }

    const orders = orderService.getOrders();
    let updatedOrder = null;
    const updated = orders.map((o) => {
      if (o.id === id || o.orderId === id) {
        updatedOrder = { ...o, status, updatedAt: new Date().toISOString() };
        return updatedOrder;
      }
      return o;
    });

    if (updatedOrder) {
      notifyOrderChange(updated);
    }
    return updatedOrder;
  },

  /**
   * Delete order (Admin cleanup)
   * @param {string} id 
   */
  deleteOrder: async (id) => {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, COLLECTIONS.ORDERS, id);
        await deleteDoc(docRef);
      } catch (err) {
        console.error('[orderService] Firestore deleteOrder error:', err);
      }
    }

    const orders = orderService.getOrders();
    const updated = orders.filter((o) => o.id !== id && o.orderId !== id);
    notifyOrderChange(updated);
    return true;
  },

  /**
   * Clear all recorded orders
   */
  clearOrders: () => {
    notifyOrderChange([]);
    return true;
  },
};
