import React from 'react';

export default function LoadingSpinner({ message = 'Loading Aastha Store...' }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="relative w-16 h-16 mb-4">
        {/* Outer glowing ring */}
        <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 border-t-emerald-600 animate-spin"></div>
        {/* Inner ring */}
        <div className="absolute inset-2 rounded-full border-4 border-amber-500/20 border-b-amber-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.2s' }}></div>
        {/* Store icon center */}
        <div className="absolute inset-0 flex items-center justify-center text-xl">
          🛒
        </div>
      </div>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300 tracking-wide animate-pulse">
        {message}
      </p>
    </div>
  );
}
