# 🚀 Aastha General Store - Multi-Page Firebase Setup & Architecture Guide

Comprehensive architectural documentation and step-by-step setup guide for **Aastha General Store** (Jaunpur, Uttar Pradesh, Contact: +91 98073 29612).

---

## 🏛️ Architecture Overview: Two Completely Isolated Entry Points

To guarantee complete isolation, security, and anonymity of store administration, the application is engineered using **Vite Multi-Page Architecture (MPA)** with two completely distinct entry points:

```
Aastha_General_Store/
├── index.html                           --> Customer Storefront (loads /src/main.jsx)
├── manager-portal-sec-x9k2.html         --> Obfuscated Secret Admin Terminal (loads /src/admin.jsx)
```

### 1. Customer Storefront (`/index.html` or `/`)
- **Target Audience**: General shoppers across Jaunpur, UP.
- **Zero Admin Traces**: **ZERO links, ZERO buttons, and ZERO admin routes** anywhere in the customer bundle, navbar, footer, bottom navigation, or user settings.
- **No Prices Displayed**: As per physical store policy, daily retail prices are not listed online. Product cards show only image, name, category, pack size, stock indicator, and interactive quantity selectors (`- / +`).
- **Instant WhatsApp Checkout**: Saves the order to Cloud Firestore `orders` collection first, then triggers WhatsApp directed to the store owner at **+91 98073 29612** with an itemized breakdown.

### 2. Obfuscated Secret Admin Panel (`/manager-portal-sec-x9k2` or `manager-portal-sec-x9k2.html`)
- **Hidden Secret Route**: Accessible strictly via `/manager-portal-sec-x9k2` (configurable via `VITE_ADMIN_SECRET_PATH` in `.env`).
- **No `/admin` Route**: Visiting `/admin`, `/admin.html`, or similar standard paths returns a customer 404 ("Page Not Found") with zero hint that an administrative portal exists.
- **Dedicated Entry Point**: Bundled into a separate JavaScript chunk (`dist/assets/managerPortal-*.js`) that is never loaded by customer pages.
- **Secret Credentials**: Protected by authentication credentials (`masterSam` / `Aastha@Jaunpur2026`).
- **Real-Time Inventory CRUD**: Add, edit, or delete items with live product image uploads to **Firebase Storage**. Changes sync instantaneously across all devices via Firestore Realtime.
- **Live WhatsApp Orders Dashboard**: Real-time order stream with status updates (`Received` ➔ `Preparing` ➔ `Dispatched` ➔ `Delivered` ➔ `Cancelled`) and 1-click customer WhatsApp notifications.

---

## 📋 Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Firebase Project Setup](#2-firebase-project-setup)
3. [Enable Firebase Authentication](#3-enable-firebase-authentication)
4. [Set Up Cloud Firestore Database & Collections](#4-set-up-cloud-firestore-database--collections)
5. [Deploy Firestore Security Rules](#5-deploy-firestore-security-rules)
6. [Set Up Firebase Storage (Images & Avatars)](#6-set-up-firebase-storage-images--avatars)
7. [Deploy Storage Security Rules](#7-deploy-storage-security-rules)
8. [Configure Environment Variables (`.env`)](#8-configure-environment-variables-env)
9. [Local Development Server & Testing](#9-local-development-server--testing)
10. [Accessing the Secret Admin Portal](#10-accessing-the-secret-admin-portal)
11. [1-Click Seeding of 55+ Products into Firestore](#11-1-click-seeding-of-55-products-into-firestore)
12. [WhatsApp Order Flow Testing (+91 98073 29612)](#12-whatsapp-order-flow-testing-91-98073-29612)
13. [Production Deployment (Vercel, Netlify, Firebase Hosting)](#13-production-deployment-vercel-netlify-firebase-hosting)

---

## 1. Prerequisites
- **Node.js**: `v18.0.0` or higher ([Download Node.js](https://nodejs.org/))
- **npm**: `v9.0.0` or higher
- A standard Google account for [Firebase Console](https://console.firebase.google.com/)

---

## 2. Firebase Project Setup
1. Go to the **[Firebase Console](https://console.firebase.google.com/)**.
2. Click **"Add project"** and name it `aastha-general-store`.
3. Disable or enable Google Analytics (optional).
4. Click **"Create Project"**.
5. In Project Overview, click the **Web icon (`</>`)** to register a web app (`Aastha Store Web`).
6. Copy the generated `firebaseConfig` keys (`apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`).

---

## 3. Enable Firebase Authentication
1. In the Firebase Console left sidebar, navigate to **Build > Authentication**.
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
        request.auth.token.email == 'admin@aasthastore.com' ||
        exists(/databases/$(database)/documents/admin_users/$(request.auth.uid)) ||
        (exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin')
      );
    }

    // Products: Public read, Admin write
    match /products/{productId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Categories: Public read, Admin write
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Orders: Anyone can create; Owner and Admin can read/update
    match /orders/{orderId} {
      allow create: if true;
      allow read, update: if isAdmin() || (isAuthenticated() && resource.data.userId == request.auth.uid);
      allow delete: if isAdmin();
    }

    // Admin Users Directory: Admins only
    match /admin_users/{adminId} {
      allow read, write: if isAdmin();
    }

    // Customer Profiles: Owner & Admin access
    match /users/{userId} {
      allow read, write: if isOwner(userId) || isAdmin();
    }
  }
}
```
3. Click **Publish**.

---

## 6. Set Up Firebase Storage (Images & Avatars)
1. In Firebase Console left menu, navigate to **Build > Storage**.
2. Click **"Get started"**.
3. Choose the default Cloud Storage bucket (e.g. `aastha-general-store.appspot.com` in `asia-south1`).
4. Click **Next** and **Done**.

---

## 7. Deploy Storage Security Rules
1. In Storage, click the **Rules** tab.
2. Paste the contents from `storage.rules`:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isAuthenticated() {
      return request.auth != null;
    }

    // Product Images: Public read, authenticated admin write
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if isAuthenticated() &&
        request.resource.size < 5 * 1024 * 1024 &&
        request.resource.contentType.matches('image/.*');
    }

    // User Avatar uploads: User owns path
    match /avatars/{userId}/{fileName} {
      allow read: if true;
      allow write: if isAuthenticated() && request.auth.uid == userId &&
        request.resource.size < 3 * 1024 * 1024 &&
        request.resource.contentType.matches('image/.*');
    }
  }
}
```
3. Click **Publish**.

---

## 8. Configure Environment Variables (`.env`)
Create a `.env` file in the project root (copied from `.env.example`):

```bash
cp .env.example .env
```

Populate with your Firebase project credentials:

```ini
# ==========================================
# Aastha General Store - Local Environment
# Jaunpur, Uttar Pradesh (+91 98073 29612)
# ==========================================

VITE_FIREBASE_API_KEY=AIzaSyYourFirebaseApiKeyHere
VITE_FIREBASE_AUTH_DOMAIN=aastha-general-store.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=aastha-general-store
VITE_FIREBASE_STORAGE_BUCKET=aastha-general-store.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890

VITE_STORE_PHONE=919807329612
VITE_STORE_NAME="Aastha General Store"
VITE_STORE_LOCATION="Jaunpur, Uttar Pradesh"
VITE_ADMIN_EMAIL=admin@aasthastore.com

# Obfuscated Secret Route for the Isolated Admin Portal
# NEVER disclose this route publicly; visitors to /admin will receive a 404
VITE_ADMIN_SECRET_PATH=manager-portal-sec-x9k2
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
- **Secret Admin Portal**: `http://localhost:3000/manager-portal-sec-x9k2` (or `/manager-portal-sec-x9k2.html`)
- **Note**: Accessing `http://localhost:3000/admin` returns a **404 Page Not Found**!

---

## 10. Accessing the Secret Admin Portal

- **Secret URL**: `http://localhost:3000/manager-portal-sec-x9k2`
- **Default Staff Credentials**:
  - **Secret Admin ID**: `masterSam`
  - **Password Key**: `Aastha@Jaunpur2026`
- **Features in Admin Portal**:
  - **Inventory CRUD**: Add, edit, or delete items. Live file uploads upload directly to Firebase Storage with progress bar and live image preview!
  - **Optional Pricing**: Price input can be left blank or 0 as prices are confirmed at the physical store.
  - **Incoming Orders Dashboard**: Live feed of orders placed by customers via WhatsApp checkout. Change status (`Received` ➔ `Preparing` ➔ `Dispatched` ➔ `Delivered` ➔ `Cancelled`) and click **"WhatsApp Customer"** to send live updates directly to their mobile number!

---

## 11. 1-Click Seeding of 55+ Products into Firestore

1. Open the Secret Admin Portal at `http://localhost:3000/manager-portal-sec-x9k2`.
2. Sign in with admin credentials (`masterSam` / `Aastha@Jaunpur2026`).
3. Click the blue **"Seed Firestore Catalog"** button in the header.
4. All **55+ handpicked items** (Groceries, Dairy Milk, KitKat, Uncle Chips, Kurkure, Biscuits, Daily Care, Cosmetics, and Gifts) will be batch-written into your Cloud Firestore `products` collection within seconds!

---

## 12. WhatsApp Order Flow Testing (+91 98073 29612)

1. Visit `http://localhost:3000`.
2. Browse products (Atta, Rice, Dairy Milk, Kurkure, Uncle Chips, Soaps, Kajal, Gift Hampers).
3. Select quantities using `+ / -` and click **"Add to Cart"**.
4. Open the **Cart Drawer** from the header or bottom navigation bar.
5. Click **"Proceed to WhatsApp Order"**.
6. Enter name, 10-digit mobile number, and address in Jaunpur.
7. Click **"Send Order via WhatsApp"**:
   - The order document is immediately saved to Firestore (`orders` collection) with a unique Order ID (`AST-XXXX`).
   - WhatsApp opens smoothly directed to store manager at **+91 98073 29612** with an itemized list of items and quantities (no prices).
   - The order appears instantaneously in the Secret Admin Portal (`/manager-portal-sec-x9k2`) in real-time!

---

## 13. Production Deployment (Vercel, Netlify, Firebase Hosting)

### Test Production Build Locally:
```bash
npm run build
```
Vite generates two completely isolated HTML entry points in `dist/`:
- `dist/index.html` (Customer Storefront)
- `dist/manager-portal-sec-x9k2.html` (Secret Admin Portal)

---

### Option A: Deploy to Vercel
The repository includes a pre-configured `vercel.json` with multi-page rewrite routing:

```json
{
  "rewrites": [
    {
      "source": "/manager-portal-sec-x9k2",
      "destination": "/manager-portal-sec-x9k2.html"
    },
    {
      "source": "/manager-portal-sec-x9k2/(.*)",
      "destination": "/manager-portal-sec-x9k2.html"
    },
    {
      "source": "/((?!manager-portal-sec-x9k2).*)",
      "destination": "/index.html"
    }
  ]
}
```

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` and follow prompts.
3. In Vercel Project Settings > Environment Variables, add:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_ADMIN_SECRET_PATH` = `manager-portal-sec-x9k2`

---

### Option B: Deploy to Netlify
The repository includes pre-configured `netlify.toml` and `public/_redirects`:

```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/manager-portal-sec-x9k2/*"
  to = "/manager-portal-sec-x9k2.html"
  status = 200

[[redirects]]
  from = "/manager-portal-sec-x9k2"
  to = "/manager-portal-sec-x9k2.html"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

1. Push your repository to GitHub (`git push -u origin master`).
2. Log into [Netlify](https://app.netlify.com/) and click **"Add new site" > "Import an existing project"**.
3. Select your repository `ogsiddharth/Aastha_general_store`.
4. Netlify will auto-detect `npm run build` and publish directory `dist`.
5. Under **Site configuration > Environment variables**, add your Firebase keys.

---

### Option C: Deploy to Firebase Hosting
The repository includes pre-configured `firebase.json`:

```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login to your Google account
firebase login

# 3. Associate your project
firebase use --add

# 4. Deploy build and security rules
npm run build
firebase deploy
```

---

*Aastha General Store • Station Road, Near Line Bazar, Jaunpur, Uttar Pradesh • Contact: +91 98073 29612*
