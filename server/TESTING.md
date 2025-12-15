# Testing Guide for Hisi Studio Backend

## Quick Test

### 1. Start the Flask Server

```bash
cd server
pipenv run flask run
```

The server will start at: `http://localhost:5000`

### 2. Run the Test Script

In a new terminal:

```bash
cd server
./test_api.sh
```

This script tests 12 major endpoints including:
- ✅ Health check
- ✅ User registration
- ✅ User login
- ✅ Product listing
- ✅ Categories
- ✅ Guest cart
- ✅ CMS pages
- ✅ Blog posts
- ✅ Site settings
- ✅ Newsletter subscription
- ✅ Contact form

---

## Manual Testing with cURL

### Authentication Flow

#### 1. Register a New User
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123!",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "customer"
    },
    "access_token": "eyJ0...",
    "refresh_token": "eyJ0..."
  }
}
```

#### 2. Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123!"
  }'
```

**Save the `access_token` from the response for authenticated requests!**

#### 3. Get Current User Profile
```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  http://localhost:5000/api/v1/auth/me
```

---

### Product Endpoints

#### List Products with Filters
```bash
# Basic list
curl http://localhost:5000/api/v1/products

# With pagination
curl "http://localhost:5000/api/v1/products?page=1&per_page=12"

# With search
curl "http://localhost:5000/api/v1/products?search=jacket"

# With category filter
curl "http://localhost:5000/api/v1/products?category=jackets"

# With price range
curl "http://localhost:5000/api/v1/products?min_price=50&max_price=200"

# Featured products only
curl "http://localhost:5000/api/v1/products?featured=true"

# With sorting
curl "http://localhost:5000/api/v1/products?sort_by=price&sort_order=asc"
```

#### Get Single Product
```bash
# By ID
curl http://localhost:5000/api/v1/products/PRODUCT_ID

# By slug
curl http://localhost:5000/api/v1/products/slug/adaptive-bomber-jacket
```

#### List Categories
```bash
curl http://localhost:5000/api/v1/products/categories
```

---

### Cart Endpoints (Works for Guest & Authenticated Users)

#### Get Cart
```bash
curl http://localhost:5000/api/v1/cart
```

#### Add to Cart
```bash
curl -X POST http://localhost:5000/api/v1/cart/items \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "PRODUCT_UUID",
    "quantity": 2
  }'
```

#### Update Cart Item Quantity
```bash
curl -X PUT http://localhost:5000/api/v1/cart/items/ITEM_ID \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 3
  }'
```

#### Remove from Cart
```bash
curl -X DELETE http://localhost:5000/api/v1/cart/items/ITEM_ID
```

#### Clear Cart
```bash
curl -X DELETE http://localhost:5000/api/v1/cart
```

#### Validate Cart (Before Checkout)
```bash
curl -X POST http://localhost:5000/api/v1/cart/validate
```

#### Merge Guest Cart After Login
```bash
curl -X POST http://localhost:5000/api/v1/cart/merge \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### Address Endpoints (Requires Authentication)

#### Create Address
```bash
curl -X POST http://localhost:5000/api/v1/addresses \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Doe",
    "phone": "+254712345678",
    "address_line1": "123 Main Street",
    "address_line2": "Apt 4B",
    "city": "Nairobi",
    "state_province": "Nairobi County",
    "postal_code": "00100",
    "country": "Kenya",
    "address_type": "both",
    "is_default": true
  }'
```

#### List Addresses
```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  http://localhost:5000/api/v1/addresses
```

#### Update Address
```bash
curl -X PUT http://localhost:5000/api/v1/addresses/ADDRESS_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Updated",
    "phone": "+254712345678"
  }'
```

#### Set Default Address
```bash
curl -X PUT http://localhost:5000/api/v1/addresses/ADDRESS_ID/set-default \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Delete Address
```bash
curl -X DELETE http://localhost:5000/api/v1/addresses/ADDRESS_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### Order Endpoints (Requires Authentication)

#### Create Order from Cart
```bash
curl -X POST http://localhost:5000/api/v1/orders \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "shipping_address_id": "ADDRESS_UUID",
    "billing_address_id": "ADDRESS_UUID",
    "notes": "Please deliver after 5 PM"
  }'
```

#### List My Orders
```bash
# All orders
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  http://localhost:5000/api/v1/orders

# Filter by status
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  "http://localhost:5000/api/v1/orders?status=pending"

# With pagination
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  "http://localhost:5000/api/v1/orders?page=1&per_page=10"
```

#### Get Order Details
```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  http://localhost:5000/api/v1/orders/ORDER_ID
```

#### Cancel Order
```bash
curl -X PUT http://localhost:5000/api/v1/orders/ORDER_ID/cancel \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Changed my mind"
  }'
```

---

### Admin Endpoints (Requires Admin Role)

#### List All Orders (Admin)
```bash
curl -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" \
  "http://localhost:5000/api/v1/orders/admin/orders?page=1"
```

#### Update Order Status (Admin)
```bash
curl -X PUT http://localhost:5000/api/v1/orders/admin/orders/ORDER_ID/status \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "shipped",
    "notes": "Shipped via DHL"
  }'
```

#### Add Tracking Number (Admin)
```bash
curl -X PUT http://localhost:5000/api/v1/orders/admin/orders/ORDER_ID/tracking \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tracking_number": "DHL123456789"
  }'
```

#### Create Product (Admin)
```bash
curl -X POST http://localhost:5000/api/v1/products \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Adaptive Bomber Jacket",
    "slug": "adaptive-bomber-jacket",
    "description": "Stylish bomber jacket with magnetic closures",
    "price": 89.99,
    "original_price": 120.00,
    "sku": "HSJ-001",
    "stock_quantity": 50,
    "category_id": "CATEGORY_UUID",
    "accessibility_features": ["Magnetic closures", "Easy grip zippers"],
    "main_image": "https://example.com/image.jpg",
    "is_featured": true,
    "badge": "New"
  }'
```

---

### CMS Endpoints

#### Get Published Pages
```bash
curl http://localhost:5000/api/v1/pages
```

#### Get Page by Slug
```bash
curl http://localhost:5000/api/v1/pages/about-us
```

#### Create Page (Admin)
```bash
curl -X POST http://localhost:5000/api/v1/admin/pages \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "About Us",
    "slug": "about-us",
    "content": "<h1>About Hisi Studio</h1><p>Content here...</p>",
    "meta_title": "About Us - Hisi Studio",
    "meta_description": "Learn about Hisi Studio",
    "is_published": true
  }'
```

#### Get Blog Posts
```bash
curl "http://localhost:5000/api/v1/blog?page=1&per_page=10"
```

#### Get Blog Post by Slug
```bash
curl http://localhost:5000/api/v1/blog/adaptive-fashion-trends-2024
```

---

### Newsletter & Contact

#### Subscribe to Newsletter
```bash
curl -X POST http://localhost:5000/api/v1/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

#### Unsubscribe from Newsletter
```bash
curl -X POST http://localhost:5000/api/v1/newsletter/unsubscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

#### Submit Contact Form
```bash
curl -X POST http://localhost:5000/api/v1/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+254712345678",
    "subject": "Product Inquiry",
    "message": "I would like to know more about your products..."
  }'
```

#### Get Site Settings
```bash
curl http://localhost:5000/api/v1/settings
```

---

## Creating an Admin User

To test admin endpoints, you need to create an admin user in the database:

```bash
# Enter Flask shell
cd server
pipenv run flask shell

# Run Python commands
>>> from app.models import User
>>> from app.extensions import db
>>> import uuid
>>> from werkzeug.security import generate_password_hash
>>>
>>> admin = User(
...     id=str(uuid.uuid4()),
...     email='admin@hisi.com',
...     password_hash=generate_password_hash('Admin123!'),
...     first_name='Admin',
...     last_name='User',
...     role='admin',
...     is_active=True
... )
>>> db.session.add(admin)
>>> db.session.commit()
>>> print(f"Admin created: {admin.email}")
>>> exit()
```

Now you can login with:
- Email: `admin@hisi.com`
- Password: `Admin123!`

---

## Testing with Postman

1. **Import the API**: Create a new collection in Postman
2. **Set Environment Variables**:
   - `base_url`: `http://localhost:5000`
   - `access_token`: (set after login)

3. **Add Authorization**:
   - Type: Bearer Token
   - Token: `{{access_token}}`

4. **Test Flow**:
   - Register → Login → Save token
   - Test authenticated endpoints
   - Test admin endpoints (with admin token)

---

## Common Issues

### 1. "Product not found" when adding to cart
**Solution**: Create some products first using the admin product creation endpoint

### 2. "Address not found" when creating order
**Solution**: Create an address first using the addresses endpoint

### 3. "Cannot cancel order that has been shipped"
**Solution**: Orders can only be cancelled if status is pending, confirmed, or processing

### 4. "Admin access required"
**Solution**: Make sure you're using an admin user's access token

---

## Next Steps

1. ✅ Backend is fully functional
2. Create seed data for testing (products, categories)
3. Set up frontend integration
4. Implement payment gateway (Flutterwave)
5. Set up email notifications
6. Deploy to production

For complete API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
