[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/wEWvHaXF)

# Saluna Frontend

**Live demo: https://saluna-beach-club.vercel.app** (frontend on Vercel, API on Railway, database on Supabase)

Website for **Saluna Beach Club**: marketing pages, a digital menu with ordering cart, table reservations with customer accounts, and an admin dashboard. Built with Next.js 15 (App Router), React 18, TypeScript, and Tailwind CSS. Data comes from [`saluna-backend`](../saluna-backend) (NestJS + Prisma + PostgreSQL); this app proxies to it through its own `/api/*` routes.

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
| `/menu` | Everyone | Digital menu with categories, item customization, and cart (loaded from the backend). Checkout stores the order in the backend and shows the order number. Guests can order without an account. |
| `/login`, `/register` | Everyone | Customer sign-in and sign-up. Sign-up is instant (name, email, password of 6+ characters, no email verification) and logs the user straight in. |
| `/reservation` | **Logged-in users** | Table booking form. Name and email are prefilled from the account. Visitors who aren't logged in are redirected to `/login` and sent back afterwards. |
| `/my-reservations` | **Logged-in users** | The customer's own reservations with status, and a Cancel button for pending/confirmed ones |
| `/admin/login` | Everyone | Admin sign-in (customer accounts are rejected here) |
| `/admin/dashboard`, `/admin/menu`, `/admin/reservation`, `/admin/orders`, `/admin/settings` | **Admins only** | Dashboard (live numbers and recent activity from the database, refreshed every 30 s), menu management (CRUD), reservation management (change status, cancel), order management (see items and totals, move orders through pending → preparing → served → completed, or cancel) |

## Roles and sessions

The app has two roles, `CUSTOMER` and `ADMIN` (the backend README explains how each is created).

- Login/register go through `POST /api/auth/login` and `POST /api/auth/register`, which call the backend and store the returned JWT in an **httpOnly** cookie named `saluna_session` (8 hours). The role is read from the verified JWT.
- `src/middleware.ts` guards the pages above: `/admin/*` requires the `ADMIN` role, `/reservation` and `/my-reservations` require any login.
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
