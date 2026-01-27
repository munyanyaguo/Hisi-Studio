# Hisi Studio - Codebase Review & Cleanup Plan

**Date:** 2026-01-27
**Scope:** Full backend (Flask) + frontend (React) analysis
**Overall Grade:** 6.5/10 - Functional but over-engineered for current scope

---

## Executive Summary

The codebase works, and the foundational patterns (factory pattern, service layer, context API) are sound. However, the project is significantly over-engineered for its actual scope: a fashion brand e-commerce site with shop, blog, press, contact, and admin sections.

**Key numbers:**

| Metric | Current | Recommended |
|--------|---------|-------------|
| Database models | 33 | ~18 |
| API endpoints | 60+ | ~35-40 |
| React files | 80+ | ~50 |
| Backend dependencies | 29 | ~15 |
| Tests | 0 | Critical paths covered |
| Custom frontend hooks | 0 | 3-5 |

**The stack (Flask + React) is fine.** The problems are code duplication, over-modeling, and missing fundamentals (tests, logging, validation). Changing the stack won't fix these - focused cleanup will.

---

## Backend Issues

### 1. Excessive Models (33 total)

The project has 33 database models across 12 files. For a fashion brand site, ~18 is sufficient.

**Models that can be consolidated:**

| Current Models | Merge Into |
|----------------|-----------|
| FAQ, Testimonial, Consultation | Single `ContactEntry` with a `type` field |
| Exhibition, SpeakingEngagement, Collaboration | Single `PressEvent` with a `type` field |
| MediaKitItem, MediaKitConfig | Single `MediaKit` model |
| PressHero, PressContact | Fold into `SiteSetting` or `Page` |

**Current model list for reference:**
User, Product, Category, Order, OrderItem, Cart, CartItem, UserAddress, Payment, Page, BlogPost, BlogCategory, SiteSetting, NewsletterSubscriber, ContactMessage, Consultation, FAQ, Testimonial, Notification, MediaFile, Message, ProductCollection, Review, SectionContent, PressHero, MediaCoverage, PressRelease, Exhibition, SpeakingEngagement, Collaboration, MediaKitItem, MediaKitConfig, PressContact

### 2. Route Files Are Too Fat

Routes contain business logic that belongs in service classes.

**Worst offenders:**

| File | Lines | Endpoints | Problem |
|------|-------|-----------|---------|
| `routes/press.py` | 957 | 33 | Enormous - needs service extraction |
| `routes/contact.py` | 771 | 22 | Same filtering/pagination logic repeated |
| `routes/admin.py` | 721 | 14 | Business logic mixed with HTTP handling |
| `routes/cms.py` | 616 | — | Similar issues |

**Example of repeated pattern** (found in 10+ endpoints):

```python
# This exact pattern is copy-pasted across routes
@bp.route('/endpoint')
def get_items():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    search = request.args.get('search', '')

    query = Model.query.filter_by(is_active=True)
    if search:
        query = query.filter(Model.name.ilike(f'%{search}%'))

    pagination = query.paginate(page=page, per_page=per_page)

    try:
        return success_response(data=[item.to_dict() for item in pagination.items])
    except Exception as e:
        return error_response(str(e), status_code=500)
```

**Fix:** Extract to a `QueryService` or pagination helper that all routes share.

### 3. Inconsistent Error Handling

Three different error handling patterns are used across the codebase:

```python
# Pattern 1 (products.py) - raw jsonify
return jsonify({'error': str(e)}), 500

# Pattern 2 (orders.py) - helper function
return error_response(str(e), status_code=500)

# Pattern 3 (some routes) - no error handling at all
```

**Fix:** Standardize on one pattern. Register a global error handler:

```python
@app.errorhandler(Exception)
def handle_error(error):
    app.logger.error(f"Unhandled: {error}", exc_info=True)
    return error_response("Internal server error", 500)
```

### 4. No Logging

Every exception is caught and returned as JSON. Nothing is logged. In production, this means:
- No way to diagnose failures
- No audit trail
- No request/response monitoring

**Fix:** Add Flask's built-in logging:

```python
import logging
logger = logging.getLogger(__name__)

# In routes:
logger.error("Payment failed for order %s", order_id, exc_info=True)
```

### 5. No Input Validation

All routes use `request.get_json()` data directly with no validation or sanitization.

```python
data = request.get_json()
product.name = data.get('name')  # No validation
product.price = data.get('price')  # Could be a string, negative, etc.
```

A `validators.py` file exists but appears unused.

**Fix:** Use the existing validators or add marshmallow/pydantic schemas for request validation.

### 6. N+1 Query Potential

No eager loading is used. Example from `admin.py`:

```python
query = query.join(User).filter(...)
# But User data is accessed later without joinedload
# Each order triggers a separate User query
```

**Fix:** Add `joinedload()` for related models in list queries.

### 7. Unused/Problematic Dependencies

| Package | Issue |
|---------|-------|
| `rave-python==1.4.2` | Abandoned (last update 2018). Code uses `requests` directly instead |
| `redis==7.1.0` | Imported but Redis isn't configured or running |
| `pycryptodome==3.23.0` | Unclear usage, possibly leftover |

**Fix:** Remove from `requirements.txt` and verify nothing breaks.

### 8. Hardcoded Business Logic

```python
# order_service.py
if address.get('country', '').lower() in ['nigeria', 'kenya']:
    return 1500.00  # Local shipping
else:
    return 5000.00  # International shipping
```

Shipping rates, supported countries, and similar business rules are hardcoded. A `SiteSetting` model exists but isn't used for this.

---

## Frontend Issues

### 1. Zero Custom Hooks (Biggest Win)

10+ pages repeat this identical pattern:

```javascript
const [items, setItems] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [pagination, setPagination] = useState({ page: 1, per_page: 10 });

useEffect(() => { fetchItems(); }, [pagination.page]);

const fetchItems = async () => {
    try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/v1/...`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setItems(data.items);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        setLoading(false);
    }
};
```

**Fix:** Extract one hook:

```javascript
// hooks/useFetchList.js
const useFetchList = (endpoint, options = {}) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({...});
    // ... shared fetch logic
    return { items, loading, pagination, refetch };
};
```

This would reduce each admin page from ~250 lines to ~50 lines.

### 2. Admin Pages Are Copy-Pasted

| Page | Lines | Pattern |
|------|-------|---------|
| `ProductsPage.jsx` | 280 | fetch + filter + table + pagination |
| `OrdersPage.jsx` | 237 | fetch + filter + table + pagination |
| `CustomersPage.jsx` | 136 | fetch + filter + table + pagination |
| `InquiriesPage.jsx` | 231 | fetch + filter + table + pagination |

All four pages follow the same structure. A generic `AdminListPage` component or the `useFetchList` hook above would eliminate most of this duplication.

### 3. Oversized Editor Components

| Component | Lines | Problem |
|-----------|-------|---------|
| `PressManagementPage.jsx` | 801 | Should be 3-4 smaller components |
| `ProductEditor.jsx` | 544 | Form, preview, media should be split |
| `BlogPostEditor.jsx` | 484 | Same issue |

### 4. State Management Inconsistency

- **Cart:** Uses Context API (global) - good
- **Auth:** Uses Context API (global) - good
- **Everything else:** Local `useState` in each page with duplicated fetch logic

This isn't necessarily wrong, but the lack of shared hooks means every page reinvents data fetching.

### 5. Unused Dependency: axios

`axios` is in `package.json` but every API call uses the native `fetch` API. Remove it to reduce bundle size.

### 6. No Error Boundaries

All errors are caught with `console.error()` and silently swallowed. Users see a blank page or stale data with no indication of failure.

```javascript
} catch (error) {
    console.error('Error fetching products:', error);
    // User sees nothing
}
```

**Fix:** Add React Error Boundaries for crash recovery, and show user-facing error messages.

### 7. Heavy Imports Not Code-Split

`react-quill` (rich text editor) and `recharts` (charts) are imported statically but only used on 1-2 pages. They should use `React.lazy()` to avoid bloating the main bundle.

---

## Security Concerns

1. **No input validation** on any API endpoint - SQL injection risk is mitigated by SQLAlchemy ORM, but business logic errors are possible
2. **All exceptions expose `str(e)`** to clients - can leak internal details
3. **`rave-python` is unmaintained** (2018) - potential vulnerability
4. **No rate limiting** on auth endpoints
5. **No CSRF protection** (mitigated by JWT, but worth noting)

---

## What's Actually Good

- **Application factory pattern** - proper Flask app structure
- **Service layer** (OrderService, PaymentService, CartService) - right pattern, needs expansion
- **JWT auth middleware** - properly implemented
- **React Router v7** - clean routing setup
- **Vite** - fast development experience
- **Tailwind CSS** - consistent styling approach
- **CartContext / AuthContext** - good use of React Context for global state
- **API service files** (cartApi.js, orderApi.js, etc.) - clean separation

---

## Recommended Cleanup Priority

### Phase 1: Quick Wins (High Impact, Low Effort)

- [ ] Remove unused dependencies (`rave-python`, `redis`, `axios`, `pycryptodome`)
- [ ] Standardize error handling to one pattern across all routes
- [ ] Add basic Flask logging
- [ ] Extract `useFetchList` custom hook for frontend
- [ ] Add `.env.example` files for both client and server

### Phase 2: Code Reduction (High Impact, Medium Effort)

- [ ] Extract `QueryService` / pagination helper for backend routes
- [ ] Consolidate models (33 -> ~18)
- [ ] Squash migrations into a single clean migration
- [ ] Create generic `AdminListPage` component or shared hook
- [ ] Split oversized components (PressManagementPage, ProductEditor, BlogPostEditor)
- [ ] Add `React.lazy()` for heavy imports (quill, recharts)

### Phase 3: Fundamentals (Critical for Production)

- [ ] Add input validation (marshmallow or pydantic schemas)
- [ ] Add tests for critical paths (auth, cart, orders, payments)
- [ ] Add eager loading (`joinedload`) for list queries
- [ ] Add React Error Boundaries
- [ ] Add rate limiting on auth endpoints
- [ ] Move hardcoded business logic to config/database

### Phase 4: Nice to Have

- [ ] API documentation (Swagger/OpenAPI)
- [ ] Development script (Makefile or docker-compose for local dev)
- [ ] CI/CD pipeline with test runner
- [ ] Performance monitoring setup

---

## Stack Decision

**Recommendation: Keep Flask + React.** The problems are implementation-level, not stack-level. A rewrite to Next.js or Django would cost significant time and introduce the same issues if the same patterns are followed.

Focus cleanup effort on reducing duplication and adding missing fundamentals. A disciplined cleanup of the current codebase will yield better results than a stack migration.




Stack Verdict: Flask + React is fine — the problem is over-engineering
The codebase has 33 models, 60+ endpoints, and 80+ React files for what is fundamentally a 5-6 page e-commerce site with an admin panel. Changing the stack won't fix that. Here's what will:

High-Impact Cleanup (what I'd actually recommend doing)
1. Backend: Duplicated patterns everywhere

Every route file repeats the same fetch → filter → paginate → error-catch logic. A single QueryBuilder service and error handler decorator would cut ~30% of route code.
Routes like press.py (957 lines, 33 endpoints) and contact.py (771 lines) are doing work that belongs in service classes.
2. Frontend: No custom hooks

10+ pages repeat this identical pattern: useState → useEffect → fetch → setLoading → catch. One useFetchList hook would cut each admin page from ~250 lines to ~50.
CartContext.jsx and AuthContext.jsx are the only shared state. Admin pages all manage state independently with duplicated code.
3. Unused dependencies to remove

axios — installed but every file uses fetch instead
rave-python — unmaintained (last updated 2018), code uses requests directly
redis — imported but not configured or used
4. Missing fundamentals

Zero tests — any change risks breaking something
No logging — all errors silently return JSON, impossible to debug in production
No input validation — request.get_json() data is used directly with no sanitization
5. Models overkill

33 models could be ~18 by merging: FAQ + Testimonial + Consultation → single contact table, Exhibition + SpeakingEngagement + Collaboration → single events table, etc.
Should you change the stack?
Option	Pros	Cons
Keep Flask + React (recommended)	Already built, patterns are sound	Need to prune complexity
Switch to Next.js + Supabase	~40% less boilerplate, built-in auth/DB	Full rewrite, learning curve
Switch to Django + React	Better admin panel out of the box	Migration effort, similar complexity
My recommendation: Keep the current stack but clean it up. The architecture is sound — the issue is duplicated code and over-planning, not technology choice. A focused cleanup would make this significantly easier to maintain without losing any work.