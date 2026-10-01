# 🛒 Aastha General Store (आस्था जनरल स्टोर)
### *Modern High-Performance E-Commerce Web Application for Jaunpur, Uttar Pradesh*

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

A high-performance, mobile-first web application crafted for **Aastha General Store**, located at Station Road, Near Line Bazar, Jaunpur, Uttar Pradesh, India. Built with a clean Glassmorphism UI, instant WhatsApp checkout, secure customer authentication, and a private admin panel for inventory and order management.

---

## 🌟 Key Highlights & Features

### 1. 🌾 55+ Product Catalog Across 5 Categories
- **General Groceries**: atta, oil, rice, dal, salt, sugar, tea, spices, ghee and more.
- **Snacks & Chocolates**: Dairy Milk, KitKat, 5 Star, Kurkure, Lay's, Uncle Chipps, Parle-G, Good Day, Maggi, Bhujia, Bourbon and more.
- **Daily Care**: soaps, shampoos, toothpaste, detergents, cleaners and hygiene products.
- **Cosmetics**: kajal, lipstick, face wash, creams, nail polish, skincare.
- **Gift Items**: dry fruit hampers, chocolate baskets, diyas, idols, candles, greeting cards.
- Prices formatted in Indian Rupees (`₹`) using `Intl.NumberFormat('en-IN')`.
- Quantity selector (+ / -, 1 to 99), out-of-stock badges, and image fallbacks.

### 2. 📲 Instant WhatsApp Checkout
- Customers review their cart and click **"Proceed to WhatsApp Order"**.
- The checkout form pre-fills name, 10-digit mobile number, and delivery address from the logged-in profile.
- An itemized order message (items, quantities, prices, grand total) opens in WhatsApp for the store number.
- Every order is also saved and visible in the admin Orders log.
- No online payment gateway is used.

### 3. 🛡️ Admin Panel
- A separate, private admin entry point, not linked anywhere on the customer website.
- Access is protected by authentication. Credentials are never stored in this repository.
- **Dashboard**: total products, out-of-stock count, bestsellers, orders, and revenue.
- **Product management**: add, edit, delete (with confirmation), stock toggle, bestseller toggle, image URL with live preview.
- **Orders**: view customer details, items, and update status (`Received` -> `Dispatched` -> `Delivered`).
- Changes sync to the live storefront without a page refresh.

### 4. 👤 Authentication & Settings
- Registration and login with username and password (no social login).
- Passwords are never stored in plain text.
- Profile photo upload with automatic client-side compression.
- Dark/Light mode, persisted and aware of system preference.
- Time-based greeting: *"Namaste, {Name} 🙏"*.

---

## 🏗️ Service Layer (`src/services/`)

All data access is isolated behind service modules, so the backend can be swapped without touching UI components:

```
src/
├── services/
│   ├── storageService.js
│   ├── productService.js
│   ├── orderService.js
│   └── authService.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18 or higher
- npm v9 or higher

### 1. Clone & Install
```bash
git clone https://github.com/ogsiddharth/Aastha_general_store.git
cd Aastha_general_store
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and fill in your own values. Never commit `.env`.

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## 🔄 Backend Migration (Firebase / Supabase)

Replace the implementations inside `src/services/` with your backend's SDK calls. UI components only talk to the context and service layer, so they need no changes. For a real shared database, enforce security with backend rules (Firestore rules or Supabase Row Level Security), never only in frontend code.

---

## 🔐 Security Notes
- Never commit passwords, API secrets, or `.env` files.
- Admin credentials are set by the store owner and are not documented in this repository.
- Frontend-only checks can be bypassed, so real protection must come from backend rules.

---

## 📍 Store Information
- **Store Name**: Aastha General Store (आस्था जनरल स्टोर)
- **Location**: Station Road, Near Line Bazar, Jaunpur, Uttar Pradesh - 222002, India
- **Phone / WhatsApp**: +91 98073 29612
- **Timings**: Open Daily 7:00 AM – 10:00 PM
