<div align="center">

# Pzafira

**A modern, full-featured e-commerce storefront and admin console for a clothing brand.**

Built with React 18, Vite 6, Tailwind CSS 4 and SWR — backed by a Django REST Framework API.

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.3-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![React Router](https://img.shields.io/badge/React_Router-7.5-CA4245?logo=reactrouter&logoColor=white)](https://reactrouter.com)
[![SWR](https://img.shields.io/badge/SWR-2.3-000000?logo=vercel&logoColor=white)](https://swr.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](#license)

[**Live Demo**](https://pzafira.vercel.app/) · [**Backend API**](https://github.com/AbirHasanPiash/pzafira-cloth-store) · [**Report a Bug**](https://github.com/AbirHasanPiash/pzafira-client/issues)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Performance](#performance)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Available Scripts](#available-scripts)
- [Application Routes](#application-routes)
- [Backend API Surface](#backend-api-surface)
- [Deployment](#deployment)
- [Conventions](#conventions)
- [Known Limitations & Roadmap](#known-limitations--roadmap)
- [Contributing](#contributing)
- [Related Repositories](#related-repositories)
- [Author](#author)
- [License](#license)

---

## Overview

**Pzafira** is the web client for an online clothing store specialising in South Asian fashion — sharees, panjabis and fusion wear. It is a single-page application that covers the complete retail journey in one codebase:

- a **public storefront** for browsing, filtering and discovering products;
- an **authenticated customer area** for cart, wishlist, addresses and order history;
- a **checkout flow** wired to the SSLCommerz payment gateway;
- an **admin console** for catalogue management and sales analytics.

All persistence, business rules and authorisation live in the companion Django REST Framework service. This repository is the presentation layer: it renders the UI, orchestrates client state, and talks to the API over JSON.

---

## Features

### Storefront

- Landing page composed of a hero banner, auto-playing carousel, feature highlights, trending collections, a countdown offer section and a newsletter sign-up.
- Product catalogue with server-side pagination (DRF `next` / `previous` cursors) and audience segmentation for **Men**, **Women** and **Kids** via `?target_customer=`.
- Instant client-side refinement on the loaded page — category, brand, price range and free-text search — with no round-trip latency.
- Product detail pages with an image gallery, colour/size variant matrix, live stock and price resolution, quantity stepper and customer reviews with star ratings.
- Responsive from small mobile up, with animated transitions powered by Framer Motion.
- Static informational pages: About, Careers, Contact, FAQs, Privacy Policy, Terms of Service and Shipping & Returns, plus an order-status lookup.

### Accounts & Authentication

- JWT authentication against Djoser endpoints, with the session bootstrapped from `localStorage` on page load.
- Registration with email activation, resend-activation, password reset by email and in-app password change.
- Role-aware redirect after sign-in: staff users land on `/admin`, customers on `/dashboard`.
- Profile management (view, update, delete account) and a customer dashboard summarising cart, wishlist and order counts.

### Shopping & Checkout

- Server-synced cart with optimistic reducer updates, quantity editing, per-item removal and bulk clear.
- Wishlist with a live badge count in the navigation bar.
- Multiple shipping addresses with create, edit, delete and default-address selection.
- Order confirmation summarising subtotal, 10% tax and a flat ৳100 delivery charge before payment.
- **SSLCommerz** payment initiation with a redirect hand-off and dedicated success, failure and cancellation return routes.
- Paginated order history; staff can advance order status from the same view.

### Admin Console

- KPI dashboard: weekly and monthly order volume, current- and previous-month sales, top-liked products and top customers.
- Four Recharts visualisations — daily orders, daily sales, monthly orders, monthly sales — with dayjs-formatted axes.
- Full product lifecycle: create, edit, delete, plus variant management (colour, size, stock, price) and multi-image upload with per-file progress and primary-image selection.
- Taxonomy CRUD for brands, categories, colours and sizes.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| **UI framework** | React 18.3 (function components + hooks) |
| **Build tool** | Vite 6.3 with `@vitejs/plugin-react` |
| **Styling** | Tailwind CSS 4.1 (via `@tailwindcss/vite`), daisyUI 5 |
| **Routing** | React Router 7.5 (`BrowserRouter`, nested layout routes) |
| **Server state** | SWR 2.3 with a global fetcher and cache policy |
| **Client state** | React Context + `useReducer` (cart, wishlist, orders, admin) |
| **HTTP** | Axios 1.10 (single configured instance) |
| **Charts** | Recharts 3 + dayjs |
| **Animation** | Framer Motion 12 |
| **Notifications** | React Toastify 11 |
| **Icons** | lucide-react, react-icons, Heroicons |
| **UI primitives** | Headless UI |
| **Utilities** | clsx |
| **Linting** | ESLint 9 (flat config) with React, Hooks and Refresh plugins |
| **Hosting** | Vercel (SPA rewrite) |

---

## Architecture

### Provider composition

Providers are layered in `src/main.jsx` so that every downstream consumer can rely on the session being resolved before it mounts:

```
<StrictMode>
  └─ <BrowserRouter>                  routing context
       └─ <AuthProvider>              session bootstrap; blocks render until resolved
            └─ <SWRProvider>          global fetcher + cache policy
                 └─ <CartProvider>    server-synced cart (useReducer)
                      └─ <WishlistProvider>
                           └─ <OrdersProvider>
                                └─ <App />   route table + toast host
```

`AuthProvider` renders a spinner while it validates the stored access token against `/auth/users/me/`, which guarantees that `ProtectedRoute` never sees a transient `null` user and redirects a signed-in visitor to the login page by mistake.

### Data flow

Two complementary paths keep the UI in sync with the API:

```
                     ┌─────────────────────────────────────────┐
  read-heavy views ──┤ useSWR(key) → global fetcher → axios ────┼──► DRF API
  (catalogue, admin) └─────────────────────────────────────────┘
                     ┌─────────────────────────────────────────┐
  mutation flows  ───┤ context action → axios → dispatch ──────┼──► DRF API
  (cart, wishlist)   └─────────────────────────────────────────┘
```

- **`SWRProvider`** installs one fetcher for the whole app, so components call `useSWR("/products/api/detail-products/")` with no second argument. The shared policy disables focus revalidation, dedupes identical requests for five minutes, keeps previous data during transitions for flicker-free pagination, and retries once on failure.
- **Contexts** own the mutable domains. Each holds a reducer, exposes async actions that call the API and then dispatch, and surfaces toast feedback on success or failure.
- **`localStorage`** acts as a resilience layer, not a source of truth. Products, wishlist, orders, brands and the admin dashboard snapshot are cached so the UI can degrade gracefully when a request fails; the server response always wins when it arrives.
- **Logout fan-out** is broadcast with a custom DOM event (`user-logged-out`). Every context subscribes and clears its own slice, which avoids threading logout callbacks through the provider tree.

### Authentication flow

1. `login()` posts credentials to `/auth/jwt/create/` and stores the access and refresh tokens.
2. It then fetches `/auth/users/me/` and hydrates the user object, whose `is_staff` flag drives the post-login redirect.
3. Every outgoing request picks up the current token in an Axios **request interceptor**, so all tabs and providers stay in sync after a login, logout or refresh.
4. On a cold load, `AuthProvider` replays step 2 from the stored token. The storefront renders immediately while this resolves — only `ProtectedRoute` and `AdminRoute` wait on it.
5. When a request returns **401**, a **response interceptor** exchanges the refresh token at `/auth/jwt/refresh/` and replays the original request. Concurrent 401s share one refresh call rather than firing one each. If the refresh fails, the session is cleared and a `session-expired` event prompts a fresh sign-in.
6. `logout()` clears tokens and caches, and emits `user-logged-out`.

### Route protection

| Guard | Applies to | Behaviour |
| --- | --- | --- |
| `ProtectedRoute` | Cart, wishlist, orders, addresses, profile, dashboard | Redirects to `/login`, preserving the intended destination in location state |
| `AdminRoute` | The whole `/admin` branch | Requires `user.is_staff`; non-staff are sent to `/dashboard` |

Both render a skeleton rather than redirecting while the session is still resolving, so reloading a protected page does not bounce the user to the login screen. The API remains the authority on permissions; these guards keep the UI honest.

---

## Performance

The client is built to reach first paint quickly and to stay responsive between pages.

### Measured

| Metric | Before | After |
| --- | --- | --- |
| Initial JS + CSS (gzipped) | 334 KB | **122 KB** |
| Largest single JS chunk | 1,046 KB | 229 KB (React core, cached across deploys) |
| Image payload | 3.5 MB | **861 KB** |
| Chart library on first paint | Yes (~256 KB) | No — loads with `/admin` only |

### How

- **Route-level code splitting.** Every route below the landing page is a `React.lazy` import, so a shopper never downloads the admin console. Recharts, Framer Motion, Headless UI and dayjs are all off the critical path.
- **Chunking by update cadence.** React and the router are pinned to one chunk that survives deploys in the browser cache. Everything else is left to Rollup, which attaches each dependency to the route that imports it — a catch-all `vendor` chunk would pull the whole dependency tree into the first load.
- **Cross-session SWR cache.** Public catalogue responses are persisted to `localStorage` and rehydrated on boot, so a returning visitor sees products on first paint while SWR revalidates behind them. User-specific data (cart, orders, profile) is deliberately excluded.
- **Prefetching.** Hovering a product card or a navbar shop link warms both the route chunk and its API response, so the page usually renders with data already in hand. The landing page warms the catalogue at idle time rather than during render.
- **WebP images** at display-appropriate dimensions, lazy-loaded below the fold, with `width`/`height` on every tag to eliminate layout shift. The hero is preloaded and marked `fetchpriority="high"`.
- **Skeletons over spinners**, so loading states reserve the final layout instead of collapsing it.
- **`useDeferredValue`** on the shop and admin search inputs keeps typing responsive while the grid re-filters at lower priority.

---

## Project Structure

```
pzafira-client/
├── public/
│   ├── images/                  Static marketing imagery (hero, carousel, trending)
│   └── z_logo.svg               Favicon / brand mark
├── src/
│   ├── admin/                   Admin console
│   │   ├── AdminLayout.jsx      Sidebar shell + <Outlet />
│   │   ├── AdminPanelContext.jsx  Dashboard KPI store with localStorage hydration
│   │   ├── DashboardHome.jsx    KPI cards + chart grid
│   │   ├── *Chart.jsx           Recharts: daily/monthly orders and sales
│   │   ├── ProductList.jsx      Catalogue table, pagination
│   │   ├── CreateProduct.jsx    Product creation form
│   │   ├── ProductDetail.jsx    Inline edit, variants, images
│   │   ├── AddVariantModal.jsx  Colour / size / stock / price editor
│   │   ├── ImageUploadModal.jsx Multi-file upload with progress
│   │   └── Brand|Category|Color|Size.jsx   Taxonomy CRUD
│   ├── api/
│   │   ├── axios.js             Axios instance: base URL, JWT header, 401 refresh
│   │   └── fetcher.js           Shared SWR fetcher, also used by preload()
│   ├── auth/
│   │   ├── AuthProvider.jsx     Session context: login, logout, bootstrap
│   │   ├── useAuth.jsx          Convenience hook over AuthContext
│   │   ├── ProtectedRoute.jsx   Redirects unauthenticated users to /login
│   │   ├── AdminRoute.jsx       Requires user.is_staff for the /admin branch
│   │   ├── Login|Register.jsx   Credential forms
│   │   ├── Activation.jsx       Email activation callback
│   │   ├── PasswordResetConfirm.jsx
│   │   └── Dashboard.jsx        Customer dashboard
│   ├── components/              Shared layout and landing-page sections
│   │   ├── Layout.jsx           Navbar + error boundary + Suspense + Footer
│   │   ├── ErrorBoundary.jsx    Contains render and stale-chunk failures
│   │   ├── Skeletons.jsx        Shared loading placeholders
│   │   ├── ScrollToTop.jsx      Resets scroll position on navigation
│   │   ├── Navbar.jsx           Navigation, cart/wishlist badges, account menu
│   │   ├── Home.jsx             Landing page; prefetches catalogue endpoints
│   │   └── Hero|Carousel|Features|TrendingNow|OfferSection|NewsletterForm.jsx
│   ├── data/                    Static content for landing-page sections
│   ├── pages/                   Informational pages (About, FAQs, Policies, …)
│   │   └── NotFound.jsx         404 catch-all
│   ├── shop/                    Storefront and commerce domain
│   │   ├── CartContext.jsx      Cart reducer + server sync
│   │   ├── WishlistContext.jsx  Wishlist reducer + offline fallback
│   │   ├── OrdersContext.jsx    Paginated order history
│   │   ├── Shop.jsx             Catalogue grid, filtering, pagination
│   │   ├── Filter.jsx           Loop-safe filter panel
│   │   ├── ProductDetails.jsx   Variant selection, gallery, add-to-cart
│   │   ├── ProductReviews.jsx   Review list and submission
│   │   ├── Address*.jsx         Address selection and management
│   │   ├── OrderConfirmation.jsx  Totals + payment initiation
│   │   └── Payment{Success,Fail,Cancel}.jsx   Gateway return routes
│   ├── user/                    Profile and password management
│   ├── App.jsx                  Route table + toast container
│   ├── main.jsx                 Entry point and provider composition
│   ├── SWRProvider.jsx          SWR config + localStorage-backed cache provider
│   └── index.css                Tailwind entry, theme tokens, keyframes
├── .env.example                 Configuration template
├── eslint.config.js             ESLint 9 flat config
├── tailwind.config.js           Content globs + daisyUI plugin
├── vite.config.js               React + Tailwind plugins
├── vercel.json                  SPA rewrite for client-side routing
└── index.html                   Vite HTML entry
```

---

## Getting Started

### Prerequisites

| Requirement | Version |
| --- | --- |
| Node.js | 18.x or newer (20 LTS+ recommended) |
| npm | 9 or newer |
| Backend API | A running [Pzafira API](https://github.com/AbirHasanPiash/pzafira-cloth-store) instance, or the hosted [Backend](https://pzafira-cloth-store.vercel.app/swagger/) |

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/AbirHasanPiash/pzafira-client.git
cd pzafira-client

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app is served at **http://localhost:5173** with hot module replacement enabled.

Out of the box the client talks to the hosted production API, so it is usable immediately without running the backend locally. See [Configuration](#configuration) to point it elsewhere.

### Production build

```bash
npm run build     # emits an optimised bundle to dist/
npm run preview   # serves dist/ locally to verify the build
```

---

## Configuration

Configuration is read from environment variables. Copy the template and adjust:

```bash
cp .env.example .env.local
```

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `https://pzafira-cloth-store.vercel.app` | Base URL of the Pzafira API |

To develop against a local Django server:

```bash
# .env.local  (git-ignored by the existing *.local rule)
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Leaving the variable unset falls back to the hosted API, so the client runs with no setup.

> **CORS:** the hosted API only allows its own frontend origin. Running this client on `localhost` against the **production** API will fail CORS on every request — point `VITE_API_BASE_URL` at a local backend, and add `http://localhost:5173` to the Django `CORS_ALLOWED_ORIGINS` setting.

Only variables prefixed with `VITE_` are exposed to client code by Vite. Because everything in this bundle ships to the browser, **never place secrets — payment keys, admin credentials, private API tokens — in these variables.** All sensitive configuration belongs in the backend.

---

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR on port 5173 |
| `npm run build` | Produce a production bundle in `dist/` |
| `npm run preview` | Serve the production bundle locally |
| `npm run lint` | Run ESLint across the project |

---

## Application Routes

All routes render inside `Layout` (navbar + footer). Nested admin routes render inside `AdminLayout`.

### Public

| Path | Component | Purpose |
| --- | --- | --- |
| `/` | `Home` | Landing page; prefetches catalogue endpoints |
| `/shop` | `Shop` | Product grid — accepts `?target_customer=men\|women\|kids` |
| `/shop/:id` | `ProductDetails` | Variants, gallery, reviews, add to cart |
| `/login` | `Login` | Sign in and request a password reset |
| `/register` | `Register` | Sign up; triggers the activation email |
| `/welcome` | `Welcome` | Post-registration confirmation |
| `/auth/activate/:uid/:token` | `Activation` | Email activation callback |
| `/password/reset/confirm/:uid/:token` | `PasswordResetConfirm` | Password reset callback |
| `/change-password` | `ChangePassword` | Change an existing password |
| `/about`, `/careers`, `/contact`, `/faqs` | — | Informational pages |
| `/privacy-policy`, `/terms-of-service`, `/shipping-and-returns` | — | Policy pages |
| `/order-tracking` | `OrderTracking` | Status lookup against the signed-in user's orders |
| `/payment/success`, `/payment/fail`, `/payment/cancel` | — | SSLCommerz return routes |
| `*` | `NotFound` | 404 catch-all |

### Protected

Guarded by `ProtectedRoute`; unauthenticated visitors are redirected to `/login`.

| Path | Component | Purpose |
| --- | --- | --- |
| `/dashboard` | `Dashboard` | Customer overview with live counts |
| `/profile` | `UserProfile` | View, update or delete the account |
| `/cart` | `CartItems` | Cart contents and quantity editing |
| `/wishlist` | `Wishlist` | Saved products |
| `/addresses` | `AddressPage` | Select a delivery address (`/addreses` redirects here for old links) |
| `/manage-addresses` | `ManageAddress` | Address CRUD |
| `/confirm-order` | `OrderConfirmation` | Review totals and start payment |
| `/orders` | `OrdersPage` | Paginated order history |

### Admin

Guarded by `AdminRoute`; requires `user.is_staff`.

| Path | Component | Purpose |
| --- | --- | --- |
| `/admin` | `DashboardHome` | KPI cards and analytics charts |
| `/admin/top-users` | `TopUsers` | Highest-value customers |
| `/admin/top-products` | `TopLikedProducts` | Most-wishlisted products |
| `/admin/products` | `ProductList` | Catalogue table |
| `/admin/products/create` | `CreateProduct` | Add a product |
| `/admin/product/:id` | `ProductDetail` | Edit product, variants and images |
| `/admin/brands`, `/admin/categories`, `/admin/colors`, `/admin/sizes` | — | Taxonomy CRUD |
| `/admin/order-history` | `OrdersPage` | All orders, with status transitions |

---

## Backend API Surface

Every request is issued through the Axios instance in `src/api/axios.js` and carries an `Authorization: JWT <access>` header once a session exists.

| Domain | Endpoints |
| --- | --- |
| **Auth** (Djoser) | `POST /auth/jwt/create/` · `POST /auth/users/` · `POST /auth/users/activation/` · `POST /auth/users/resend_activation/` · `POST /auth/users/reset_password/` · `POST /auth/users/reset_password_confirm/` · `POST /auth/users/set_password/` · `GET /auth/users/me/` |
| **Profile** | `GET` · `PATCH` · `DELETE /auth/profile/` |
| **Catalogue** | `GET /products/api/detail-products/` (`?target_audience=`, `?page=`) · `GET` / `DELETE /products/api/detail-products/:id/` · `POST /products/api/products/` · `PUT /products/api/products/:id/` |
| **Variants** | `GET` · `POST /products/api/detail-products/:id/variants/` · `PUT` · `DELETE /products/api/detail-products/:id/variants/:variantId/` |
| **Images** | `POST /products/api/detail-products/:id/images/` (multipart) |
| **Reviews** | `GET` · `POST /products/api/detail-products/:id/reviews/` · `PUT` · `DELETE /products/api/detail-products/:id/reviews/:reviewId/` |
| **Taxonomy** | `GET` · `POST` · `PUT` · `DELETE` on `/products/api/{brands,categories,colors,sizes}/` |
| **Cart** | `GET` · `POST /cart/api/cart-items/` · `PATCH` · `DELETE /cart/api/cart-items/:id/` · `DELETE /cart/api/cart/clear/` |
| **Wishlist** | `GET` · `POST /wishlist/api/wishlist/` · `DELETE /wishlist/api/wishlist/:id/` |
| **Addresses** | `GET` · `POST /shipping/api/addresses/` · `PUT` · `DELETE /shipping/api/addresses/:id/` |
| **Orders** | `GET /orders/api/orders/?page=` · `PATCH /orders/api/orders/:id/` |
| **Payment** | `POST /payment/api/initiate/` → returns the SSLCommerz `payment_url` |
| **Analytics** | `GET /adminuser/api/admin-dashboard/` · `/adminuser/api/{daily-orders,daily-sales,monthly-orders,monthly-sales}/` |
| **Newsletter** | `POST /api/newsletter/subscribe/` |

---

## Deployment

The project is deployed on **Vercel** at [pzafira.vercel.app](https://pzafira.vercel.app/).

| Setting | Value |
| --- | --- |
| Framework preset | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |
| Install command | `npm install` |

`vercel.json` rewrites every path to `index.html` so that deep links such as `/shop/12` are handled by React Router rather than returning a 404:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Any static host works as long as it applies the same SPA fallback — for example a `/* /index.html 200` rule in Netlify's `_redirects`, or `try_files $uri /index.html;` in nginx.

**CORS:** the backend must allow the deployed origin. When developing locally, add `http://localhost:5173` to the Django `CORS_ALLOWED_ORIGINS` setting.

---

## Conventions

- **Components** are function components in `PascalCase.jsx`, one component per file, colocated with the domain folder they serve (`admin/`, `auth/`, `shop/`, `user/`).
- **Hooks and contexts** expose a `useX()` accessor (`useAuth`, `useCart`, `useWishlist`, `useOrders`) rather than requiring consumers to import the raw context.
- **Reducers** live beside their provider and use uppercase snake-case action types (`SET_CART`, `REMOVE_FROM_WISHLIST`).
- **Server reads** go through `useSWR` with the endpoint path as the cache key; **writes** go through a context action so the reducer and the toast stay together.
- **Styling** is utility-first Tailwind in JSX. Custom keyframes, the spinner and theme tokens live in `src/index.css`; there are no CSS modules.
- **Feedback** is delivered with `react-toastify` — success on completed mutations, error on failed requests.
- **Images** always carry `width`, `height` and `decoding="async"`; everything below the fold also gets `loading="lazy"`. Assets live in `public/images` as WebP.
- `npm run lint` is expected to pass with **zero errors** — treat a new one as a build failure, not noise.

---

## Known Limitations & Roadmap

Documented openly so contributors know where the sharp edges are.

| Area | Current state | Planned improvement |
| --- | --- | --- |
| Token storage | Tokens live in `localStorage`, which is readable by any script on the origin | Move to httpOnly cookies, or add a strict CSP |
| Search & filters | Applied client-side to the currently loaded page only, so a match on page 3 is invisible from page 1 | Push `search`, `category`, `brand` and price range to the API as query parameters |
| Order tracking | Scans the signed-in customer's order pages client-side; there is no guest lookup | Add a dedicated order-lookup endpoint that takes an ID and email |
| Demo protection | Destructive admin actions are intentionally disabled and show a "Demo mode" toast; the real requests sit commented out beside them | Gate on an env flag rather than commented code |
| Testing | No automated tests | Add Vitest + React Testing Library for contexts and critical flows |
| Image pipeline | WebP is generated manually and committed | Move to a build-step or CDN transform, with AVIF and `srcset` for narrow screens |
| Accessibility | No audit has been run; focus management on modals is unverified | Run axe, add focus traps and skip links |

### Recently addressed

Environment-based configuration · silent-refresh interceptor with single-flight and retry · `is_staff` guard on the admin branch · `/addresses` spelling with a redirect · route-level code splitting · error boundary and 404 route · cross-session SWR cache · WebP image pipeline · removal of unused dependencies.

---

## Contributing

Contributions are welcome.

1. Fork the repository and create a branch: `git checkout -b feat/your-feature`.
2. Make your changes, keeping to the [conventions](#conventions) above.
3. Verify the build: `npm run lint && npm run build`.
4. Commit with a clear, imperative message: `git commit -m "Add order status filter to admin table"`.
5. Push and open a pull request describing the change and how you tested it.

For substantial changes, please open an issue first so the approach can be discussed.

---

## Related Repositories

| Repository | Description |
| --- | --- |
| [pzafira-client](https://github.com/AbirHasanPiash/pzafira-client) | This repository — React storefront and admin console |
| [pzafira-cloth-store](https://github.com/AbirHasanPiash/pzafira-cloth-store) | Django REST Framework API: catalogue, orders, payments, email |

---

## Author

**MD. Abir Hasan Piash**

[LinkedIn](https://www.linkedin.com/in/a-h-piash/) · [GitHub](https://github.com/AbirHasanPiash) · [abirhasanpiash@gmail.com](mailto:abirhasanpiash@gmail.com)

---

## License

Released under the **MIT License**. You are free to use, modify and distribute this project with attribution.

---

<div align="center">

If this project is useful to you, consider starring the repository.

</div>
