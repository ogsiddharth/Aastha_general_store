# 🛒 Aastha General Store (आस्था जनरल स्टोर)
### *Production-Ready Full-Stack Web Application for Jaunpur, Uttar Pradesh*

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-10.14-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

A high-performance, mobile-first e-commerce web application crafted for **Aastha General Store**, located at Station Road, Near Line Bazar, Jaunpur, Uttar Pradesh, India. Built with Tailwind CSS Glassmorphism UI tokens, instant WhatsApp Checkout, Firebase (Authentication, Cloud Firestore, Firebase Storage), and a strictly isolated, secret Admin Terminal.

---

## 🏛️ Critical Architectural & Security Features

### 1. 🛡️ Two Completely Isolated Multi-Page Entry Points
The application uses Vite Multi-Page Architecture (MPA) to physically separate general customer traffic from administrative operations:
- **Customer Storefront (`/` / `index.html`)**: General public access. **Zero** admin links, buttons, or admin bundle chunks exist anywhere in the customer experience.
- **Obfuscated Secret Admin Terminal (`/manager-portal-sec-x9k2` / `manager-portal-sec-x9k2.html`)**: A hidden administrative route. Anyone attempting to visit `/admin`, `/admin/`, or `/admin.html` receives a standard **404 Page Not Found** with no indication that an admin portal exists.

### 2. 🏷️ Store Pricing Policy (No Prices Displayed)
In adherence to the physical store's operational model, customer product cards, category filters, cart drawer, cart page, and WhatsApp order messages **do not display retail prices**. Daily fluctuating retail rates and discounts are confirmed at store pickup or upon WhatsApp order confirmation.

### 3. 📲 Direct WhatsApp Ordering (+91 98073 29612)
- Orders are validated and saved into Cloud Firestore `orders` collection first.
- Automatically launches WhatsApp directed to **+91 98073 29612** with an itemized message (Order ID, customer name, mobile, address, items, and quantities).
- Real-time Firestore sync instantly delivers the order to the manager's live order dashboard.

### 4. 🔥 Full Firebase Backend with Offline Resiliency
- **Firebase Authentication**: Email/password authentication, profile management, and password update verification.
- **Cloud Firestore**: Real-time subscriptions for products, categories, orders, and admin users.
- **Firebase Storage**: Direct image upload with progress tracking and previews for inventory items and customer profile avatars.
- **Offline Simulation Fallback**: If `.env` credentials are not yet configured, the system automatically falls back to local storage simulation without throwing unhandled exceptions.

---

## 🌾 Initial Catalog (55+ Products)
- **General Groceries**: Aashirvaad Chakki Atta, Fortune Sunflower Oil, India Gate Basmati Rice, Tata Sampann Dal, Tata Salt, Madhur Sugar, Tata Tea Gold, Everest Masalas, Amul Ghee.
- **Snacks & Chocolates**: Cadbury Dairy Milk Silk, KitKat, 5 Star, Kurkure Masala Munch, Lay's Magic Masala, Uncle Chipps, Parle-G Gold, Good Day Cashew, Maggi Noodles, Haldiram’s Bhujia.
- **Daily Care**: Dettol Original, Dove Beauty Bar, Lifebuoy, Head & Shoulders, Clinic Plus, Colgate Strong Teeth, Closeup Everfresh, Surf Excel Quick Wash, Vim Lemon Gel, Whisper Choice.
- **Cosmetics**: Lakmé Eyeconic Kajal, Maybelline Matte Lipstick, Himalaya Neem Face Wash, Pond’s Bright Beauty Cream, Elle 18 Nail Polish, Nivea Soft, Vaseline Healthy Bright.
- **Gift Items**: Royal Dry Fruit Hampers, Cadbury Deluxe Celebration Baskets, Brass Peacock Diyas, Ganesha Acrylic Idols, Luxury Scented Candles.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 1. Installation
```bash
git clone https://github.com/ogsiddharth/Aastha_general_store.git
cd Aastha_general_store
npm install
```

### 2. Environment Setup
Copy the example environment configuration:
```bash
cp .env.example .env
```
Populate your Firebase configuration keys in `.env` (refer to [SETUP.md](SETUP.md) for full guide).

### 3. Start Development Server
```bash
npm run dev
```
- **Customer Storefront**: `http://localhost:3000/`
- **Secret Admin Terminal**: `http://localhost:3000/manager-portal-sec-x9k2`
- **`/admin`**: Returns **404 Page Not Found**

### 4. Build for Production
```bash
npm run build
```
Generates two separate entry bundles in `dist/`:
- `dist/index.html` (Customer Storefront)
- `dist/manager-portal-sec-x9k2.html` (Secret Admin Portal)

---

## 🔑 Administrative Access

- **Secret Portal URL**: `http://localhost:3000/manager-portal-sec-x9k2`
- **Admin Username**: `masterSam`
- **Admin Password**: `Aastha@Jaunpur2026`
- **Features**:
  - Live inventory CRUD with Firebase Storage image upload.
  - One-click catalog seeding (55+ products).
  - Live orders stream with status manager (`Received` ➔ `Preparing` ➔ `Dispatched` ➔ `Delivered` ➔ `Cancelled`) and 1-click WhatsApp customer reply.

---

## 📖 Detailed Deployment Guide
For complete deployment guides for **Vercel**, **Netlify**, and **Firebase Hosting**, as well as security rules setup, read the full **[SETUP.md](SETUP.md)**.

---

## 📍 Store Information
- **Store Name**: Aastha General Store (आस्था जनरल स्टोर)
- **Location**: Station Road, Near Line Bazar, Jaunpur, Uttar Pradesh - 222002, India
- **Phone / WhatsApp**: +91 98073 29612
- **Timings**: Open Daily 7:00 AM – 10:00 PM
