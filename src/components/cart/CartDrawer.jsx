import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  PackageOpen,
  Info,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import QuantitySelector from '../common/QuantitySelector';
import CheckoutModal from './CheckoutModal';

export default function CartDrawer({ isOpen, onClose }) {
  const { items, itemCount, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
        {/* Backdrop */}
        <div
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md transform transition-all ease-in-out duration-300">
            <div className="h-full flex flex-col bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl border-l border-white/20 dark:border-slate-800">
              {/* Drawer Header */}
              <div className="p-4 sm:p-6 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      Your Order Cart
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                        {itemCount} {itemCount === 1 ? 'item' : 'items'}
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Aastha General Store • Jaunpur, UP
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close cart"
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Delivery Banner */}
              <div className="px-4 py-2.5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-b border-emerald-500/20 flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Free local delivery across Jaunpur city!</span>
              </div>

              {/* Drawer Body / Items List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
                      <PackageOpen className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                        Your Cart is Empty
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                        Browse our fresh groceries, snacks, chocolates, and cosmetics to add items.
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
                    >
                      Start Browsing
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.product.id}
                      className="p-3.5 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80 flex items-center gap-3.5"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-14 h-14 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                          {item.product.name}
                        </h4>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          <span>Unit: {item.product.unit || '1 pc'}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <QuantitySelector
                            quantity={item.quantity}
                            onChange={(qty) => updateQuantity(item.product.id, qty)}
                            min={1}
                            max={99}
                          />
                          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                            Qty: {item.quantity}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer (NO PRICES SHOWN) */}
              {items.length > 0 && (
                <div className="p-4 sm:p-6 border-t border-slate-200/80 dark:border-slate-800/80 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="p-3 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/40 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                      <Info className="w-4 h-4 shrink-0" />
                      <span>Physical Store Pricing Policy</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      Item prices will be confirmed with best daily retail rates upon WhatsApp order or physical store pickup.
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>Total Selected Items:</span>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {itemCount} {itemCount === 1 ? 'item' : 'items'} ({items.length} unique)
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={clearCart}
                      className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-red-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => setIsCheckoutOpen(true)}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Proceed to WhatsApp Order</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => {
            setIsCheckoutOpen(false);
            onClose();
          }}
        />
      )}
    </>
  );
}
