# 🛒 Aastha General Store (आस्था जनरल स्टोर)
### *Production-Ready Full-Stack Web Application for Jaunpur, Uttar Pradesh*

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-10.14-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

A high-performance, mobile-first frontend web application crafted for **Aastha General Store**, located at Station Road, Near Line Bazar, Jaunpur, Uttar Pradesh, India. Built with clean Glassmorphism UI tokens, instant WhatsApp Checkout, secure authentication, and a Hidden Admin Inventory Management Panel with real-time sync.

---

## 🏛️ Critical Architectural & Security Features

### 1. 🌾 55+ Product Catalog Across 5 Real-World Categories
- **General Groceries**: Aashirvaad Chakki Atta, Fortune Sunflower Oil, India Gate Basmati Rice, Tata Sampann Toor Dal, Tata Salt, Madhur Sugar, Tata Tea Gold, Catch Turmeric & Red Chilli, Everest Masalas, Amul Ghee.
- **Snacks & Chocolates**: Cadbury Dairy Milk Silk, KitKat, 5 Star, Kurkure Masala Munch, Lay's Magic Masala, Uncle Chipps, Parle-G Gold, Good Day Cashew, Maggi Noodles, Haldiram’s Bhujia, Bourbon.
- **Daily Care**: Dettol Original, Dove Beauty Bar, Lifebuoy, Head & Shoulders, Clinic Plus, Colgate Strong Teeth, Closeup Everfresh, Surf Excel Quick Wash, Vim Lemon Gel, Whisper Choice Ultra, Harpic.
- **Cosmetics**: Lakmé Eyeconic Kajal, Maybelline Creamy Matte Lipstick, Himalaya Neem Face Wash, Pond’s Bright Beauty Cream, Elle 18 Nail Polish, Nivea Soft, Vaseline Healthy Bright, Biotique Serum.
- **Gift Items**: Royal Dry Fruit Hamper Boxes, Cadbury Deluxe Celebration Baskets, Brass Peacock Diyas, Ganesha Acrylic Idols, Luxury Scented Candles, Festive Greeting Cards.
- Dynamic quantity selector (+ / -, bounds 1 to 99), out-of-stock badges, and image fallback placeholders.

### 2. 📲 Instant WhatsApp Checkout
- Customers review their cart and click **"Proceed to WhatsApp Order"**.
- Address modal auto-pre-fills name, 10-digit mobile number, and delivery address in Jaunpur from the logged-in profile.
- Generates a formatted WhatsApp receipt and opens `https://wa.me/919807329612?text=...`:
### 3. 🛡️ Hidden Admin Dashboard & Live Inventory Controls
- Dedicated cryptic secret URL route (e.g., `/manager-portal-sec-x9k2`) protected against unauthorized access.
- **Admin Username**: Configured via secure environment variables.
- **Admin Password**: Configured securely via environment variables (never committed to public source code).
- **Product CRUD & Real-Time Sync**: Add, edit, delete products with live image uploads syncing instantly via backend real-time subscriptions to the customer storefront.
- **Orders Viewer**: Review customer name, contact phone, delivery location, and order items breakdown.

### 4. 👤 Authentication & Settings
- Local registration and login systems.
- **Client-Side Image Compressor**: Users can upload profile photos; canvas automatically optimizes images for performance.
- **Dark/Light Mode**: Synced with Tailwind's `dark` class, persisted in `localStorage`.
- Dynamic greeting in header: *"Namaste, {Name} 🙏"*.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)