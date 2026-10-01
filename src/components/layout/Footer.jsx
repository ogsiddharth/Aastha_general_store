import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, MessageCircle, ShieldCheck, Heart, Clock, ExternalLink } from 'lucide-react';
import { STORE_MAPS_URL } from '../../utils/formatters';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md pb-20 md:pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Store Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🛒</span>
              <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">
                Aastha General Store
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Your one-stop neighbourhood retail store for fresh groceries, snacks, cosmetics, daily care products, and gift hampers. Serving Jaunpur with trust and care.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>Open Daily: 7:00 AM – 10:00 PM</span>
            </div>
          </div>

          {/* Quick Contact & WhatsApp */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 tracking-wider uppercase">
              Contact & Location
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="block leading-relaxed">Station Road, Near Line Bazar, Jaunpur, Uttar Pradesh - 222002</span>
                  <a
                    href={STORE_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-bold mt-1"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <a href="tel:+919807329612" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  +91 98073 29612
                </a>
              </li>
              <li className="pt-1">
                <a
                  href="https://wa.me/919807329612?text=Namaste!%20I%20have%20an%20inquiry%20regarding%20Aastha%20General%20Store."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-600/20 font-medium transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Categories Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 tracking-wider uppercase">
              Shop Categories
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li><Link to="/shop?category=General%20Groceries" className="hover:text-emerald-600 dark:hover:text-emerald-400">General Groceries</Link></li>
              <li><Link to="/shop?category=Snacks%20%26%20Chocolates" className="hover:text-emerald-600 dark:hover:text-emerald-400">Snacks & Chocolates</Link></li>
              <li><Link to="/shop?category=Daily%20Care" className="hover:text-emerald-600 dark:hover:text-emerald-400">Daily Care & Hygiene</Link></li>
              <li><Link to="/shop?category=Cosmetics" className="hover:text-emerald-600 dark:hover:text-emerald-400">Cosmetics & Beauty</Link></li>
              <li><Link to="/shop?category=Gift%20Items" className="hover:text-emerald-600 dark:hover:text-emerald-400">Gift Hampers & Boxes</Link></li>
            </ul>
          </div>

          {/* Customer Helpful Links (NO ADMIN LINKS) */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 tracking-wider uppercase">
              Customer Care
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li><Link to="/cart" className="hover:text-emerald-600 dark:hover:text-emerald-400">View Cart & WhatsApp Order</Link></li>
              <li><Link to="/login" className="hover:text-emerald-600 dark:hover:text-emerald-400">Customer Account</Link></li>
              <li><Link to="/settings" className="hover:text-emerald-600 dark:hover:text-emerald-400">Saved Addresses & Orders</Link></li>
              <li className="pt-2 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Local Jaunpur Retailer</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-3">
          <p>© {currentYear} Aastha General Store, Jaunpur UP. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for the community of Jaunpur.
          </p>
        </div>
      </div>
    </footer>
  );
}
