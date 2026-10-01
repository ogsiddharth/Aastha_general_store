import React from 'react';
import { Minus, Plus } from 'lucide-react';

export default function QuantitySelector({
  quantity,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  size = 'md', // 'sm' | 'md' | 'lg'
}) {
  const handleDecrement = (e) => {
    e.stopPropagation();
    if (disabled || quantity <= min) return;
    onChange(quantity - 1);
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    if (disabled || quantity >= max) return;
    onChange(quantity + 1);
  };

  const handleInputChange = (e) => {
    e.stopPropagation();
    const val = parseInt(e.target.value, 10);
    if (isNaN(val)) return;
    const clamped = Math.min(max, Math.max(min, val));
    onChange(clamped);
  };

  const sizeClasses = {
    sm: {
      btn: 'w-6 h-6 text-xs',
      input: 'w-8 text-xs py-0.5',
      icon: 'w-3 h-3',
      wrap: 'p-0.5',
    },
    md: {
      btn: 'w-7 h-7 text-sm',
      input: 'w-10 text-xs sm:text-sm py-1',
      icon: 'w-3.5 h-3.5',
      wrap: 'p-1',
    },
    lg: {
      btn: 'w-9 h-9 text-base',
      input: 'w-12 text-sm sm:text-base py-1.5',
      icon: 'w-4 h-4',
      wrap: 'p-1.5',
    },
  }[size] || sizeClasses.md;

  return (
    <div
      className={`inline-flex items-center rounded-xl glass-card border border-slate-200/80 dark:border-slate-700/80 ${sizeClasses.wrap} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || quantity <= min}
        aria-label="Decrease quantity"
        className={`flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-600 active:scale-90 transition-all disabled:opacity-30 disabled:pointer-events-none ${sizeClasses.btn}`}
      >
        <Minus className={sizeClasses.icon} />
      </button>

      <input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        disabled={disabled}
        aria-label="Quantity"
        min={min}
        max={max}
        className={`text-center font-bold text-slate-800 dark:text-slate-100 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${sizeClasses.input}`}
      />

      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || quantity >= max}
        aria-label="Increase quantity"
        className={`flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-600 active:scale-90 transition-all disabled:opacity-30 disabled:pointer-events-none ${sizeClasses.btn}`}
      >
        <Plus className={sizeClasses.icon} />
      </button>
    </div>
  );
}
