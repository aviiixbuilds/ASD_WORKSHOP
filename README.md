# Product API Caching Workshop

A clean, modular Node.js and Express.js REST API demonstrating in-memory response caching with a 1-minute Time-To-Live (TTL), `X-Cache` response headers (`HIT` / `MISS`), and automatic cache invalidation on data mutations.

## Project Structure

```text
.
├── app.js                         # Express application configuration
├── server.js                      # Server entry point
├── package.json                   # Dependencies and npm scripts
├── routes/
│   └── productRoutes.js           # Product endpoint route definitions
├── middleware/
│   ├── cacheMiddleware.js         # Custom Map-based cache & invalidation logic
│   ├── validateProduct.js         # Request parameter and body validation
│   └── errorHandler.js            # 404 and centralized error handling
├── controllers/
│   └── productController.js       # HTTP request/response handlers
├── services/
│   └── productService.js          # Business logic layer
└── database/
    └── productsDb.js              # In-memory array database
```

## Architecture Flow

```text
Route → Middleware → Controller → Service → Database
```

## Caching Specification

- **Storage**: In-memory JavaScript `Map` (`cacheStore`)
- **Cache Keys**:
  - `GET /products` → `products`
  - `GET /products/:id` → `product-{id}`
- **TTL**: `60,000` ms (1 minute), tracked via `createdAt` timestamp on each entry
- **Headers**:
  - `X-Cache: HIT` when served from a valid (non-expired) cache entry
  - `X-Cache: MISS` when fetched fresh from the database
- **Invalidation**:
  - Successful `POST`, `PUT`, `PATCH`, and `DELETE` requests invalidate `products` and (where applicable) `product-{id}`
  - Failed requests (`400 Bad Request` or `404 Not Found`) do **not** invalidate the cache

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the Application

```bash
npm start
```

The API will start on `http://localhost:3000`.

## API Endpoints

| Method | Endpoint | Description | Cache Behavior |
| :--- | :--- | :--- | :--- |
| `GET` | `/products` | List all products | Cached under key `products` (TTL 60s) |
| `GET` | `/products/:id` | Get a single product by ID | Cached under key `product-{id}` (TTL 60s) |
| `POST` | `/products` | Create a new product | Invalidates `products` on success |
| `PUT` | `/products/:id` | Replace a product by ID | Invalidates `products` and `product-{id}` on success |
| `PATCH` | `/products/:id` | Partially update a product | Invalidates `products` and `product-{id}` on success |
| `DELETE` | `/products/:id` | Delete a product by ID | Invalidates `products` and `product-{id}` on success |
