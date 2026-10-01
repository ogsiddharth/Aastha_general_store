import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Image as ImageIcon,
  Save,
  Sparkles,
  Check,
  Package,
  AlertCircle,
  UploadCloud,
  Loader2,
  Trash2,
} from 'lucide-react';
import { CATEGORIES } from '../../data/productsData';
import { firebaseStorageService } from '../../services/firebaseStorageService';

export default function ProductForm({ isOpen, onClose, initialData = null, onSubmit }) {
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'General Groceries',
    image: '',
    unit: '1 pc',
    isBestseller: false,
    inStock: true,
    description: '',
  });

  const [errors, setErrors] = useState({});
  const [imagePreviewError, setImagePreviewError] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        price: initialData.price !== undefined && initialData.price !== null ? initialData.price : '',
        category: initialData.category || 'General Groceries',
        image: initialData.image || '',
        unit: initialData.unit || '1 pc',
        isBestseller: Boolean(initialData.isBestseller),
        inStock: initialData.inStock !== undefined ? Boolean(initialData.inStock) : true,
        description: initialData.description || '',
      });
      setImagePreviewError(false);
    } else {
      setFormData({
        name: '',
        price: '',
        category: 'General Groceries',
        image: '',
        unit: '1 pc',
        isBestseller: false,
        inStock: true,
        description: '',
      });
      setImagePreviewError(false);
    }
    setErrors({});
    setIsUploadingImage(false);
    setUploadProgress(0);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Handle live file upload to Firebase Storage
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setUploadProgress(10);
    try {
      const downloadURL = await firebaseStorageService.uploadProductImage(file, (percent) => {
        setUploadProgress(percent);
      });

      setFormData((prev) => ({ ...prev, image: downloadURL }));
      setImagePreviewError(false);
    } catch (err) {
      console.error('[ProductForm] Image upload failed:', err);
      setErrors((prev) => ({ ...prev, image: err.message || 'Image upload failed.' }));
    } finally {
      setIsUploadingImage(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Product name is required.';
    }
    if (!formData.unit.trim()) {
      errs.unit = 'Unit/weight is required (e.g. 1 kg, 500 g, 1 pc).';
    }
    // Price is completely optional as prices are confirmed at physical store!
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      price: formData.price ? Number(formData.price) : 0,
      name: formData.name.trim(),
      unit: formData.unit.trim(),
      description: formData.description.trim(),
    });
    onClose();
  };

  const formCategories = CATEGORIES.filter((c) => c !== 'All Items');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl rounded-3xl glass-card border border-white/60 dark:border-white/10 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                {initialData ? 'Edit Product' : 'Add New Product'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Aastha General Store Inventory Catalog
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Cadbury Dairy Milk Silk Chocolate"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1 font-medium">{errors.name}</p>}
          </div>

          {/* Unit & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Unit / Size <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="e.g. 1 kg, 150 g, 1 pc"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
              />
              {errors.unit && <p className="text-xs text-red-500 mt-1 font-medium">{errors.unit}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium cursor-pointer"
              >
                {formCategories.map((c) => (
                  <option key={c} value={c} className="dark:bg-slate-800">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price (Optional - for store internal reference only) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Internal Retail Price in ₹ <span className="text-slate-400 font-normal">(Optional - hidden from customer storefront)</span>
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="e.g. 175 (Optional)"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
            />
          </div>

          {/* Product Image Upload with Firebase Storage & URL Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                Product Image (Upload to Firebase Storage or URL)
              </span>
              {formData.image && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, image: '' })}
                  className="text-red-500 hover:text-red-600 text-[11px] font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Remove
                </button>
              )}
            </label>

            {/* Upload Zone */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingImage}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-xs font-bold transition-all disabled:opacity-50"
              >
                {isUploadingImage ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                    <span>Uploading ({uploadProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload Image File</span>
                  </>
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="w-full sm:flex-1">
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => {
                    setFormData({ ...formData, image: e.target.value });
                    setImagePreviewError(false);
                  }}
                  placeholder="Or paste image URL (e.g. Unsplash, Firebase URL)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-mono"
                />
              </div>
            </div>

            {/* Progress Bar */}
            {isUploadingImage && (
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-600 h-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}

            {/* Live Image Preview */}
            {formData.image && (
              <div className="mt-2 relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                {!imagePreviewError ? (
                  <img
                    src={formData.image}
                    alt="Preview"
                    onError={() => setImagePreviewError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-1 text-center bg-red-50 text-red-500 text-[10px]">
                    <AlertCircle className="w-4 h-4 mb-0.5" />
                    <span>Invalid image URL</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Description / Notes
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Pure whole wheat flour, sealed fresh stock."
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs resize-none"
            />
          </div>

          {/* Toggles: In-Stock & Bestseller */}
          <div className="pt-2 flex flex-wrap gap-4 border-t border-slate-200/60 dark:border-slate-800/60">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Available in Stock
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.isBestseller}
                onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 accent-amber-500 cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                Featured Bestseller
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200/60 dark:border-slate-800/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploadingImage}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{initialData ? 'Update Product' : 'Add to Inventory'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
