# አዲስReview

**Discover businesses. Share your experience.**

አዲስReview is a modern Ethiopian Business Review & Rating platform. Users
create an account, browse businesses in Addis Ababa by category, search by
name, read customer reviews, and submit their own ratings.

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Architecture](#architecture)
5. [Folder Structure](#folder-structure)
6. [Installation](#installation)
7. [Running the App](#running-the-app)
8. [Demo Login](#demo-login)
9. [API Endpoints](#api-endpoints)
10. [Database Schema](#database-schema)
11. [Future Improvements](#future-improvements)

---

## Overview

A full-stack MVP with a **React (Vite) frontend** and a **Node.js/Express
REST API backend**, backed by a normalized **SQLite** database
(`better-sqlite3`) with real **JWT authentication**.

- Modern React development (hooks, context, routing, component composition)
- REST API design with real authentication and pagination
- Relational database design
- Clean, modular, maintainable code across two separate projects
- A polished, production-feeling UI/UX

---

## Features

- ✔ Create an account and log in (JWT-based auth)
- ✔ Browse all businesses across **7 categories**: Restaurants, Cafés,
  Hotels, Shopping, Healthcare, Beauty, and More (real estate, banks, malls)
- ✔ Live search by business name or category
- ✔ Browse businesses filtered by category, with "Load More" pagination
- ✔ Business details page with full description, address, and images
- ✔ Read customer reviews, paginated with "Load More"
- ✔ Submit a review while logged in — **the author is always the
  authenticated user**, never a free-text name
- ✔ Average rating and star-by-star rating distribution, computed live
  from reviews
- ✔ "Get Directions" button linking out to Google Maps
- ✔ Toast notifications, skeleton loading states, empty states, and a
  custom 404 page
- ✔ Fully responsive, mobile-friendly layout, including the auth menu

---

## Tech Stack

**Frontend**
- React 18 + Vite
- React Router v6
- Axios
- React Icons
- React Context for auth state (`useAuth`) and toast notifications (`useToast`)

**Backend**
- Node.js + Express
- SQLite via [`better-sqlite3`](https://github.com/WiseLibs/better-sqlite3)
- `bcryptjs` for password hashing
- `jsonwebtoken` for auth tokens

**Tooling**
- Git for version control
- Plain JavaScript throughout (no TypeScript, per project requirements)

---

## Architecture

```
┌─────────────────┐        REST (JSON over HTTP)        ┌──────────────────┐
│  React Client    │ ───────────────────────────────────▶│  Express Server  │
│  (Vite, :5173)    │◀─────────────────────────────────── │     (:5000)      │
└─────────────────┘        Bearer <JWT> on write routes   └──────────────────┘
                                                                     │
                                                          Controllers call Models
                                                                     │
                                                                     ▼
                                                            ┌──────────────┐
                                                            │  SQLite DB   │
                                                            │(better-sqlite3)│
                                                            │  WAL mode    │
                                                            └──────────────┘
```

The backend follows a classic layered structure:

- **routes/** – define URL paths and HTTP verbs, delegate to controllers
- **controllers/** – parse/validate the request, call the model, shape the response
- **models/** – all raw SQL lives here; nothing outside this layer touches the DB
- **middleware/** – cross-cutting concerns (input validation, JWT auth, centralized error handling)

The frontend mirrors this separation:

- **pages/** – route-level components that fetch data and compose the UI
- **components/** – small, reusable, presentation-focused pieces
- **services/** – all `axios` calls live here, one file per resource
- **hooks/** – shared stateful logic (`useAuth` for auth state, `useToast` for notifications)

---

## Folder Structure

```
adis-review/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route-level pages (incl. Login, Register)
│   │   ├── services/        # Axios API calls
│   │   ├── hooks/           # useAuth, useToast
│   │   ├── utils/           # Formatting helpers
│   │   └── styles/          # Global CSS variables & base styles
│   └── package.json
│
├── server/                  # Node.js + Express backend
│   ├── routes/               # auth.js, businesses.js, categories.js, search.js
│   ├── controllers/          # Request handlers
│   ├── models/                 # SQL queries (users, businesses, reviews, categories)
│   ├── middleware/              # auth.js (JWT), validate.js, errorHandler.js
│   ├── database/                 # schema.sql + seed.js
│   ├── config/                     # DB connection (better-sqlite3)
│   ├── uploads/                      # Static hook for future self-hosted images
│   ├── utils/                          # asyncHandler, ApiError, jwt.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or later
- npm (comes with Node.js)

### 1. Clone the project


### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Install frontend dependencies

```bash
cd client
npm install
```

---

## Running the App

### Start the backend

```bash
cd server
npm run dev      # with nodemon, auto-restarts on file changes
# or
npm start        # plain node
```

The server starts on **http://localhost:5000**. The first time it runs, it
automatically seeds the SQLite database (41 demo users, 7 categories, 22
Addis Ababa businesses, 43 reviews) — no manual seed step required.

If you ever want to reset the data:

```bash
cd server
rm database/adisreview.db
npm run seed
```

### Start the frontend

In a second terminal:

```bash
cd client
npm run dev
```

The app opens on **http://localhost:5173**. Vite's dev server proxies any
request to `/api/*` to the backend on port 5000, so the frontend never
needs to hardcode a backend URL in development.

### Build for production

```bash
cd client
npm run build      # outputs static files to client/dist
npm run preview    # preview the production build locally
```

---

## Demo Login

Every seeded review is tied to a real user account. To try submitting a review yourself, log in with:

```
email:    demo@adisreview.com
password: Password123!
```

All 40 other seeded reviewer accounts share the same password, in case
you want to test with an existing name (`<firstname>.<lastname>@example.com`).

---

## API Endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint                        | Auth required? | Description                                   |
|--------|----------------------------------|:---:|------------------------------------------------|
| POST   | `/auth/register`                  |     | Create an account, returns `{ user, token }`   |
| POST   | `/auth/login`                        |     | Log in, returns `{ user, token }`               |
| GET    | `/auth/me`                             | ✅ | Get the current logged-in user                  |
| GET    | `/businesses`                    |     | List businesses. `?category=<id>&page=1&limit=12` |
| GET    | `/businesses/:id`                 |     | Get a single business (includes rating distribution) |
| GET    | `/businesses/:id/reviews`          |     | List reviews. `?page=1&limit=10`                |
| POST   | `/businesses/:id/reviews`           | ✅ | Submit a review — author is always the logged-in user |
| GET    | `/categories`                        |     | List all categories with business counts       |
| GET    | `/search?q=<term>`                    |     | Search businesses. `&page=1&limit=12`           |
| GET    | `/health`                              |     | Health check                                    |

Protected endpoints require an `Authorization: Bearer <token>` header,
where `<token>` is the JWT returned by `/auth/register` or `/auth/login`.

### Example: Register + submit a review

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@adisreview.com","password":"Password123!"}'
# => { "success": true, "data": { "user": {...}, "token": "eyJ..." } }

curl -X POST http://localhost:5000/api/businesses/1/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJ..." \
  -d '{"rating":5,"comment":"Fantastic food and friendly staff!"}'
```

Successful response (`201 Created`):

```json
{
  "success": true,
  "data": {
    "id": 44,
    "business_id": 1,
    "user_id": 41,
    "author_name": "Demo User",
    "rating": 5,
    "comment": "Fantastic food and friendly staff!",
    "created_at": "2026-07-03 06:50:53"
  }
}
```

Trying the same request **without** a token:

```json
{ "success": false, "error": "You must be logged in to do that." }
```

Paginated list responses (`/businesses`, `/search`, `/businesses/:id/reviews`)
include a `pagination` object:

```json
{
  "success": true,
  "count": 9,
  "data": [ /* ... */ ],
  "pagination": { "page": 1, "limit": 9, "total": 22, "totalPages": 3 }
}
```

---

## Database Schema

Four normalized tables (see `server/database/schema.sql`):

- **users** — `id, name, email (unique), password_hash, created_at`
- **categories** — `id, name, icon, description`
- **businesses** — `id, name, category_id (FK), description, address, city, latitude, longitude, image_url, price_range, created_at`
- **reviews** — `id, business_id (FK), user_id (FK), author_name, rating, comment, created_at`

Average ratings and rating distributions are **computed on the fly** with
SQL `AVG()`/`COUNT()` rather than stored as columns, so they can never
drift out of sync with the underlying review data. A review's `author_name`
is a denormalized snapshot of the user's display name at review time, but
authorship itself is enforced by `user_id`, which the API only ever sets
from the authenticated request — never from client input.

---


## Future Improvements

- Password reset and email verification
- Edit/delete your own review (straightforward now that reviews carry a real `user_id`)
- Business owner dashboard to respond to reviews
- Real image uploads (the `/uploads` static route is ready for this)
- Map view (Google Maps / Leaflet) showing all businesses at once
- Automated tests (Jest/Vitest for models & controllers, integration tests for routes)
- Deployment (e.g. Render/Railway for the API, Vercel/Netlify for the client) with a managed Postgres database

---
