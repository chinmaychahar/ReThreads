# ReThreads Backend Plan

## Context

ReThreads is a frontend-only React 17 adaptive clothing platform (for people with Alzheimer's, Parkinson's, Cerebral Palsy, Elderly). Currently: hardcoded product data, non-functional checkout/contact forms, Redux cart that resets on refresh, no auth. The goal is to add a production-grade backend that transforms this into a **donation-to-storefront pipeline** — donors contribute used clothing → volunteers/NGOs convert them into adaptive clothing (redesign, sanitize, seal) → platform sells them cheaply to people with special needs. This demonstrates SDE2-level system design, full-stack ownership, and domain complexity.

**The pipeline:** Donated clothes enter an intake system, get assigned to volunteers/NGOs who specialize in specific adaptive modifications (magnetic closures, velcro, side zips, etc.), then once converted and quality-checked, they become affordable product listings. Volunteers could be paid later as the platform scales.

**What makes this SDE2-caliber:** The multi-stage processing pipeline (intake → assignment → conversion → listing), donation-to-request matching algorithm (notifies buyers when their needed item becomes available), event-driven order processing, layered architecture (controller/service/repository), content-based recommendation engine, and clean separation of infrastructure (Appwrite) from business logic (Express).

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Auth + DB + Storage + Realtime | Appwrite Cloud (free tier) | Managed auth, 75K req/mo free, realtime subscriptions |
| Business Logic API | Express.js on Render (free tier) | Custom algorithms, testable, full control |
| Frontend | React 17 + Redux + redux-thunk (existing) | Add async actions, keep existing structure |
| Validation | Zod | Lightweight, TypeScript-friendly, better DX than Joi |
| Testing | Jest + supertest | Standard, good coverage tooling |
| CI/CD | GitHub Actions | Free for public repos |
| Caching | node-cache (in-memory, TTL) | Free, single-process Render deployment |

---

## Architecture Overview

```
React Frontend (Vercel/Netlify)
  ├── Appwrite SDK (direct) → Auth, Realtime subscriptions, Image uploads
  └── Custom API (fetch) → Business logic endpoints

Express API (Render)
  ├── middleware/ → auth verification (Appwrite JWT), rate limiting, validation (Zod)
  ├── controllers/ → HTTP layer (thin, ~10 lines each)
  ├── services/ → Business logic (matching, recommendations, order pipeline)
  ├── repositories/ → Appwrite DB abstraction
  └── events/ → EventEmitter bus for async side-effects
```

---

## Database Schema (Appwrite Collections)

**9 collections total:**

1. **users** — extended profile (role: buyer/donor/volunteer/admin, adaptiveNeeds, preferredSizes, address)
2. **products** — converted adaptive clothing for sale (category, adaptiveType, condition, sizes, gender, stock, sourcedonationId, convertedBy)
3. **carts** — per-user persistent cart (userId → items JSON)
4. **orders** — order records (items, totals, status, statusHistory, addresses)
5. **donations** — donated raw clothing intake (donor, category, description, images, status: received → assigned → converting → converted → listed, assignedVolunteer)
6. **volunteers** — volunteer/NGO profiles (specializations: [magnetic_closures, velcro, side_zip, open_back, elastic_waist], capacity, completedCount, rating)
7. **buyerRequests** — buyer wishlist/needs (category, adaptiveType, size, medicalCondition, urgency, status: open/matched/fulfilled, notified)
8. **contactMessages** — contact form submissions (status: unread/read/replied)
9. **reviews** — product reviews (rating, title, body)

Key indexes: compound indexes on `[status, category]` for pipeline queries, `[specializations, capacity]` for volunteer assignment, `[category, adaptiveType, size, status]` for buyer request matching, unique on userId for carts, unique on orderNumber.

---

## Key Business Logic (the SDE2 differentiators)

### 1. Donation Processing Pipeline

Multi-stage state machine:
```
received → assigned → converting → converted → quality_check → listed
                                         ↘ rejected (back to assigned or discarded)
```

**Volunteer Assignment Algorithm** — when a donation arrives, match it to the best-fit volunteer:

| Criterion | Weight | Scoring |
|-----------|--------|---------|
| Specialization match | 35 pts | volunteer has required adaptive skill = 35, related skill = 20 |
| Current capacity | 25 pts | low load = 25, medium = 15, high = 5 |
| Track record | 20 pts | completion rate × 20 |
| Past category experience | 15 pts | has converted same category before = 15, similar = 8 |
| Location proximity | 5 pts | same city = 5 (for physical pickup) |

Auto-assigns to top scorer if score >= 50. Otherwise flags for admin manual assignment.

### 2. Buyer Request Matching (Notification Engine)

When a converted item gets listed, match it against open buyer requests (100 points max):

| Criterion | Weight | Exact Match | Partial Match |
|-----------|--------|-------------|---------------|
| Category | 25 pts | exact = 25 | same parent = 15 |
| Adaptive Type | 25 pts | exact = 25 | compatible (magnetic↔velcro, side_zip↔open_back) = 15 |
| Medical Condition | 20 pts | exact = 20 | related (alzheimer↔elderly) = 10 |
| Size | 15 pts | exact = 15 | adjacent (M↔L) = 8 |
| Urgency Boost | 10 pts | high = 10, medium = 5, low = 0 |
| Price fit | 5 pts | within budget = 5 | — |

Threshold: score >= 40 to notify buyer. Returns top matches ranked by score.
Triggered on: `donation.listed` (item becomes a product) and `request.created` (check existing listings).

### 3. Order Processing Pipeline

```
validate stock → calculate totals (subtotal + 18% GST + shipping)
  → reserve stock (atomic decrement) → create order doc → emit 'order.created'
  → [async] clear cart, log analytics
  → [on failure] rollback stock, return specific availability error
```

### 4. Recommendation Engine (content-based)

Similarity scoring with weighted features:
- categoryMatch (0.30), adaptiveTypeMatch (0.25), conditionMatch (0.20), priceProximity (0.15), genderMatch (0.10)
- Personalized variant uses order history + profile adaptiveNeeds

### 5. Event-Driven Side Effects

EventEmitter bus — decouples response from async work:
- `order.created` → clear cart, future email
- `donation.received` → run volunteer assignment algorithm
- `donation.converted` → quality check, then list as product
- `donation.listed` → run buyer request matching, notify matched buyers
- `request.created` → check existing listed products for matches
- `volunteer.assigned` → notify volunteer of new assignment

---

## API Endpoints (Express)

**Products:** `GET /api/products`, `/api/products/:id`, `/api/products/featured`, `/api/products/category/:cat`
**Search:** `GET /api/search?q=&category=&adaptiveType=&condition=&minPrice=&maxPrice=&size=&sort=`
**Orders:** `POST /api/orders`, `GET /api/orders`, `GET /api/orders/:id`, `PATCH /api/orders/:id/cancel`
**Donations:** `POST /api/donations` (donor submits), `GET /api/donations/mine` (donor's history), `GET /api/donations/:id/status` (track pipeline progress)
**Volunteer:** `GET /api/volunteer/assignments` (my queue), `PATCH /api/volunteer/assignments/:id` (update status: converting/converted), `GET /api/volunteer/profile`
**Buyer Requests:** `POST /api/buyer-requests`, `GET /api/buyer-requests/mine`, `DELETE /api/buyer-requests/:id`
**Matching:** `GET /api/matching/suggestions/:requestId` (products matching a buyer request)
**Recommendations:** `GET /api/recommendations/:productId`, `GET /api/recommendations/personalized`
**Contact:** `POST /api/contact`
**Admin:** Donation pipeline management (assign volunteers, approve/reject conversions), order management, volunteer management, contact messages (role-guarded)

---

## Frontend Changes

**New dependencies:** `appwrite`, `redux-thunk`

**New Redux slices:** auth, products, cart (refactored), orders, donations, search

**Modified components:**
- `App.js` — add new routes (/login, /register, /profile, /orders, /donate, /buyer-requests, /volunteer, /search, /admin), add PrivateRoute
- `Shop.jsx`, `Product.jsx`, `Alzheimer.jsx` — fetch from API instead of importing data files
- `Checkout.jsx` — wire form to createOrder action
- `Contact.jsx` — wire form to submitContact action
- `Cart.jsx` — add quantities, sync with server
- `Header.jsx` — conditional auth nav items (role-based: buyer/donor/volunteer/admin)

**New components:** Login, Register, PrivateRoute, Profile, OrderHistory, DonateForm (donor submits clothes), DonationTracker (donor sees pipeline status), BuyerRequestForm (request specific adaptive needs), VolunteerDashboard (see assignments, update progress), MatchNotification (buyer gets notified of matching item), SearchBar, SearchResults, FilterSidebar, AdminDashboard (pipeline management, volunteer assignment)

---

## Server Directory Structure

```
server/
  src/
    index.js
    config/        (appwrite.js, env.js)
    middleware/    (auth.js, rateLimiter.js, errorHandler.js, validate.js)
    schemas/       (order, donation, product, contact — Zod)
    controllers/   (product, order, donation, volunteer, buyerRequest, recommendation, search, contact)
    services/      (product, order, donation, volunteer, matching, recommendation, search, notification, contact)
    repositories/  (product, order, donation, volunteer, buyerRequest, user, cart, contact)
    events/        (eventBus.js, handlers/)
    utils/         (errors.js, logger.js, pagination.js)
  tests/
    unit/          (matching, recommendations, order pipeline)
    integration/   (all API routes)
```

---

## Implementation Timeline (2-3 weeks)

### Week 1: Foundation
- **Days 1-2:** Server setup (Express boilerplate, Appwrite Cloud project, create all 9 collections with indexes, env config)
- **Day 3:** Authentication (Appwrite SDK in frontend, Login/Register components with role selection, auth Redux slice, JWT middleware on server)
- **Days 4-5:** Product API + migration (seed hardcoded data into Appwrite, build product endpoints, migrate Shop/Product/Alzheimer components to fetch from API)
- **Days 6-7:** Cart persistence (cart repository, sync actions, merge on login, Appwrite realtime for multi-tab, update Cart.jsx with quantities)

### Week 2: Core Features
- **Days 8-9:** Order processing (full pipeline with event bus, wire Checkout.jsx, build OrderHistory/OrderDetail)
- **Days 10-11:** Donation intake + processing pipeline (DonateForm with image upload, donation status state machine, volunteer assignment algorithm, VolunteerDashboard)
- **Days 12-13:** Buyer request matching (BuyerRequestForm, matching algorithm triggered on donation.listed, MatchNotification component, unit tests)
- **Day 14:** Contact form + Zod validation on all endpoints

### Week 3: Advanced + Ship
- **Days 15-16:** Recommendation engine (content-based scoring, caching, "You might also like" in ProductDetail, personalized on Home)
- **Day 17:** Search (multi-filter query building, SearchBar in Header, SearchResults page with FilterSidebar)
- **Day 18:** Admin panel (donation pipeline management, volunteer assignment/oversight, order management, role-guarded routes)
- **Day 19:** Realtime + polish (donation pipeline status updates, buyer match notifications, loading/error states, toasts)
- **Days 20-21:** Testing + CI/CD + deploy (Jest unit/integration, GitHub Actions, Render deploy, Appwrite production config)

---

## Deployment (all free tier)

- **Appwrite Cloud:** Auth, DB, Storage, Realtime
- **Render:** Express API (auto-deploy from main branch)
- **Vercel or Netlify:** React frontend (static build)
- **GitHub Actions:** Lint + test on push/PR

---

## Testing Strategy

**Unit tests (priority):** Volunteer assignment algorithm (all scoring scenarios), buyer request matching (all scoring scenarios), recommendation engine, order pipeline (stock validation, rollback), donation state machine (valid/invalid transitions)
**Integration tests:** Auth-guarded routes return 401, role-guarded routes (volunteer can't access admin), validation errors return 400 with details, happy paths return correct status/data, full pipeline flow (donate → assign → convert → list → buyer notified)
**Coverage target:** 70% branches, 80% functions on server/

---

## Verification Plan

1. Run `npm start` on frontend, `node src/index.js` on server — both start without errors
2. Register → Login → browse products (fetched from Appwrite) → add to cart → refresh (cart persists) → checkout → see order in history
3. **Donation pipeline:** Donor submits used clothing → admin/system assigns to volunteer → volunteer marks as converting → marks as converted → admin approves → item listed as product
4. **Buyer matching:** Buyer creates request ("need XL magnetic-closure shirt for Parkinson's") → when matching item gets listed, buyer gets notified
5. Visit product detail → see recommendations section populated
6. Search with filters → results update correctly
7. Volunteer dashboard shows assignments, can update progress
8. Contact form → submit → message appears in admin panel
9. `npm test` in server/ passes all unit + integration tests
10. GitHub Actions CI passes on push
