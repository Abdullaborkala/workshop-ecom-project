# Chapter 05 - Product UI (Cards, Grid, Details Page)

**Branch:** `chapter-05-product-ui`

## Learning goal
Turn the plain list into a real shop page, using a **reusable component**
and a **dynamic route** for the product details page.

## Files added or changed
```
client/src/
  index.css                   NEW      all styles in one small file
  components/ProductCard.jsx  NEW      one product tile (image, name, price)
  pages/ProductDetails.jsx    NEW      full product page at /product/:id
  pages/Home.jsx              CHANGED  renders a grid of ProductCard
  App.jsx                     CHANGED  new route /product/:id
  main.jsx                    CHANGED  imports index.css
```

## Key concepts

### 1. Reusable component with props
```jsx
// Home.jsx
{products.map((p) => <ProductCard key={p._id} product={p} />)}

// ProductCard.jsx
export default function ProductCard({ product }) { ... }
```
`ProductCard` knows nothing about where the data comes from. It just shows the
`product` it receives. We could reuse it in a "related products" section later.

### 2. Dynamic route + useParams
```jsx
<Route path="/product/:id" element={<ProductDetails />} />

const { id } = useParams();          // reads :id from the URL
api.get(`/products/${id}`)            // calls the backend from chapter 03
```

### 3. Three UI states: loading, error, data
```jsx
if (error) return <p className="error">{error}</p>;
if (!product) return <p>Loading...</p>;
return <div className="details">...</div>;
```

## How to run
Same as chapter 04 (server + client). Open http://localhost:3000, click any
product, and you land on `/product/<id>`.

## Exercise
1. Add a "Back to products" link on the details page.
2. Show an "Out of stock" badge on the `ProductCard` when `countInStock` is 0.
