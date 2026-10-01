import React, { useState } from 'react';
import { ShoppingBag, Star, Check, AlertCircle, Sparkles, Plus, Minus } from 'lucide-react';
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
      className={`group relative flex flex-col rounded-3xl glass-card border border-white/60 dark:border-white/10 transition-all duration-300 hover:shadow-glass-hover hover:-translate-y-1 overflow-hidden ${
        isOutOfStock ? 'opacity-75' : ''
      }`}
    >
      {/* Badges Overlay */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-1 pointer-events-none">
        {/* Category Tag */}
        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold glass-card bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 shadow-sm">
          {product.category}
        </span>

        {/* Bestseller Badge */}
        {product.isBestseller && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm">
            <Sparkles className="w-3 h-3 fill-white" />
            <span>Bestseller</span>
          </span>
        )}
      </div>

      {/* Product Image Box */}
      <div className="relative w-full pt-[75%] bg-slate-100 dark:bg-slate-800/60 overflow-hidden">
        {!imageError && product.image ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImageError(true)}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-4xl bg-gradient-to-tr from-emerald-100/50 to-amber-100/50 dark:from-slate-800 dark:to-slate-700">
            <span>{fallbackEmoji}</span>
          </div>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center p-3 text-center">
            <div className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 uppercase tracking-wide">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Out of Stock</span>
            </div>
          </div>
        )}
      </div>

      {/* Product Details (NO PRICES SHOWN) */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
              {product.unit || '1 pc'}
            </span>
            {currentCartQty > 0 && (
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                In Cart: {currentCartQty}
              </span>
            )}
          </div>

          <h3 className="font-extrabold text-base text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {product.description || 'Fresh genuine stock at Aastha General Store, Jaunpur.'}
          </p>
        </div>

        {/* Action Row: Interactive Quantity Selector + Add Button (NO PRICES) */}
        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 space-y-2">
          {!isOutOfStock ? (
            <div className="flex items-center gap-2">
              <QuantitySelector
                quantity={quantity}
                onChange={setQuantity}
                min={1}
                max={99}
              />

              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm ${
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
            <div className="text-center py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs font-bold text-slate-400">
              Temporarily Unavailable
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
