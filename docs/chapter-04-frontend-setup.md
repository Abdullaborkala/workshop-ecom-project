# Chapter 04 - Frontend Setup (React + Vite + Router + Axios)

**Branch:** `chapter-04-frontend-setup`

## Learning goal
Create the React app, add page routing, and fetch products from our API.

## Files added
```
client/
  package.json            scripts + dependencies
  vite.config.js          dev server on port 3000 + proxy /api -> backend
  index.html              the single HTML page; React mounts into #root
  src/
    main.jsx              starts React, wraps the app in BrowserRouter
    App.jsx               layout + list of routes (pages)
    api/axios.js          ONE configured axios instance used everywhere
    components/Navbar.jsx top navigation bar
    pages/Home.jsx        fetches /api/products and lists them
```

> We wrote these files by hand to keep things small. `npm create vite@latest`
> creates the same structure plus some extra demo files.

## Key concepts

### 1. Pages vs components
- **pages/** = a full screen tied to a URL (`/`, `/cart`, `/login` ...)
- **components/** = reusable pieces used inside pages (`Navbar`, `ProductCard` ...)

### 2. Routing
```jsx
// App.jsx
<Routes>
  <Route path="/" element={<Home />} />
</Routes>
```
Each new page = one new `<Route>`. The `Navbar` stays outside `<Routes>`,
so it shows on every page.

### 3. One API module
```js
// api/axios.js
const api = axios.create({ baseURL: '/api' });
```
Every page calls `api.get('/products')` instead of writing the full URL.
If the backend address changes, we edit one file. (In chapter 08 we add the
login token here, once, for every request.)

### 4. The Vite proxy
The React dev server runs on `:3000`, the API on `:5050`. The proxy forwards
any `/api/...` request from the browser to the backend:
```js
server: { port: 3000, proxy: { '/api': 'http://localhost:5050' } }
```

### 5. Fetching data with useEffect
```jsx
useEffect(() => {
  api.get('/products').then((res) => setProducts(res.data));
}, []);   // [] = run once when the page loads
```

## How to run
Use two terminals:
```bash
# terminal 1
cd server && npm run dev

# terminal 2
cd client
npm install
npm run dev
```
Open http://localhost:3000. You should see a plain list of product names and prices.

## Exercise
1. Show a "Loading..." message until the products arrive.
2. Add an `About` page at `/about` and a link to it in the Navbar.
