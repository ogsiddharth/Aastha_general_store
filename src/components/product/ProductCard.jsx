import React, { useState } from 'react';
import { ShoppingBag, Check, AlertCircle, Sparkles, Plus, Minus, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import QuantitySelector from '../common/QuantitySelector';

export default function ProductCard({ product }) {
  const { addToCart, getItemQuantity } = useCart();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);
  const [isAddedRecently, setIsAddedRecently] = useState(false);

  if (!product) return null;

  const currentCartQty = getItemQuantity(product.id);
  const isOutOfStock = !product.inStock;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (isOutOfStock) return;

    addToCart(product, quantity);
    setIsAddedRecently(true);
    showToast(`Added ${quantity}× "${product.name}" to cart!`, 'success');

    setTimeout(() => {
      setIsAddedRecently(false);
      setQuantity(1);
    }, 1200);
  };

  // Category Emoji Fallback mapping
  const categoryEmojis = {
    'General Groceries': '🌾',
    'Snacks & Chocolates': '🍫',
    'Daily Care': '🧼',
    'Cosmetics': '💄',
    'Gift Items': '🎁',
  };

  const fallbackEmoji = categoryEmojis[product.category] || '🛒';

  return (
    <div
      className={`group relative flex flex-col rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 hover:-translate-y-1 overflow-hidden ${
        isOutOfStock ? 'opacity-80' : ''
      }`}
    >
      {/* Badges Overlay */}
      <div className="absolute top-2 left-2 right-2 sm:top-3 sm:left-3 sm:right-3 z-10 flex items-center justify-between gap-1 pointer-events-none">
        {/* Category Badge */}
        <span className="px-1.5 sm:px-2.5 py-0.5 rounded-full text-[8px] sm:text-[10px] font-bold uppercase tracking-wider truncate max-w-[70%] bg-white/95 dark:bg-slate-900/95 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700/70 shadow-sm backdrop-blur-md">
          {product.category}
        </span>

        {/* Crisp Best Value / Bestseller Badge */}
        {product.isBestseller && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-slate-950 shadow-sm">
            <Sparkles className="w-3 h-3 fill-slate-950 text-slate-950" />
            <span>Best Value</span>
          </span>
        )}
      </div>

      {/* Product Image Container */}
      <div className="relative w-full pt-[100%] sm:pt-[75%] bg-slate-50 dark:bg-slate-800/40 overflow-hidden">
        {!imageError && product.image ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImageError(true)}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-4xl bg-gradient-to-tr from-emerald-50 to-amber-50 dark:from-slate-800 dark:to-slate-700">
            <span>{fallbackEmoji}</span>
          </div>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[2px] flex items-center justify-center p-3 text-center">
            <div className="bg-red-500 text-white text-[11px] font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 uppercase tracking-wider">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Out of Stock</span>
            </div>
          </div>
        )}
      </div>

      {/* Product Details (Clean Typography, NO PRICES) */}
      <div className="p-2.5 sm:p-5 flex flex-col flex-1 justify-between gap-2 sm:gap-3">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/50 dark:border-emerald-800/40">
              {product.unit || '1 pc'}
            </span>

            {currentCartQty > 0 ? (
              <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                In Cart: {currentCartQty}
              </span>
            ) : (
              <span className="hidden sm:inline text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase">
                Price at Store
              </span>
            )}
          </div>

          <h3 className="font-extrabold text-xs sm:text-base text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {product.name}
          </h3>

          <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {product.description || 'Fresh genuine retail stock available at Aastha General Store, Jaunpur.'}
          </p>
        </div>

        {/* Action Controls: Compact Quantity Selector & Touch-Friendly Add to Cart */}
        <div className="pt-2 sm:pt-2.5 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
          {!isOutOfStock ? (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 sm:gap-2">
              <QuantitySelector
                quantity={quantity}
                onChange={setQuantity}
                min={1}
                max={99}
                size="sm"
              />

              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 min-h-[34px] sm:min-h-[38px] inline-flex items-center justify-center gap-1 sm:gap-1.5 py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-extrabold transition-all duration-200 shadow-sm touch-manipulation ${
                  isAddedRecently
                    ? 'bg-emerald-700 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-md hover:shadow-emerald-600/20 active:scale-95'
                }`}
              >
                {isAddedRecently ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="text-center py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-400">
              Temporarily Unavailable
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
