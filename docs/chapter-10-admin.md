# Chapter 10 - Admin Panel (Product CRUD)

**Branch:** `chapter-10-admin`

## Learning goal
Let an admin create, edit and delete products. See how easily new features plug
into the existing modules: **one controller, one route file, one page**.

## Files added or changed
```
server/src/
  controllers/productController.js  CHANGED  createProduct, updateProduct, deleteProduct
  routes/productRoutes.js           CHANGED  POST / PUT / DELETE guarded by protect + admin
client/src/
  pages/Admin.jsx                   NEW      form (add/edit) + products table (edit/delete)
  components/ProtectedRoute.jsx     CHANGED  adminOnly option
  components/Navbar.jsx             CHANGED  "Admin" link for admins
  App.jsx                           CHANGED  route /admin
  index.css                         CHANGED  small spacing/font tweaks for forms and buttons
README.md                           CHANGED  run instructions, API summary, demo accounts
```

## Key concepts

### 1. CRUD maps to HTTP methods
| Action | Method | URL | Who |
|--------|--------|-----|-----|
| Read all | GET | `/api/products` | everyone |
| Read one | GET | `/api/products/:id` | everyone |
| Create | POST | `/api/products` | admin |
| Update | PUT | `/api/products/:id` | admin |
| Delete | DELETE | `/api/products/:id` | admin |

### 2. Middleware chain = layered security
```js
router.post('/', protect, admin, createProduct);
```
Each function runs in order. If `protect` fails you get **401**. If `admin`
fails you get **403**. The controller only runs for a logged-in admin. We wrote
this middleware in chapter 07 and are only now reusing it. That is the payoff
of modular code.

### 3. Whitelisting fields
```js
const pickFields = ({ name, description, price, image, countInStock }) =>
  ({ name, description, price, image, countInStock });
```
Only known fields reach the database, so extra junk in the request body is ignored.

### 4. One form for create and edit
`Admin.jsx` keeps `editingId` in state. If it is `null` the form calls `POST`,
otherwise it calls `PUT /products/:id`. After saving, it reloads the list.

### 5. Role-based route on the frontend
```jsx
<Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
```

## How to run
Log in as `admin@store.com` / `admin123`, then click **Admin** in the Navbar.
Add a product, edit its price, delete it. Check the Home page after each step.

Log in as `student@store.com` and open `/admin`. You are redirected. Calling the
API directly with the student token returns `403 Admin only`.

## Exercise
1. Add `GET /api/orders` (admin only) and an "All Orders" table on the Admin page.
2. Let the admin change an order status to "Shipped" or "Delivered".
