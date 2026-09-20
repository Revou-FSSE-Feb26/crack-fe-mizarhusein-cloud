[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/wEWvHaXF)

# Saluna Frontend

**Live demo: https://saluna-beach-club.vercel.app** (frontend on Vercel, API on Railway, database on Supabase)

Website for **Saluna Beach Club**: marketing pages, a digital menu with ordering cart, table reservations with customer accounts, and an admin dashboard. Built with Next.js 15 (App Router), React 18, TypeScript, and Tailwind CSS. Data comes from [`saluna-backend`](https://github.com/Revou-FSSE-Feb26/crack-be-mizarhusein-cloud) (NestJS + Prisma + PostgreSQL); this app proxies to it through its own `/api/*` routes.

## Features

**For visitors and customers**
- Marketing pages: home, events, promotions, contact.
- **Digital menu** with categories, item customization and a cart. Checkout stores the order in the database (guests can order without an account; a logged-in customer's order is linked to the account) and shows the order number.
- **Accounts**: instant sign-up (no email verification), login, and logout.
- **Table reservations**: a login is required; the form is prefilled from the account.
- **My account**: "My reservations" (with cancel), "My orders" (live status, refreshes by itself) and "Profile" (change name and password).

**For admins**
- **Notification bell** on the dashboard: a red badge counts new reservations and orders, a toast appears under the bell when something arrives (with a soft "ting" you can switch off), and the badge clears when the bell is opened. The read state is stored on the server per admin, so it survives reloads and devices.
- **Dashboard** with live numbers from the database: today's reservations and guests, upcoming and pending reservations, orders and revenue today, active orders, recent reservations and orders (refreshes every 30 s).
- **Reservations**: list, filter by status, confirm, complete, cancel.
- **Orders**: see items, notes and totals; move each order through pending, preparing, served and completed, or cancel it.
- **Menu**: create, edit and delete menu items.
- **Users**: list accounts, change a role, delete an account (with safeguards against locking yourself out).

**Security**: httpOnly session cookie, pages guarded by role in the middleware and again by the backend on every request.

## Screenshots

### Customer side

| Home | Digital menu |
| :--: | :--: |
| ![Home](docs/screenshots/01-home.jpg) | ![Menu](docs/screenshots/02-menu.jpg) |

| Cart and checkout | Sign up |
| :--: | :--: |
| ![Cart](docs/screenshots/03-cart-checkout.png) | ![Register](docs/screenshots/04-register.png) |

| Reservation form | My reservations |
| :--: | :--: |
| ![Reservation](docs/screenshots/05-reservation.png) | ![My reservations](docs/screenshots/06-my-reservations.png) |

| My orders | Profile |
| :--: | :--: |
| ![My orders](docs/screenshots/07-my-orders.png) | ![Profile](docs/screenshots/08-profile.png) |

### Admin side

**Dashboard**

![Admin dashboard](docs/screenshots/09-admin-dashboard.png)

**Notification bell** (badge, dropdown of the latest reservations and orders, sound switch)

![Notification bell](docs/screenshots/15-admin-notifications.png)

**Reservations**

![Admin reservations](docs/screenshots/10-admin-reservations.png)

**Orders**

![Admin orders](docs/screenshots/11-admin-orders.png)

**Menu**

![Admin menu](docs/screenshots/12-admin-menu.png)

**Users**

![Admin users](docs/screenshots/13-admin-users.png)

### API documentation

![Swagger UI](docs/screenshots/14-swagger.png)

## Database design (ERD)

The data lives in the backend ([`saluna-backend`](https://github.com/Revou-FSSE-Feb26/crack-be-mizarhusein-cloud)). Five tables and four foreign-key relationships: `users → reservations`, `users → orders`, `orders → order_items` and `menus → order_items`. The full explanation is in the backend README.

![ERD](docs/erd.png)


## Getting started

1. Run `saluna-backend` first (see its README) — it listens on `http://localhost:4000`.
2. Copy the env file and fill it in:
   ```
   cp .env.local.example .env.local
   ```
   | Variable | Meaning |
   | -------- | ------- |
   | `BACKEND_URL` | Base URL of `saluna-backend` (default `http://localhost:4000`) |
   | `ADMIN_SESSION_SECRET` | Must be **exactly the same value** as the backend's `JWT_SECRET`. The backend signs the login JWT; this app only verifies it. |

   (`ADMIN_EMAIL` / `ADMIN_PASSWORD` in the example file are no longer read.)
3. Install and run:
   ```
   npm install
   npm run dev
   ```
   The site is at `http://localhost:3000`.

## Pages and access

| Route | Who can open it | What it is |
| ----- | --------------- | ---------- |
| `/`, `/event`, `/promotion`, `/contact` | Everyone | Marketing pages |
| `/menu` | Everyone | Digital menu with categories, item customization, and cart (loaded from the backend). Checkout stores the order in the backend and shows the order number. Guests can order without an account; when logged in, the order is linked to the account. |
| `/login`, `/register` | Everyone | Customer sign-in and sign-up. Sign-up is instant (name, email, password of 6+ characters, no email verification) and logs the user straight in. |
| `/reservation` | **Logged-in users** | Table booking form. Name and email are prefilled from the account. Visitors who aren't logged in are redirected to `/login` and sent back afterwards. |
| `/my-reservations` | **Logged-in users** | The customer's own reservations with status, and a Cancel button for pending/confirmed ones |
| `/my-orders` | **Logged-in users** | The customer's own orders with live status (refreshes every 20 s) |
| `/profile` | **Logged-in users** | Change name and password |
| `/admin/login` | Everyone | Admin sign-in (customer accounts are rejected here) |
| `/admin/dashboard`, `/admin/menu`, `/admin/reservation`, `/admin/orders`, `/admin/users`, `/admin/settings` | **Admins only** | Dashboard (live numbers and recent activity from the database, refreshed every 30 s, with a notification bell that checks for new reservations and orders every 10 s), menu management (CRUD), reservation management (change status, cancel), order management (see items and totals, move orders through pending → preparing → served → completed, or cancel), user management (change a role, delete an account) |

## Roles and sessions

The app has two roles, `CUSTOMER` and `ADMIN` (the backend README explains how each is created).

- Login/register go through `POST /api/auth/login` and `POST /api/auth/register`, which call the backend and store the returned JWT in an **httpOnly** cookie named `saluna_session` (8 hours). The role is read from the verified JWT.
- `src/middleware.ts` guards the pages above: `/admin/*` requires the `ADMIN` role, `/reservation`, `/my-reservations`, `/my-orders` and `/profile` require any login. The role in the middleware comes from the token; the backend re-checks the role against the database on every API call, so a role change or deletion takes full effect there immediately.
- The `/api/admin/*` proxy routes forward the JWT to the backend as `Authorization: Bearer …`; the backend independently enforces the roles, so the guards here are a convenience and not the only line of defense.
- `GET /api/auth/me` tells client components (navbar, reservation form) who is logged in, since the cookie can't be read from JavaScript.

## Project structure

```
src/
  app/
    (site)/          public + customer pages (wrapped in Navbar/Footer)
    admin/login/     admin sign-in
    admin/(protected)/  admin pages (wrapped in the admin Sidebar)
    api/             proxy routes to the backend (auth, menu, reservation, admin/*)
    menu/            digital menu page
  components/        Navbar, Footer, menu/*, admin/*, auth/AuthForm
  context/           CartContext
  lib/               session.ts (JWT session helpers), redirect.ts, format.ts
  middleware.ts      route protection
```

## Not connected to the backend yet

`/api/contact` (the contact form) only logs to the server console and doesn't store anything yet. `/api/restaurant` still reads static data from `server/data/menuData.ts`.

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Dev server on port 3000 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |

## Deploying

Intended for Vercel. Set `BACKEND_URL` (the public URL of the deployed backend) and `ADMIN_SESSION_SECRET` (identical to the backend's `JWT_SECRET`) in the project's environment variables.
