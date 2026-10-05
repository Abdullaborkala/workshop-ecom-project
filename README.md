# Store2 - A Simple MERN E-commerce (Chapter-wise Course)

A very small e-commerce website built **step by step** to teach how a full-stack
app is created in a **modular** way.

- **Frontend:** React (Vite) + React Router + Axios
- **Backend:** Node.js + Express + Mongoose (MongoDB) + JWT

Every chapter lives on its **own git branch**. Each branch is created from the
previous one, so you can jump to any lesson and see the code exactly as it was
at the end of that lesson. The `main` branch holds the finished app.

## How to use this repo

```bash
git branch -a                      # list all chapter branches
git checkout chapter-01-setup      # go to a chapter
git diff chapter-02-backend-setup chapter-03-product-api   # what a chapter added
```

After switching branches, run `npm install` again inside `server/` and `client/`
if that chapter added new packages.

## Chapter index

| # | Branch | Topic | Notes |
|---|--------|-------|-------|
| 01 | `chapter-01-setup` | Project setup and MERN architecture | [docs](docs/chapter-01-setup.md) |
| 02 | `chapter-02-backend-setup` | Express server + MongoDB connection | [docs](docs/chapter-02-backend-setup.md) |
| 03 | `chapter-03-product-api` | Product model, controller, routes, seed | [docs](docs/chapter-03-product-api.md) |
| 04 | `chapter-04-frontend-setup` | React + Vite, router, axios, proxy | [docs](docs/chapter-04-frontend-setup.md) |
| 05 | `chapter-05-product-ui` | Product cards, grid, details page | [docs](docs/chapter-05-product-ui.md) |
| 06 | `chapter-06-cart` | Cart with React Context + localStorage | [docs](docs/chapter-06-cart.md) |
| 07 | `chapter-07-auth-backend` | User model, bcrypt, JWT, auth middleware | [docs](docs/chapter-07-auth-backend.md) |
| 08 | `chapter-08-auth-frontend` | Login/Register pages, token interceptor, protected routes | [docs](docs/chapter-08-auth-frontend.md) |
| 09 | `chapter-09-orders` | Order model, checkout, order history | [docs](docs/chapter-09-orders.md) |
| 10 | `chapter-10-admin` | Admin product CRUD (create, edit, delete) | [docs](docs/chapter-10-admin.md) |
| 11 | `chapter-11-admin-orders` | Admin order list + status updates (ship, deliver, cancel) | [docs](docs/chapter-11-admin-orders.md) |

## Run the finished app

**Requirements:** Node.js 18+, MongoDB running locally (or a MongoDB Atlas URL).

```bash
# 1. Backend (terminal 1)
cd server
npm install
cp .env.example .env        # Windows: copy .env.example .env
npm run seed                # sample products + demo users
npm run dev                 # http://localhost:5050

# 2. Frontend (terminal 2)
cd client
npm install
npm run dev                 # http://localhost:3000
```

### Demo accounts (created by `npm run seed`)
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@store.com | admin123 |
| Customer | student@store.com | student123 |

## Project structure

```
server/src/
  server.js        starts the app
  app.js           middleware + mounts routes
  config/db.js     MongoDB connection
  models/          Product, User, Order (data shape)
  controllers/     product, auth, order (business logic)
  routes/          URL -> controller mapping
  middleware/      auth (protect, admin), error handling
  seed.js          sample data
client/src/
  main.jsx         providers + router
  App.jsx          route list
  api/axios.js     axios instance + token interceptor
  context/         CartContext, AuthContext (global state)
  components/      Navbar, ProductCard, ProtectedRoute
  pages/           Home, ProductDetails, Cart, Login, Register, Profile, Checkout, MyOrders, Admin, AdminOrders
```

## API summary

| Method | URL | Access |
|--------|-----|--------|
| GET | `/api/health` | public |
| GET | `/api/products` | public |
| GET | `/api/products/:id` | public |
| POST | `/api/products` | admin |
| PUT | `/api/products/:id` | admin |
| DELETE | `/api/products/:id` | admin |
| POST | `/api/auth/register` | public |
| POST | `/api/auth/login` | public |
| GET | `/api/auth/me` | logged in |
| POST | `/api/orders` | logged in |
| GET | `/api/orders/mine` | logged in |
| GET | `/api/orders` | admin |
| PUT | `/api/orders/:id/status` | admin |

## Ports
The backend uses **5050** and the frontend **3000** so they do not clash with
other projects that commonly use 5000 / 5173. Change `PORT` in `server/.env`
and the proxy in `client/vite.config.js` together if needed.
