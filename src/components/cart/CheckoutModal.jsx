import React, { useState, useEffect } from 'react';
import { X, MessageCircle, MapPin, User, Phone, FileText, CheckCircle, ShieldCheck, Loader2, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { orderService } from '../../services/orderService';
import { buildWhatsAppOrderMessage, getWhatsAppUrl, STORE_PHONE } from '../../utils/formatters';

export default function CheckoutModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const { items, itemCount, clearCart } = useCart();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    note: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill fields whenever modal opens or user profile changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: user?.name || '',
        phone: user?.phone || '',
        address: user?.address || '',
        note: '',
      });
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Please provide your full name.';
    }

    // 10-digit Indian phone number validation
    const cleanPhone = formData.phone.trim().replace(/\D/g, '');
    const indianPhoneRegex = /^[6-9]\d{9}$/;
    if (!cleanPhone) {
      errs.phone = 'Phone number is required for WhatsApp delivery coordination.';
    } else if (!indianPhoneRegex.test(cleanPhone)) {
      errs.phone = 'Please enter a valid 10-digit Indian mobile number (e.g. 9807329612).';
    }

    if (!formData.address.trim()) {
      errs.address = 'Delivery address is required for store delivery.';
    } else if (formData.address.trim().length < 6) {
      errs.address = 'Please specify landmark/colony in Jaunpur (min 6 chars).';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const cleanPhone = formData.phone.trim().replace(/\D/g, '');

      // 1. Prepare order payload without prices
      const orderPayload = {
        customerName: formData.name.trim(),
        phone: cleanPhone,
        address: formData.address.trim(),
        note: formData.note.trim(),
        items: items.map((i) => ({
          id: i.product.id,
          name: i.product.name,
          unit: i.product.unit || '1 pc',
          quantity: i.quantity,
          image: i.product.image || '',
        })),
        itemCount,
        userId: user?.id || user?.uid || null,
        userEmail: user?.email || null,
      };

      // 2. Persist order into Firestore 'orders' collection first!
      const savedOrder = await orderService.saveOrder(orderPayload);
      const assignedOrderId = savedOrder?.orderId || savedOrder?.id || `AST-${Date.now().toString().slice(-4)}`;

      // 3. Build itemized WhatsApp message with Order ID and items/quantities (NO PRICES)
      const whatsappText = buildWhatsAppOrderMessage({
        orderId: assignedOrderId,
        customerName: formData.name.trim(),
        phone: cleanPhone,
        address: formData.address.trim(),
        note: formData.note.trim(),
        items,
      });

      const whatsappUrl = getWhatsAppUrl(whatsappText);

      // 4. Open WhatsApp to store owner (+91 98073 29612)
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      // 5. Success feedback and cart clear
      showToast(`Order #${assignedOrderId} placed! Opening WhatsApp...`, 'success', 5000);
      clearCart();
      onClose();
    } catch (err) {
      console.error('[CheckoutModal] Checkout error:', err);
      showToast('Failed to record order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl glass-card border border-white/60 dark:border-white/10 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                Place Your WhatsApp Order
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Aastha General Store • Jaunpur (+91 98073 29612)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Summary Pill (NO PRICES) */}
        <div className="my-5 p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/50 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              Selected Order Items
            </span>
            <div className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} ({items.length} unique)
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white">
              <ShieldCheck className="w-3.5 h-3.5" />
              Free Delivery
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Jaunpur city locations
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-600" />
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Ramesh Kumar"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1 font-medium">{errors.name}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              WhatsApp Mobile Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                +91
              </span>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="9807329612"
                maxLength={10}
                className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
              />
            </div>
            {errors.phone && <p className="text-xs text-red-500 mt-1 font-medium">{errors.phone}</p>}
          </div>

          {/* Delivery Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              Delivery Address in Jaunpur <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="House/Shop No., Street, Colony or Landmark (e.g. Near Shahi Bridge, Line Bazar, Olandganj)"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm resize-none"
            />
            {errors.address && <p className="text-xs text-red-500 mt-1 font-medium">{errors.address}</p>}
          </div>

          {/* Optional Note */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              Special Delivery Instructions (Optional)
            </label>
            <input
              type="text"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="e.g. Deliver after 5 PM or call before arriving"
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          {/* Pricing Info Notice */}
          <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/50 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              Your order with <strong>{itemCount} items</strong> will be recorded in our database and forwarded to WhatsApp at <strong>+91 98073 29612</strong>. Best retail prices and delivery slot will be confirmed on WhatsApp.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Recording Order...</span>
                </>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Order via WhatsApp</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
