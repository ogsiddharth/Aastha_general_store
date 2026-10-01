/**
 * Formatters and Helper Utilities for Aastha General Store
 * Location: Jaunpur, Uttar Pradesh
 * Phone: +91 98073 29612
 */

export const STORE_PHONE = import.meta.env.VITE_STORE_PHONE || '919807329612';
export const STORE_NAME = import.meta.env.VITE_STORE_NAME || 'Aastha General Store';
export const STORE_LOCATION = import.meta.env.VITE_STORE_LOCATION || 'Station Road, Harlalka Rd, Shakar Mandi, Jaunpur, Bagmia, Uttar Pradesh - 222001';
export const STORE_PINCODE = '222001';
export const STORE_MAPS_URL = import.meta.env.VITE_STORE_MAPS_URL || 'https://share.google/OvRmvPo3AvTF542RG';
export const STORE_MAPS_EMBED_URL = 'https://maps.google.com/maps?q=Station+Road,+Harlalka+Rd,+Shakar+Mandi,+Jaunpur,+Bagmia,+Uttar+Pradesh+222001&t=&z=16&ie=UTF8&iwloc=&output=embed';

/**
 * Format numeric value to Indian Rupee (₹) - Helper for Admin use
 * @param {number} amount 
 * @returns {string} e.g. "₹120"
 */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Get dynamic, time-based Indian greeting
 * @param {string} [name] 
 * @returns {string} e.g. "Namaste, Ramesh! 🙏 Good morning"
 */
export function getTimeBasedGreeting(name = '') {
  const hour = new Date().getHours();
  let timeGreeting = 'Good day';
  if (hour >= 4 && hour < 12) {
    timeGreeting = 'Good morning';
  } else if (hour >= 12 && hour < 17) {
    timeGreeting = 'Good afternoon';
  } else {
    timeGreeting = 'Good evening';
  }

  const displayName = name ? ` ${name}` : '';
  return `Namaste${displayName}! 🙏 ${timeGreeting}`;
}

/**
 * Format ISO date string to readable Indian date & time
 * @param {string|Date} dateInput 
 * @returns {string} e.g. "30 Sep 2026, 05:45 PM"
 */
export function formatDateTime(dateInput) {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

/**
 * Build structured WhatsApp Order Message string with items and quantities (NO PRICES SHOWN)
 * As per store policy: Prices are confirmed directly at the physical store / upon delivery.
 * @param {Object} order
 * @param {string} [order.orderId]
 * @param {string} order.customerName
 * @param {string} order.phone
 * @param {string} order.address
 * @param {string} [order.note]
 * @param {Array} order.items - [{ product: { name, unit }, quantity }] or [{ name, unit, quantity }]
 * @returns {string}
 */
export function buildWhatsAppOrderMessage({ orderId, customerName, phone, address, note, items = [] }) {
  const divider = '════════════════════════';
  const displayId = orderId || `AST-${Date.now().toString().slice(-4)}`;

  const itemLines = items.map((item, index) => {
    const prod = item.product || item;
    const unitText = prod.unit ? ` (${prod.unit})` : '';
    return `*${index + 1}.* ${prod.name}${unitText}\n   └ *Quantity:* ${item.quantity}`;
  }).join('\n\n');

  let message = `🛒 *NEW ORDER - AASTHA GENERAL STORE*\n` +
    `📍 _Station Road, Harlalka Rd, Shakar Mandi, Jaunpur, Bagmia, UP - 222001_\n` +
    `🗺️ *Store Map:* ${STORE_MAPS_URL}\n` +
    `${divider}\n` +
    `🆔 *Order ID:* \`${displayId}\`\n` +
    `👤 *Customer:* ${customerName}\n` +
    `📞 *Phone:* ${phone}\n` +
    `🏠 *Delivery Address:* ${address}\n` +
    `${divider}\n` +
    `📦 *ORDER ITEMS LIST (${items.reduce((s, i) => s + (i.quantity || 1), 0)} items):*\n\n` +
    `${itemLines}\n\n` +
    `${divider}\n` +
    `🚚 *Delivery:* FREE Local Delivery across Jaunpur City\n` +
    `🏷️ *Store Pricing:* Confirmed directly at retail store pickup / delivery`;

  if (note && note.trim()) {
    message += `\n📝 *Customer Note:* ${note.trim()}`;
  }

  message += `\n\n🙏 *Thank you for ordering with Aastha General Store!*\n_Jaunpur Store Helpline: +91 98073 29612_`;

  return message;
}

/**
 * Generate full WhatsApp web / app redirect link
 * @param {string} messageText 
 * @param {string} [targetPhone]
 * @returns {string}
 */
export function getWhatsAppUrl(messageText, targetPhone = STORE_PHONE) {
  const encodedText = encodeURIComponent(messageText);
  return `https://wa.me/${targetPhone}?text=${encodedText}`;
}
