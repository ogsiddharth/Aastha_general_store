import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  Clock,
  Award,
  MessageCircle,
  MapPin,
  ChevronRight,
  Store,
  Search,
  CheckCircle,
  Phone,
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { getTimeBasedGreeting } from '../utils/formatters';
import ProductCard from '../components/product/ProductCard';

export default function HomePage() {
  const { products, bestsellers, categories } = useProducts();
  const { user } = useAuth();

  const [homeCategory, setHomeCategory] = useState('All Items');
  const [homeSearch, setHomeSearch] = useState('');

  // Category visual metadata
  const categoryCards = [
    {
      name: 'General Groceries',
      desc: 'Atta, rice, dal, pure oil, tea & spices',
      icon: '🌾',
      count: products.filter((p) => p.category === 'General Groceries').length,
      bg: 'from-amber-500/10 to-emerald-500/10',
    },
    {
      name: 'Snacks & Chocolates',
      desc: 'Dairy Milk, KitKat, Uncle Chips, Kurkure & Biscuits',
      icon: '🍫',
      count: products.filter((p) => p.category === 'Snacks & Chocolates').length,
      bg: 'from-pink-500/10 to-orange-500/10',
    },
    {
      name: 'Daily Care',
      desc: 'Soaps, shampoos, Colgate & detergents',
      icon: '🧼',
      count: products.filter((p) => p.category === 'Daily Care').length,
      bg: 'from-blue-500/10 to-cyan-500/10',
    },
    {
      name: 'Cosmetics',
      desc: 'Kajal, face washes, creams & beauty care',
      icon: '💄',
      count: products.filter((p) => p.category === 'Cosmetics').length,
      bg: 'from-rose-500/10 to-purple-500/10',
    },
    {
      name: 'Gift Items',
      desc: 'Dry fruit hampers, festive gifts & packs',
      icon: '🎁',
      count: products.filter((p) => p.category === 'Gift Items').length,
      bg: 'from-yellow-500/10 to-amber-500/10',
    },
  ];

  // Filtered products for home interactive catalog
  const displayedProducts = useMemo(() => {
    return products.filter((prod) => {
      if (homeCategory !== 'All Items' && prod.category !== homeCategory) {
        return false;
      }
      if (homeSearch.trim()) {
        const q = homeSearch.toLowerCase().trim();
        const matchesName = prod.name.toLowerCase().includes(q);
        const matchesCat = prod.category.toLowerCase().includes(q);
        const matchesDesc = prod.description?.toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesDesc) return false;
      }
      return true;
    });
  }, [products, homeCategory, homeSearch]);

  return (
    <div className="space-y-12 animate-fade-in pb-12">
      {/* Hero Banner with Glassmorphism */}
      <section className="relative overflow-hidden rounded-3xl glass-card p-6 sm:p-10 md:p-12 text-center md:text-left bg-gradient-to-r from-emerald-600/15 via-emerald-500/5 to-amber-500/15 border border-white/60 dark:border-white/10 shadow-glass">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300/50 dark:border-emerald-700/50 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Serving Jaunpur, Uttar Pradesh • Contact: +91 98073 29612</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            {user ? (
              <>
                {getTimeBasedGreeting(user.name.split(' ')[0])}
                <span className="block mt-1 text-2xl sm:text-4xl text-emerald-700 dark:text-emerald-400">
                  Welcome to Aastha General Store
                </span>
              </>
            ) : (
              <>
                Namaste! Welcome to{' '}
                <span className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                  Aastha General Store
                </span>
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Your trusted neighborhood retail mart in Jaunpur for fresh groceries, snacks & chocolates (Dairy Milk, KitKat, Uncle Chips, Kurkure, Biscuits), daily care, cosmetics, and festival gift hampers. Order seamlessly via WhatsApp!
          </p>

          {/* Quick Search Bar in Hero */}
          <div className="pt-2 max-w-xl">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={homeSearch}
                onChange={(e) => setHomeSearch(e.target.value)}
                placeholder="Search Dairy Milk, Uncle Chips, Atta, Mustard Oil, Kajal..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
              />
              {homeSearch && (
                <button
                  onClick={() => setHomeSearch('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Browse All {products.length}+ Items</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </Link>

            <a
              href="https://wa.me/919807329612?text=Namaste!%20I%20am%20ordering%20from%20Aastha%20General%20Store%2C%20Jaunpur."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl glass-card hover:bg-white/90 dark:hover:bg-slate-800/90 text-slate-800 dark:text-slate-100 font-bold text-sm transition-all"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>WhatsApp Store (+91 98073 29612)</span>
            </a>
          </div>
        </div>

        {/* Decorative Floating Badges */}
        <div className="hidden lg:flex absolute right-10 top-1/2 -translate-y-1/2 flex-col gap-3">
          <div className="glass-card p-4 rounded-2xl flex items-center gap-3 shadow-glass hover:scale-105 transition-transform border border-white/60 dark:border-white/10">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Fast Local Delivery</p>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Across Jaunpur City</p>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl flex items-center gap-3 shadow-glass hover:scale-105 transition-transform border border-white/60 dark:border-white/10">
            <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">100% Genuine Brands</p>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Sealed & Fresh Stock</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter Pills (Phase 2 Requirement) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Shop by Category
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Quickly filter products or click to explore the full collection
            </p>
          </div>
          <Link
            to="/shop"
            className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => {
            const isActive = homeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setHomeCategory(cat)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-emerald-600/30 scale-105'
                    : 'glass-card text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Category Cards Showcase */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {categoryCards.map((cat) => (
            <div
              key={cat.name}
              onClick={() => setHomeCategory(cat.name)}
              className={`cursor-pointer group glass-card p-5 rounded-3xl border border-white/60 dark:border-white/10 hover:border-emerald-500/50 hover:shadow-glass-hover transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br ${cat.bg} ${
                homeCategory === cat.name ? 'ring-2 ring-emerald-500' : ''
              }`}
            >
              <div className="text-3xl sm:text-4xl mb-3 group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {cat.desc}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <span>{cat.count} Items</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Live Product Grid with Category Filter / Search */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Store className="w-4 h-4" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {homeCategory === 'All Items' ? 'Popular Store Essentials' : homeCategory}
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Showing {displayedProducts.length} items • Click +/- to set quantity and order
            </p>
          </div>

          <Link
            to={`/shop?category=${encodeURIComponent(homeCategory)}`}
            className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Open Full Shop</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {displayedProducts.length === 0 ? (
          <div className="p-12 text-center rounded-3xl glass-card border border-white/60 dark:border-white/10 space-y-3">
            <p className="text-base font-bold text-slate-700 dark:text-slate-300">
              No products found matching "{homeSearch}".
            </p>
            <button
              onClick={() => {
                setHomeSearch('');
                setHomeCategory('All Items');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {displayedProducts.slice(0, 16).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Truck, title: 'Speedy Local Delivery', desc: 'Direct to your door in Jaunpur' },
          { icon: ShieldCheck, title: 'Verified Fresh Stock', desc: 'Sealed branded grocery items' },
          { icon: MessageCircle, title: 'Instant WhatsApp Order', desc: 'Itemized bill sent to +91 98073 29612' },
          { icon: Award, title: 'Honest Retail Pricing', desc: 'Best rates for families' },
        ].map((feature, i) => {
          const Icon = feature.icon;
          return (
            <div
              key={i}
              className="glass-card p-5 rounded-2xl flex flex-col items-center text-center space-y-2 hover:border-emerald-500/40 transition-colors shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">{feature.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{feature.desc}</p>
            </div>
          );
        })}
      </section>

      {/* Store Location & Community Trust Callout */}
      <section className="glass-card p-6 sm:p-8 rounded-3xl border border-white/60 dark:border-white/10 bg-gradient-to-r from-emerald-50/50 to-amber-50/50 dark:from-slate-900/60 dark:to-emerald-950/20 shadow-glass">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              <Store className="w-4 h-4" />
              <span>Local Jaunpur Retailer</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Need bulk groceries or custom festive hampers?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl">
              Visit our store near Line Bazar / Olandganj, Jaunpur or call direct at +91 98073 29612. We prepare customized gift hampers, dry-fruit gift boxes, and monthly family ration packs.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <a
              href="tel:+919807329612"
              className="px-5 py-3 rounded-2xl glass-card hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm shadow-sm transition-all"
            >
              📞 Call: +91 98073 29612
            </a>
            <Link
              to="/shop"
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.02]"
            >
              Start Ordering Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
