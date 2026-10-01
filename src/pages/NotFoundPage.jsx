import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[55vh] flex flex-col items-center justify-center text-center p-6 space-y-4 animate-fade-in">
      <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-4xl shadow-glass">
        🛒
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
        404
      </h1>
      <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100">
        Page Not Found
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
        The aisle or item you are looking for in Aastha General Store does not exist or has been moved.
      </p>
      <div className="pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-all shadow-md shadow-emerald-600/30"
        >
          <Home className="w-4 h-4" />
          <span>Back to Store Home</span>
        </Link>
      </div>
    </div>
  );
}
