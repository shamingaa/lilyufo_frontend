# Liufo Shop — Client

React + TypeScript + Tailwind CSS frontend for the Liufo Shop clothing catalog (Vite-powered). Talks to the `server/` API.

## Prerequisites

- Node.js 18+
- The `server/` backend running (see its README) — this app needs a live API to fetch products, categories, and place orders

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create your `.env` file from the example:

   ```bash
   cp .env.example .env
   ```

   `VITE_API_URL` should point at the running backend (defaults to `http://localhost:5001/api`).

3. Start the dev server:

   ```bash
   npm run dev
   ```

   Open the printed URL (default `http://localhost:5173`).

## What's in here

- Public shop: browse/search/filter products by category, view product detail, add to cart, checkout as a guest or logged-in customer (no payment — order is placed for offline fulfillment).
- Customer accounts (optional): register/login, view order history at `/my-orders`.
- Admin dashboard at `/admin` (login at `/admin/login` with the seeded admin credentials from the server's `.env`): manage categories, manage products (with image upload), view and update order status.

## Build for production

```bash
npm run build
```

Outputs static files to `dist/`, servable from any static host.
