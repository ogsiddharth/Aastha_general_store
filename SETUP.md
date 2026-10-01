# 🚀 Aastha General Store - Multi-Page Firebase Setup & Architecture Guide

Comprehensive architectural documentation and step-by-step setup guide for **Aastha General Store** (Jaunpur, Uttar Pradesh, Contact: +91 98073 29612).

---

## 🏛️ Architecture Overview: Two Completely Separate Entry Points

To guarantee complete isolation and security, the application uses **Vite Multi-Page Architecture (MPA)** with two completely distinct entry points:

```
Aastha_General_Store/
├── index.html                   --> Customer Storefront (loads /src/main.jsx)
├── admin.html                   --> Secret Admin Panel (loads /src/admin.jsx)
```

1. **Customer Storefront (`/index.html` or `/`)**:
   - Strictly for general customers in Jaunpur.
   - **Zero admin links, zero admin buttons, and zero admin dashboard routes anywhere** in the navbar, footer, bottom nav, or account settings.
   - **No Prices Displayed**: Product cards, cart drawer, cart page, and WhatsApp checkout show items, units, and quantities without prices (as per store policy, retail prices are confirmed at the physical store / upon WhatsApp order).
2. **Dedicated Secret Admin Panel (`/admin.html` or `/admin`)**:
   - Completely isolated entry point.
   - Strictly protected by secret administrator credentials (`masterSam`).
   - Real-time inventory manager with live product image uploads to **Firebase Storage**.
   - Real-time WhatsApp order manager with multi-device Firestore synchronization and 1-click status updates.

---

## 📋 Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Firebase Project Creation](#2-firebase-project-creation)
3. [Enable Firebase Authentication](#3-enable-firebase-authentication)
4. [Set Up Cloud Firestore Database & Collections](#4-set-up-cloud-firestore-database--collections)
5. [Deploy Firestore Security Rules](#5-deploy-firestore-security-rules)
6. [Set Up Firebase Storage (Images & Avatars)](#6-set-up-firebase-storage)
7. [Deploy Storage Security Rules](#7-deploy-storage-security-rules)
8. [Configure Environment Variables (`.env`)](#8-configure-environment-variables-env)
9. [Local Development Server & Testing](#9-local-development-server--testing)
10. [1-Click Seeding of 55+ Products into Firestore](#10-1-click-seeding-of-55-products-into-firestore)
11. [Accessing the Secret Admin Panel](#11-accessing-the-secret-admin-panel)
12. [WhatsApp Order Flow Testing (+91 98073 29612)](#12-whatsapp-order-flow-testing)
13. [Production Build & Deployment](#13-production-build--deployment)

---

## 1. Prerequisites
- **Node.js**: `v18.0.0` or higher ([Download Node.js](https://nodejs.org/))
- **npm**: `v9.0.0` or higher
- A standard Google account for [Firebase Console](https://console.firebase.google.com/)

---

## 2. Firebase Project Creation
1. Go to the **[Firebase Console](https://console.firebase.google.com/)**.
2. Click **"Add project"** and name it `aastha-general-store`.
3. Disable or enable Google Analytics (optional).
4. Click **"Create Project"**.
5. In Project Overview, click the **Web icon (`</>`)** to register the web app (`Aastha Store Web`).
6. Copy the generated `firebaseConfig` keys (`apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`).

---

## 3. Enable Firebase Authentication
1. In the Firebase Console left menu, navigate to **Build > Authentication**.
2. Click **"Get started"**.
3. Under the **Sign-in method** tab, select **Email/Password**.
4. Enable **Email/Password** and click **Save**.

---

## 4. Set Up Cloud Firestore Database & Collections
1. Navigate to **Build > Firestore Database** and click **"Create database"**.
2. Select database location: `asia-south1 (Mumbai)` for lowest latency in Uttar Pradesh, India.
3. Start in **Production mode** (or test mode) and click **Enable**.

### Firestore Collections Structure:
| Collection | Document ID | Key Fields | Purpose |
|------------|-------------|------------|---------|
| `products` | Auto-generated or `prod_xxx` | `name`, `category`, `image`, `unit`, `isBestseller`, `inStock`, `description`, `price` (optional), `createdAt` | Catalog items for storefront & admin |
| `categories` | Auto-generated | `name`, `slug`, `icon`, `order` | Category definitions |
| `orders` | Auto-generated | `orderId`, `customerName`, `phone`, `address`, `note`, `items`, `itemCount`, `status`, `userId`, `createdAt` | Real-time customer orders from WhatsApp |
| `admin_users`| Admin UID or `masterSam` | `username`, `role` ('admin'), `email`, `createdAt` | Authorized administrative accounts |
| `users` | Customer UID | `uid`, `name`, `email`, `phone`, `address`, `avatar`, `role` ('customer') | Customer accounts & saved addresses |

---

## 5. Deploy Firestore Security Rules
1. In Firestore, click the **Rules** tab.
2. Paste the contents from `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    function isAdmin() {
      return isAuthenticated() && (
        exists(/databases/$(database)/documents/admin_users/$(request.auth.uid)) ||
        (exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin') ||
        request.auth.token.email in ['admin@aasthastore.com', 'mastersam@aasthastore.com'] ||
        request.auth.token.role == 'admin'
      );
    }

    // Public read for customer storefront. Admin write only.
    match /products/{productId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }

    // Public read for categories. Admin write only.
    match /categories/{categoryId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }

    // Orders: Anyone can create (WhatsApp checkout), user reads own, admin reads & updates all.
    match /orders/{orderId} {
      allow create: if true;
      allow read: if isAdmin() || (isAuthenticated() && resource.data.userId == request.auth.uid);
      allow update, delete: if isAdmin();
    }

    // Users: Profile read/write restricted to owner or admin.
    match /users/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
    }

    // Admin Users: Strictly accessible only to authorized administrators
    match /admin_users/{adminId} {
      allow read, write: if isAdmin();
    }
  }
}
```
3. Click **"Publish"**.

---

## 6. Set Up Firebase Storage
1. Navigate to **Build > Storage** and click **"Get started"**.
2. Select Cloud Storage location: `asia-south1 (Mumbai)`.
3. Click **Done**.

---

## 7. Deploy Storage Security Rules
1. In Firebase Storage, click the **Rules** tab.
2. Paste the contents from `storage.rules`:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    function isAuthenticated() {
      return request.auth != null;
    }

    function isImage() {
      return request.resource.contentType.matches('image/.*')
        && request.resource.size < 5 * 1024 * 1024; // 5MB limit
    }

    // Product Images: Public view, authenticated write
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if isAuthenticated() && isImage();
    }

    // Avatars: Public view, owner authenticated write
    match /avatars/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if isAuthenticated() && request.auth.uid == userId && isImage();
    }
  }
}
```
3. Click **"Publish"**.

---

## 8. Configure Environment Variables (`.env`)
In the project root, open `.env` and fill in your Firebase project values:

```env
VITE_FIREBASE_API_KEY=AIzaSyYourActualApiKeyHere
VITE_FIREBASE_AUTH_DOMAIN=aastha-general-store.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=aastha-general-store
VITE_FIREBASE_STORAGE_BUCKET=aastha-general-store.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890

VITE_STORE_PHONE=919807329612
VITE_STORE_NAME="Aastha General Store"
VITE_STORE_LOCATION="Jaunpur, Uttar Pradesh"
VITE_ADMIN_EMAIL=admin@aasthastore.com
```

> **Offline Simulation Fallback**: If `.env` is left blank, the app will automatically run in local fallback mode using browser storage. It will never throw unhandled crashes or show a blank screen. Once real keys are provided, it connects to live Cloud Firestore and Firebase Storage immediately!

---

## 9. Local Development Server & Testing

```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev
```

The terminal will report:
- **Customer Storefront**: `http://localhost:3000/` (or `/index.html`)
- **Secret Admin Panel**: `http://localhost:3000/admin` (or `/admin.html`)

---

## 10. 1-Click Seeding of 55+ Products into Firestore
1. Open the Secret Admin Panel at `http://localhost:3000/admin`.
2. Sign in with the default admin credentials (see below).
3. Click the blue **"Seed Firestore Catalog"** button in the header.
4. All **55+ handpicked items** (Groceries, Dairy Milk, KitKat, Uncle Chips, Kurkure, Biscuits, Daily Care, Cosmetics, and Gifts) will be batch-written into your Cloud Firestore `products` collection within seconds!

---

## 11. Accessing the Secret Admin Panel
- **URL**: `http://localhost:3000/admin` (or `http://localhost:3000/admin.html`)
- **Default Staff Credentials**:
  - **Secret Admin ID**: `masterSam`
  - **Password Key**: `Aastha@Jaunpur2026`
- **Features in Admin Panel**:
  - **Inventory CRUD**: Add, edit, or delete items. Live file uploads upload directly to Firebase Storage with percentage progress and preview!
  - **Optional Pricing**: Price input can be left blank or 0 as prices are confirmed at the physical store.
  - **Incoming Orders Dashboard**: Live feed of orders placed by customers via WhatsApp checkout. Change status (`Received` ➔ `Preparing` ➔ `Dispatched` ➔ `Delivered` ➔ `Cancelled`) and click **"WhatsApp Customer"** to send live updates directly to their mobile number!

---

## 12. WhatsApp Order Flow Testing
1. Visit `http://localhost:3000`.
2. Browse products (Atta, Rice, Dairy Milk, Kurkure, Uncle Chips, Soaps, Kajal, Gift Hampers).
3. Select quantities using `+ / -` and click **"Add to Cart"**.
4. Open the **Cart Drawer** from the header or bottom navigation bar.
5. Click **"Proceed to WhatsApp Order"**.
6. Enter name, 10-digit mobile number, and address in Jaunpur.
7. Click **"Send Order via WhatsApp"**:
   - The order document is immediately saved to Firestore (`orders` collection) with a unique Order ID (`AST-XXXX-XXXX`).
   - WhatsApp opens smoothly directed to store manager at **+91 98073 29612** with an itemized list of items and quantities (no prices).
   - The order appears instantaneously in the Secret Admin Panel (`/admin`) in real-time!

---

## 13. Production Build & Deployment

### Test Production Build:
```bash
npm run build
```
Vite generates two isolated HTML entry points in `dist/`:
- `dist/index.html` (Customer Storefront)
- `dist/admin.html` (Secret Admin Panel)

### Deploy to Firebase Hosting:
```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Initialize Hosting
firebase init hosting
# - Public directory: dist
# - Single-page app: Yes
# - Overwrite index.html: No

# 4. Deploy
npm run build
firebase deploy --only hosting
```

---

*Aastha General Store • Station Road, Near Line Bazar, Jaunpur, Uttar Pradesh • Contact: +91 98073 29612*
