import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, Filter, ArrowUpDown, Sparkles, Check, PackageOpen } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useDebounce } from '../hooks/useDebounce';
import ProductCard from '../components/product/ProductCard';

export default function ShopPage() {
  const { products, categories } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search input and debounce
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Selected Category
  const activeCategory = searchParams.get('category') || 'All Items';

  // Sort Option
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'default');

  // In Stock Only Toggle
  const [onlyInStock, setOnlyInStock] = useState(false);

  // Sync category changes to URL
  const handleCategorySelect = (category) => {
    const nextParams = new URLSearchParams(searchParams);
    if (category === 'All Items') {
      nextParams.delete('category');
    } else {
      nextParams.set('category', category);
    }
    setSearchParams(nextParams);
  };

  // Sync sort changes to URL
  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    const nextParams = new URLSearchParams(searchParams);
    if (newSort === 'default') {
      nextParams.delete('sort');
    } else {
      nextParams.set('sort', newSort);
    }
    setSearchParams(nextParams);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setOnlyInStock(false);
    setSortBy('default');
    setSearchParams({});
  };

  // Filtered & Sorted Products calculation (NO PRICE SORTING)
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        if (activeCategory !== 'All Items' && product.category !== activeCategory) {
          return false;
        }

        // In Stock filter
        if (onlyInStock && !product.inStock) {
          return false;
        }

        // Debounced text search (matches name, description, category, unit)
        if (debouncedSearch.trim()) {
          const query = debouncedSearch.toLowerCase().trim();
          const matchName = product.name?.toLowerCase().includes(query);
          const matchDesc = product.description?.toLowerCase().includes(query);
          const matchCat = product.category?.toLowerCase().includes(query);
          const matchUnit = product.unit?.toLowerCase().includes(query);
          if (!matchName && !matchDesc && !matchCat && !matchUnit) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') {
          return (a.name || '').localeCompare(b.name || '');
        }
        if (sortBy === 'name-desc') {
          return (b.name || '').localeCompare(a.name || '');
        }
        if (sortBy === 'bestseller') {
          return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
        }
        return 0;
      });
  }, [products, activeCategory, onlyInStock, debouncedSearch, sortBy]);

  const hasActiveFilters = Boolean(
    debouncedSearch.trim() || activeCategory !== 'All Items' || onlyInStock || sortBy !== 'default'
  );

  return (
    <div className="space-y-8 animate-fade-in pb-24 md:pb-12">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          Aastha Store Catalog
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Showing {filteredProducts.length} items of {products.length} total products • Station Road, Near Line Bazar, Jaunpur (222002)
        </p>
      </div>

      {/* Filter and Search Control Panel */}
      <div className="glass-card p-4 sm:p-6 rounded-3xl space-y-4 shadow-glass border border-white/60 dark:border-white/10">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Input with Debounce & Clear */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dairy milk, uncle chips, atta, oil, maggi, shampoo, kajal, hampers..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown (No Price Sorting) */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 pl-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sort:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="default" className="dark:bg-slate-800">Featured</option>
              <option value="bestseller" className="dark:bg-slate-800">Bestsellers First</option>
              <option value="name-asc" className="dark:bg-slate-800">Name: A to Z</option>
              <option value="name-desc" className="dark:bg-slate-800">Name: Z to A</option>
            </select>
          </div>

          {/* In-Stock Toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none px-3 py-2 rounded-xl glass-card text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={(e) => setOnlyInStock(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
            />
            <span>In-Stock Only</span>
          </label>
        </div>

        {/* Category Filter Chips */}
        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                      : 'glass-card text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 font-bold px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center rounded-3xl glass-card border border-white/60 dark:border-white/10 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <PackageOpen className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            No products match your criteria
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query, checking spelling, or selecting another category pill.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
