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
  ExternalLink,
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { getTimeBasedGreeting, STORE_MAPS_URL, STORE_LOCATION, STORE_PINCODE, STORE_PHONE } from '../utils/formatters';
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
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
            <span className="truncate">Station Road, Harlalka Rd, Shakar Mandi (222001) • +91 98073 29612</span>
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
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-emerald-600 border-slate-900 dark:border-emerald-600 shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
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

      {/* Physical Store Location & Interactive Google Maps Section */}
      <section id="store-location" className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700/60 mb-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>PHYSICAL STORE LOCATION & VISITING HOURS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Visit Aastha General Store in Jaunpur
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Visit our physical store at Shakar Mandi, Station Road for fresh groceries, personal care, cosmetics, and festival gift hampers.
            </p>
          </div>

          <a
            href={STORE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/25 transition-all self-start sm:self-auto shrink-0 touch-manipulation"
          >
            <span>Get Driving Directions</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Store Details Card */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              {/* Exact Address */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    Store Address
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mt-1 leading-relaxed">
                    Station Road, Harlalka Rd, Shakar Mandi, Jaunpur, Bagmia, Uttar Pradesh - 222001
                  </p>
                  <span className="inline-block mt-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                    PIN: 222001 • Landmark: Shakar Mandi / Harlalka Rd
                  </span>
                </div>
              </div>

              {/* Visiting Hours */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    Store Timings
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mt-1">
                    Open Daily: 7:00 AM – 10:00 PM
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Monday to Sunday • 365 Days Open
                  </p>
                </div>
              </div>

              {/* Phone & WhatsApp Contact */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    Helpline & WhatsApp Inquiries
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mt-1">
                    +91 98073 29612
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Fast phone ordering and delivery confirmation
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
              <a
                href={STORE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs sm:text-sm shadow-sm hover:opacity-90 transition-all touch-manipulation"
              >
                <MapPin className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
                <span>Open in Google Maps App</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>

              <a
                href="https://wa.me/919807329612?text=Namaste!%20I%20have%20an%20inquiry%20regarding%20Aastha%20General%20Store%2C%20Jaunpur."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-sm transition-all touch-manipulation"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp (+91 98073 29612)</span>
              </a>
            </div>
          </div>

          {/* Interactive Embedded Google Maps Iframe */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-sm relative min-h-[360px] sm:min-h-[420px] bg-slate-100 dark:bg-slate-800">
            <iframe
              title="Aastha General Store Google Maps Location - Station Road, Harlalka Rd, Shakar Mandi, Jaunpur, Bagmia"
              src="https://maps.google.com/maps?q=Station+Road,+Harlalka+Rd,+Shakar+Mandi,+Jaunpur,+Bagmia,+Uttar+Pradesh+222001&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full min-h-[360px] sm:min-h-[420px] border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-slate-200/80 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 pointer-events-none">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Shakar Mandi, Station Road, Jaunpur (222001)</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
