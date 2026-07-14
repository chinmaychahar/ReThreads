# ReThreads

An adaptive clothing platform powered by a donation-to-storefront pipeline. Donors contribute used clothing, volunteers convert them into adaptive garments (magnetic closures, velcro, side zips, etc.), and the platform sells them affordably to people with special needs.

First Runners-up pitch in NetApp Women Innovathon 2023.

---

## How It Works

1. **Donors** submit used clothing through the platform
2. **System** assigns donations to the best-fit volunteer using a weighted scoring algorithm
3. **Volunteers/NGOs** redesign, sanitize, and seal garments into adaptive clothing
4. **Admin** reviews quality and approves listings
5. **Buyers** purchase affordable adaptive clothing; get notified when matching items become available

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 17, Redux + Thunk, React Router v5, Bootstrap 5 |
| Backend API | Express.js (layered architecture: routes/controllers/services/repositories) |
| Database + Auth | Appwrite Cloud (9 collections, JWT auth, file storage) |
| Validation | Zod |
| Events | Node.js EventEmitter (async side-effects) |
| Caching | node-cache (in-memory, TTL-based) |

---

## Architecture

```
React Frontend (localhost:3000)
  ├── Appwrite Client SDK → Auth, sessions, realtime
  └── fetch() → Express API (localhost:4000)
                  ├── middleware/ (auth, roleGuard, validate, rateLimiter)
                  ├── controllers/ (thin HTTP layer)
                  ├── services/ (business logic, algorithms)
                  ├── repositories/ (Appwrite DB abstraction)
                  └── events/ (EventEmitter for async work)
```

---

## Key Features

- **Donation Processing Pipeline** -- Multi-stage state machine (received → assigned → converting → converted → quality_check → listed)
- **Volunteer Assignment Algorithm** -- Weighted scoring across specialization, capacity, track record, category experience, and proximity
- **Buyer Request Matching** -- Notifies buyers when a product matching their needs gets listed (category, adaptive type, size, urgency, budget)
- **Content-Based Recommendations** -- Similarity scoring on product attributes with in-memory caching
- **Order Pipeline** -- Stock validation, 18% GST calculation, atomic reservation with rollback on failure
- **Role-Based Access** -- Buyer, donor, volunteer, admin roles with route-level guards
- **Event-Driven Side Effects** -- Decoupled async processing (auto-assign volunteers, auto-list products, auto-match buyers)

---

## Setup Guide

### Prerequisites

- Node.js 16+
- An Appwrite Cloud account (free tier)

### 1. Clone and install

```bash
git clone https://github.com/chinmaychahar/ReThreads.git
cd ReThreads
npm install
cd server && npm install && cd ..
```

### 2. Configure environment

Copy the example env and fill in your Appwrite credentials:

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:
```
PORT=4000
APPWRITE_ENDPOINT=https://sgp.cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=<your-project-id>
APPWRITE_API_KEY=<your-api-key>
APPWRITE_DATABASE_ID=rethreads
FRONTEND_URL=http://localhost:3000
```

Create a root `.env`:
```
REACT_APP_API_URL=http://localhost:4000
REACT_APP_APPWRITE_ENDPOINT=https://sgp.cloud.appwrite.io/v1
REACT_APP_APPWRITE_PROJECT_ID=<your-project-id>
```

### 3. Set up database

```bash
cd server
node src/scripts/setupCollections.js   # Creates 9 collections
node src/scripts/seedProducts.js       # Seeds 32 products
```

### 4. Run

Terminal 1 (backend):
```bash
cd server && npm run dev
```

Terminal 2 (frontend):
```bash
npm start
```

Open http://localhost:3000

---

## Project Structure

```
ReThreads/
  src/
    components/       (React UI components)
    redux/            (store, reducers, actions with thunks)
    config/           (API and Appwrite client config)
  server/
    src/
      config/         (Appwrite SDK, env validation)
      middleware/     (auth, roleGuard, validate, rateLimiter, errorHandler)
      routes/         (Express route definitions)
      controllers/    (HTTP layer, thin)
      services/       (business logic, algorithms)
      repositories/   (Appwrite DB abstraction)
      schemas/        (Zod validation schemas)
      events/         (EventEmitter bus + handlers)
      scripts/        (DB setup and seed scripts)
      utils/          (errors, logger, pagination)
```

---

## API Endpoints

| Group | Routes |
|-------|--------|
| Products | GET /api/products, /featured, /category/:cat, /:id |
| Search | GET /api/search?q=&category=&adaptiveType=&minPrice=&maxPrice= |
| Orders | POST /api/orders, GET /api/orders, /:id, PATCH /:id/cancel |
| Donations | POST /api/donations, GET /mine, /status/:status, /:id |
| Volunteer | POST /register, GET /assignments, PATCH /assignments/:id |
| Buyer Requests | POST /api/buyer-requests, GET /mine, DELETE /:id |
| Recommendations | GET /api/recommendations/:productId, /personalized |
| Contact | POST /api/contact |
| Admin | GET/PATCH donations, orders, messages (role-guarded) |

---

## Societal Impact

Aligns with UN Sustainable Development Goals:
- Responsible Consumption and Production (Goal 12)
- Climate Action (Goal 13)

---

## License

[MIT License](https://github.com/chinmaychahar/ReThreads/blob/main/LICENSE)
