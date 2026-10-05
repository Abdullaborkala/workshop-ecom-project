# Chapter 02 - Backend Setup (Express + MongoDB)

**Branch:** `chapter-02-backend-setup`

## Learning goal
Create the Express server, connect it to MongoDB, and split the code into small
modules that each do one job.

## Files added
```
server/
  package.json          scripts + dependencies
  .env.example          sample environment variables (copy to .env)
  src/
    server.js           entry point: load env, connect DB, start listening
    app.js              builds the Express app (middleware + routes)
    config/db.js        MongoDB connection with Mongoose
    middleware/error.js 404 handler + central error handler
```

## Key concept: separate "what the app is" from "how it starts"

`app.js` only **builds** the app. `server.js` only **starts** it.

```js
// server.js
connectDB()
  .then(() => app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)));
```

Why split?
- `app.js` can be imported in tests without opening a port.
- Database code lives in one place (`config/db.js`), so switching to MongoDB Atlas
  means changing only `MONGO_URI` in `.env`.
- Error handling lives in one middleware file instead of `try/catch` everywhere.
  (Express 5 automatically forwards errors thrown in `async` handlers to it.)

### Middleware order matters
```js
app.use(cors());            // 1. allow the React app to call us
app.use(express.json());    // 2. parse JSON request bodies
app.get('/api/health', ...) // 3. routes
app.use(notFound);          // 4. nothing matched -> 404
app.use(errorHandler);      // 5. any error -> JSON response
```

### Environment variables
Secrets and settings live in `.env` (never committed). `.env.example` shows
which variables are needed.

## How to run
```bash
cd server
npm install
cp .env.example .env      # Windows: copy .env.example .env
npm run dev               # nodemon restarts on file changes
```
Make sure MongoDB is running, then open http://localhost:5050/api/health

Expected: `{"status":"ok"}`. Any other URL returns a 404 JSON message.

## Exercise
1. Add a route `GET /api/time` that returns the current server time.
2. Stop MongoDB and start the server. What happens, and which file handles it?
