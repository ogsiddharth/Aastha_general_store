# 🛒 Aastha General Store (आस्था जनरल स्टोर)
### *Modern High-Performance E-Commerce Web Application for Jaunpur, Uttar Pradesh*

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

A high-performance, mobile-first frontend web application crafted for **Aastha General Store**, located at Station Road, Near Line Bazar, Jaunpur, Uttar Pradesh, India. Built with clean Glassmorphism UI tokens, instant WhatsApp Checkout, local authentication with Web Crypto API salted SHA-256 hashing, and an Admin Inventory Management Panel with real-time sync.

---

## 🌟 Key Highlights & Features

### 1. 🌾 55+ Product Catalog Across 5 Real-World Categories
- **General Groceries**: Aashirvaad Chakki Atta, Fortune Sunflower Oil, India Gate Basmati Rice, Tata Sampann Toor Dal, Tata Salt, Madhur Sugar, Tata Tea Gold, Catch Turmeric & Red Chilli, Everest Masalas, Amul Ghee.
- **Snacks & Chocolates**: Cadbury Dairy Milk Silk, KitKat, 5 Star, Kurkure Masala Munch, Lay's Magic Masala, Uncle Chipps, Parle-G Gold, Good Day Cashew, Maggi Noodles, Haldiram’s Bhujia, Bourbon.
- **Daily Care**: Dettol Original, Dove Beauty Bar, Lifebuoy, Head & Shoulders, Clinic Plus, Colgate Strong Teeth, Closeup Everfresh, Surf Excel Quick Wash, Vim Lemon Gel, Whisper Choice Ultra, Harpic.
- **Cosmetics**: Lakmé Eyeconic Kajal, Maybelline Creamy Matte Lipstick, Himalaya Neem Face Wash, Pond’s Bright Beauty Cream, Elle 18 Nail Polish, Nivea Soft, Vaseline Healthy Bright, Biotique Serum.
- **Gift Items**: Royal Dry Fruit Hamper Boxes, Cadbury Deluxe Celebration Baskets, Brass Peacock Diyas, Ganesha Acrylic Idols, Luxury Scented Candles, Festive Greeting Cards.
- Formatted with Indian Rupee (`₹`) using `Intl.NumberFormat('en-IN')`.
- Dynamic quantity selector (+ / -, bounds 1 to 99), out-of-stock badges, and image fallback placeholders.

### 2. 📲 Instant WhatsApp Checkout
- Customers review their cart and click **"Proceed to WhatsApp Order"**.
- Address modal auto-pre-fills name, 10-digit mobile number, and delivery address in Jaunpur from the logged-in profile.
- Generates a formatted WhatsApp receipt and opens `https://wa.me/919807329612?text=...`:
  ```
  🛒 *New Order - Aastha General Store*
  👤 *Name:* Ramesh Srivastava
  📞 *Phone:* 9807329612
  📍 *Address:* House No. 14, Near Line Bazar, Jaunpur UP
  ------------------------
  1. Dairy Milk Silk Chocolate x 2 = ₹170 (₹85 each)
  2. Aashirvaad Shudh Chakki Atta x 1 = ₹245 (₹245 each)
  ------------------------
  *Grand Total: ₹415*
  📝 *Note:* Please deliver after 5 PM
  ```
- Every order is automatically saved into the local backend and appears instantly in the **Admin Orders Log**.

### 3. 🛡️ Admin Dashboard & Live Inventory Controls
- Dedicated route `/admin` protected with **Web Crypto API SHA-256 hash comparison**.
  - **Admin Username**: `masterSam`
  - **Admin Password**: `Aastha@Jaunpur2025`
  - *Note: Only the SHA-256 hash (`b4cfa147e359743e6a2224ae6ecca4fa656000412a736997a414d65abe903ab3`) is stored in code/config. Plain-text passwords are never saved.*
- **Stats Overview**: Total products count, out-of-stock count, bestsellers count, orders log count, and cumulative revenue.
- **Product CRUD**:
  - Add new products with name, price, category dropdown, image URL with live thumbnail preview, weight/unit, in-stock toggle, bestseller toggle, and description.
  - Inline edit modal for existing inventory.
  - Delete with safety confirmation dialog.
  - Instant stock toggle (`In Stock` / `Out of Stock`) and bestseller toggle directly from table rows.
- **Factory Reset**: "Reset Inventory" button restores the factory 55 items with one click.
- **Orders Viewer**: Review customer name, contact phone, delivery location, items breakdown, and cycle statuses (`Received` -> `Dispatched` -> `Delivered`).
- Real-time Pub/Sub sync: storefront updates immediately without requiring a page refresh.

### 4. 👤 Authentication & Settings
- Local registration and login without external social dependencies.
- Passwords hashed using **SHA-256 with per-user cryptographic salts** via native browser `window.crypto.subtle.digest`.
- **Client-Side Image Compressor**: Users can upload profile photos up to 2MB; the HTML canvas automatically scales them down to 200x200 JPEG base64 strings.
- **Dark/Light Mode**: Synced with Tailwind's `dark` class, persisted in `localStorage`, and auto-detects system `prefers-color-scheme`.
- Dynamic Indian greeting in header: *"Namaste, {Name} 🙏 (Good morning/afternoon/evening)"*.

---

## 🏗️ Architectural Service Layer (`src/services/`)

All data access is decoupled behind clean service abstractions so you can migrate to Firebase or Supabase in the future **without touching UI components**:

```
src/
├── services/
│   ├── storageService.js   # Safe localStorage wrapper with try/catch
│   ├── productService.js   # CRUD, stock toggle, reset, pub/sub
│   ├── orderService.js     # Orders logging and status tracking
│   └── authService.js      # Salted Web Crypto hashing & session
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended; verified on Node v25)
- npm (v9 or higher)

### 1. Clone & Install
```bash
git clone <repo-url>
cd Astha_General_Store
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 3. Build for Production
```bash
npm run build
```
Creates an optimized production bundle inside `dist/`.

### 4. Preview Production Build
```bash
npm run preview
```

---

## 🔑 Demo Credentials

| Role | Username | Password |
| :--- | :--- | :--- |
| **Store Admin** | `masterSam` | `Aastha@Jaunpur2025` |
| **Customer** | Register any new account on `/register`, or auto-login with custom credentials. |

---

## 🔄 Backend Migration Roadmap (Firebase / Supabase)

To connect this application to Firebase or Supabase, replace the implementations inside `src/services/`:

### Firebase Migration Example:
1. Install Firebase SDK: `npm install firebase`.
2. Initialize Firebase in `src/services/firebaseConfig.js`.
3. In `src/services/productService.js`, swap `storageService.getItem()` with Firestore calls:
   ```javascript
   import { db } from './firebaseConfig';
   import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

   export const productService = {
     getProducts: async () => {
       const snapshot = await getDocs(collection(db, 'products'));
       return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
     },
     // addProduct, updateProduct, deleteProduct...
   };
   ```
4. In `src/services/authService.js`, swap local salt hashing with `firebase/auth` (`signInWithEmailAndPassword`, `createUserWithEmailAndPassword`).
5. Your UI components (`ProductCard`, `ShopPage`, `AdminPage`, `CartPage`) require **zero modifications** because they communicate solely with the `ProductContext` and service layer!

---

## 📍 Store Information
- **Store Name**: Aastha General Store (आस्था जनरल स्टोर)
- **Location**: Station Road, Near Line Bazar, Jaunpur, Uttar Pradesh - 222002, India
- **Phone / WhatsApp**: +91 98073 29612
- **Timings**: Open Daily 7:00 AM – 10:00 PM
