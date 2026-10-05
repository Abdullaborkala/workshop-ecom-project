# Store2 - A Simple MERN E-commerce (Chapter-wise Course)

A very small e-commerce website built **step by step** to teach how a full-stack
app is created in a **modular** way.

- **Frontend:** React (Vite) + React Router + Axios
- **Backend:** Node.js + Express + Mongoose (MongoDB) + JWT

Every chapter lives on its **own git branch**. Each branch is created from the
previous one, so you can jump to any lesson and see the code exactly as it was
at the end of that lesson.

## How to use this repo

```bash
git branch -a                      # list all chapter branches
git checkout chapter-01-setup      # go to a chapter
git diff chapter-02-backend-setup chapter-03-product-api   # what a chapter added
```

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
