import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCart,
  Trash2,
  ArrowLeft,
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Truck,
  RotateCcw,
  Info,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import QuantitySelector from '../components/common/QuantitySelector';
import CheckoutModal from '../components/cart/CheckoutModal';

export default function CartPage() {
  const { items, itemCount, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleClearWithConfirm = () => {
    if (window.confirm('Are you sure you want to remove all items from your cart?')) {
      clearCart();
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-24 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/shop"
            className="p-2.5 rounded-2xl glass-card text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Your Shopping Cart
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} in your order list
            </p>
          </div>
        </div>

        {items.length > 0 && (
          <button
            onClick={handleClearWithConfirm}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 glass-card hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Cart</span>
          </button>
        )}
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl glass-card border border-white/60 dark:border-white/10 hover:border-emerald-500/40 shadow-sm transition-all"
              >
                {/* Thumbnail & Product Details */}
                <div className="flex items-center gap-4 flex-1">
                  <img
                    src={product.image}
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80';
                    }}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200/60 dark:border-slate-800 shrink-0 bg-slate-100"
                  />

                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 tracking-wider">
                      {product.category}
                    </span>
                    <h3 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 truncate">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Unit Size: <span className="font-semibold text-slate-700 dark:text-slate-300">{product.unit || '1 pc'}</span>
                    </p>
                  </div>
                </div>

                {/* Quantity & Remove */}
                <div className="flex items-center justify-between sm:justify-end gap-5 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 dark:border-slate-800">
                  <QuantitySelector
                    quantity={quantity}
                    onChange={(newQty) => updateQuantity(product.id, newQty)}
                    min={1}
                    max={99}
                  />

                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Order Summary & Checkout Card (NO PRICES) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="glass-card p-6 rounded-3xl border border-white/60 dark:border-white/10 shadow-glass space-y-5">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Order Summary
              </h2>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Selected Products</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {items.length} {items.length === 1 ? 'variety' : 'varieties'}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Total Quantity</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {itemCount} units
                  </span>
                </div>

                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>Local Delivery (Jaunpur)</span>
                  <span className="uppercase text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    FREE
                  </span>
                </div>
              </div>

              {/* Physical Store Pricing Notice */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/50 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>Physical Store Pricing</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Exact item prices are verified at current daily retail rates upon WhatsApp order or physical store pickup at Station Road, Harlalka Rd, Shakar Mandi, Jaunpur, Bagmia, Uttar Pradesh - 222001.
                </p>
              </div>

              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm sm:text-base shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Place Order via WhatsApp</span>
              </button>

              <div className="space-y-2 text-[11px] text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Doorstep delivery available across Jaunpur city</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Direct WhatsApp bill with +91 98073 29612</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Cart State */
        <div className="max-w-md mx-auto my-12 p-8 text-center rounded-3xl glass-card border border-white/60 dark:border-white/10 shadow-glass space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Your Cart is Empty
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            You haven't added any groceries, snacks, chocolates, or gift items to your order list yet.
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/30 transition-all"
            >
              Start Ordering Now
            </Link>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
        />
      )}
    </div>
  );
}
