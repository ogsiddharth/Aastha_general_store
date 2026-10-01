import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  ShoppingBag,
  Trash2,
  ShieldCheck,
  MessageCircle,
  PackageOpen,
  Info,
  MapPin,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import QuantitySelector from '../common/QuantitySelector';
import CheckoutModal from './CheckoutModal';
import { STORE_LOCATION } from '../../utils/formatters';

export default function CartDrawer({ isOpen, onClose }) {
  const { items, itemCount, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] overflow-hidden animate-fade-in">
        {/* Backdrop */}
        <div
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
        />

        {/* Drawer Wrapper - Full width on mobile (pl-0), bounded on sm+ screens */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
          <div className="w-full sm:w-[440px] max-w-full transform transition-all ease-in-out duration-300">
            <div className="h-[100dvh] flex flex-col bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200/80 dark:border-slate-800 overflow-hidden">
              
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-sm">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate">
                        Your Order Cart
                      </h2>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-extrabold text-[11px] shrink-0">
                        {itemCount} {itemCount === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      Station Road, Harlalka Rd, Shakar Mandi (222001)
                    </p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  aria-label="Close cart"
                  className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 touch-manipulation"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Delivery Banner */}
              <div className="px-4 py-2 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border-b border-emerald-500/15 flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 shrink-0">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">Free doorstep delivery across Jaunpur city!</span>
              </div>

              {/* Items List - Touch friendly and fully responsive without horizontal scroll */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden p-3.5 sm:p-5 space-y-3">
                {items.length === 0 ? (
                  <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
                      <PackageOpen className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-200">
                        Your Cart is Empty
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                        Add fresh groceries, Dairy Milk, Uncle Chips, cosmetics, and snacks to order directly on WhatsApp.
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all touch-manipulation"
                    >
                      Start Browsing Catalog
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.product.id}
                      className="relative p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3 hover:border-emerald-500/30 transition-all shadow-sm"
                    >
                      {/* Product Thumbnail */}
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80';
                        }}
                        className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl object-cover bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 shrink-0"
                      />

                      {/* Info & Quantity Selector */}
                      <div className="flex-1 min-w-0 pr-7">
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                          {item.product.category}
                        </span>
                        
                        <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-snug line-clamp-2 mt-0.5">
                          {item.product.name}
                        </h4>

                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Unit: <span className="font-semibold text-slate-700 dark:text-slate-300">{item.product.unit || '1 pc'}</span>
                        </div>

                        {/* Quantity Selector & Item Count Indicator */}
                        <div className="mt-2.5 flex items-center justify-between gap-2">
                          <QuantitySelector
                            quantity={item.quantity}
                            onChange={(qty) => updateQuantity(item.product.id, qty)}
                            min={1}
                            max={99}
                            size="sm"
                          />

                          <span className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/70 px-2 py-0.5 rounded-lg shrink-0">
                            Qty: {item.quantity}
                          </span>
                        </div>
                      </div>

                      {/* Remove Button - Top Right Absolute Position */}
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="absolute top-2.5 right-2.5 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors touch-manipulation"
                        title="Remove item"
                        aria-label={`Remove ${item.product.name} from cart`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer / Checkout Bar - Touch friendly and safe from viewport bottom bars */}
              {items.length > 0 && (
                <div className="p-4 sm:p-5 border-t border-slate-200/80 dark:border-slate-800 space-y-3 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-md shrink-0 pb-8 sm:pb-5">
                  {/* Physical Store Pricing Notice */}
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 flex items-start gap-2">
                    <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight">
                      Items billed at daily store rates upon delivery or pickup at Station Road, Harlalka Rd, Shakar Mandi, Jaunpur - 222001.
                    </p>
                  </div>

                  {/* Summary Row */}
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>Total Order Items:</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      {itemCount} {itemCount === 1 ? 'item' : 'items'} ({items.length} unique)
                    </span>
                  </div>

                  {/* Action Buttons Row */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={clearCart}
                      className="px-3.5 py-3 text-xs font-bold text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors shrink-0 touch-manipulation"
                      title="Empty your cart"
                    >
                      Clear
                    </button>

                    <button
                      onClick={() => setIsCheckoutOpen(true)}
                      className="flex-1 min-h-[48px] inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-600/25 transition-all hover:scale-[1.01] active:scale-[0.98] touch-manipulation"
                    >
                      <MessageCircle className="w-4 h-4 shrink-0" />
                      <span className="truncate">Proceed to WhatsApp Order</span>
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
