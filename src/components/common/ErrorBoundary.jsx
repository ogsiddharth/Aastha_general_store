import React from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Caught runtime UI exception:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetApp = () => {
    try {
      localStorage.removeItem('aastha_cart');
      localStorage.removeItem('aastha_theme');
      window.location.href = '/';
    } catch {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans">
          <div className="max-w-md w-full glass-card p-8 rounded-3xl border border-red-500/20 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Something went wrong
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              An unexpected display glitch occurred in the application. Don't worry, your cart and store data are securely saved.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
              <button
                onClick={this.handleReload}
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>

              <button
                onClick={this.handleResetApp}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl glass-card hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-all"
              >
                <span>Reset to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
