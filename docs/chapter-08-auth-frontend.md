# Chapter 08 - Authentication Frontend (Login, Register, Protected Pages)

**Branch:** `chapter-08-auth-frontend`

## Learning goal
Connect the React app to the auth API: log in, remember the user, send the
token automatically, and block pages for guests.

## Files added or changed
```
client/src/
  context/AuthContext.jsx       NEW      user state + login / register / logout
  components/ProtectedRoute.jsx NEW      redirects guests to /login
  pages/Login.jsx               NEW      login form
  pages/Register.jsx            NEW      register form
  pages/Profile.jsx             NEW      calls protected /api/auth/me
  api/axios.js                  CHANGED  interceptor adds "Authorization: Bearer <token>"
  components/Navbar.jsx         CHANGED  shows Login, or "Hi, name" + Logout
  App.jsx                       CHANGED  routes /login, /register, /profile
  main.jsx                      CHANGED  wraps app in <AuthProvider>
```

## Key concepts

### 1. Same pattern as the cart
`AuthContext` works exactly like `CartContext` from chapter 06: state in a
provider, saved in localStorage, read anywhere with `useAuth()`. Once students
know the pattern, every new global feature looks the same.

### 2. The interceptor: add the token once, for every request
```js
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});
```
No page has to remember to send the token. `Profile.jsx` just calls
`api.get('/auth/me')` and it works.

### 3. Protecting pages
```jsx
<Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
```
`ProtectedRoute` checks `user`. If it is missing, it redirects to `/login` and
remembers where you came from (`state.from`), so after login you go back there.

> Frontend protection is only for **user experience**. Real security is the
> `protect` middleware on the server (chapter 07).

### 4. Showing API errors in forms
```js
catch (err) { setError(err.response?.data?.message || err.message); }
```
The message comes straight from our backend (e.g. "Invalid email or password").

## How to run
Server + client as usual. Then:
1. Click **Login** and use `student@store.com` / `student123`.
2. The Navbar shows "Hi, Student". Click it to open the profile.
3. Logout, then open http://localhost:3000/profile directly. You are sent to login.

## Exercise
1. Show an "Admin" badge in the Navbar when `user.isAdmin` is true.
2. Add a response interceptor that calls logout when the server returns 401.
