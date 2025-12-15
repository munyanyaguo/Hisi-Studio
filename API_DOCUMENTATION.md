# 🚀 Hisi Studio API Documentation

## Base URL
```
Development: http://localhost:5000
Production: https://your-domain.com
```

All API endpoints are prefixed with `/api/v1`

---

## 📋 Table of Contents
1. [Authentication](#authentication)
2. [Products](#products)
3. [Cart](#cart)
4. [Addresses](#addresses)
5. [Orders](#orders)
6. [CMS (Pages, Blog, Settings)](#cms)
7. [Newsletter & Contact](#newsletter--contact)

---

## 🔐 Authentication

### Register User
```http
POST /api/v1/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+2547123456789" // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { /* user object */ },
    "access_token": "eyJ0eXAiOiJKV1QiLCJh...",
    "refresh_token": "eyJ0eXAiOiJKV1QiLCJh..."
  }
}
```

### Login
```http
POST /api/v1/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

### Refresh Token
```http
POST /api/v1/auth/refresh
Authorization: Bearer {refresh_token}
```

### Get Current User
```http
GET /api/v1/auth/me
Authorization: Bearer {access_token}
```

### Update Profile
```http
PUT /api/v1/auth/me
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+2547123456789"
}
```

### Change Password
```http
POST /api/v1/auth/change-password
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "current_password": "OldPassword123!",
  "new_password": "NewPassword123!"
}
```

---

## 🛍️ Products

### List Products
```http
GET /api/v1/products?page=1&per_page=12&category=jackets&search=adaptive
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `per_page` - Items per page (default: 12)
- `category` - Filter by category slug
- `featured` - Filter featured products (true/false)
- `search` - Search in name and description
- `min_price` - Minimum price
- `max_price` - Maximum price
- `sort_by` - Sort by: price, name, created_at (default: created_at)
- `sort_order` - Sort order: asc, desc (default: desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [{ /* product objects */ }],
    "pagination": {
      "page": 1,
      "per_page": 12,
      "total_pages": 5,
      "total_items": 58,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

### Get Product by ID
```http
GET /api/v1/products/{product_id}
```

### Get Product by Slug
```http
GET /api/v1/products/slug/{slug}
```

### Create Product (Admin Only)
```http
POST /api/v1/products
Authorization: Bearer {admin_access_token}
```

**Request Body:**
```json
{
  "name": "Adaptive Bomber Jacket",
  "slug": "adaptive-bomber-jacket",
  "description": "Comfortable jacket with magnetic closures",
  "price": 89.99,
  "original_price": 120.00,
  "sku": "HSJ-001",
  "stock_quantity": 50,
  "category_id": "category-uuid",
  "accessibility_features": ["Magnetic closures", "Easy grip zippers"],
  "main_image": "https://cloudinary.com/image.jpg",
  "hover_image": "https://cloudinary.com/hover.jpg",
  "images": ["url1", "url2"],
  "is_featured": true,
  "badge": "New"
}
```

### Update Product (Admin Only)
```http
PUT /api/v1/products/{product_id}
Authorization: Bearer {admin_access_token}
```

### Delete Product (Admin Only)
```http
DELETE /api/v1/products/{product_id}
Authorization: Bearer {admin_access_token}
```

### List Categories
```http
GET /api/v1/products/categories
```

---

## 🛒 Cart

### Get Cart
```http
GET /api/v1/cart
```
*Works for both authenticated users and guests (uses session)*

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cart-uuid",
    "items": [
      {
        "id": "item-uuid",
        "product": { /* product details */ },
        "quantity": 2,
        "price": 89.99,
        "subtotal": 179.98
      }
    ],
    "item_count": 2,
    "total": 179.98
  }
}
```

### Add to Cart
```http
POST /api/v1/cart/items
```

**Request Body:**
```json
{
  "product_id": "product-uuid",
  "quantity": 1
}
```

### Update Cart Item
```http
PUT /api/v1/cart/items/{item_id}
```

**Request Body:**
```json
{
  "quantity": 3
}
```

### Remove from Cart
```http
DELETE /api/v1/cart/items/{item_id}
```

### Clear Cart
```http
DELETE /api/v1/cart
```

### Merge Carts (After Login)
```http
POST /api/v1/cart/merge
Authorization: Bearer {access_token}
```

### Validate Cart
```http
POST /api/v1/cart/validate
```

---

## 📍 Addresses

### List Addresses
```http
GET /api/v1/addresses
Authorization: Bearer {access_token}
```

### Get Address
```http
GET /api/v1/addresses/{address_id}
Authorization: Bearer {access_token}
```

### Create Address
```http
POST /api/v1/addresses
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "full_name": "John Doe",
  "phone": "+2547123456789",
  "address_line1": "123 Main Street",
  "address_line2": "Apartment 4B",
  "city": "Nairobi",
  "state_province": "Nairobi County",
  "postal_code": "00100",
  "country": "Kenya",
  "address_type": "both",
  "is_default": true
}
```

### Update Address
```http
PUT /api/v1/addresses/{address_id}
Authorization: Bearer {access_token}
```

### Delete Address
```http
DELETE /api/v1/addresses/{address_id}
Authorization: Bearer {access_token}
```

### Set Default Address
```http
PUT /api/v1/addresses/{address_id}/set-default
Authorization: Bearer {access_token}
```

---

## 📦 Orders

### Create Order
```http
POST /api/v1/orders
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "shipping_address_id": "address-uuid",
  "billing_address_id": "address-uuid", // optional, uses shipping if not provided
  "notes": "Please deliver after 5 PM" // optional
}
```

### List User Orders
```http
GET /api/v1/orders?page=1&status=pending
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `page` - Page number
- `per_page` - Items per page
- `status` - Filter by status (pending, processing, shipped, delivered, cancelled)

### Get Order Details
```http
GET /api/v1/orders/{order_id}
Authorization: Bearer {access_token}
```

### Cancel Order
```http
PUT /api/v1/orders/{order_id}/cancel
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "reason": "Changed my mind" // optional
}
```

### Admin: List All Orders
```http
GET /api/v1/orders/admin/orders?page=1&status=pending&search=HS-20231215
Authorization: Bearer {admin_access_token}
```

### Admin: Update Order Status
```http
PUT /api/v1/orders/admin/orders/{order_id}/status
Authorization: Bearer {admin_access_token}
```

**Request Body:**
```json
{
  "status": "shipped",
  "notes": "Shipped via DHL" // optional
}
```

### Admin: Add Tracking Number
```http
PUT /api/v1/orders/admin/orders/{order_id}/tracking
Authorization: Bearer {admin_access_token}
```

**Request Body:**
```json
{
  "tracking_number": "DHL123456789"
}
```

---

## 📄 CMS

### Pages

#### List Published Pages
```http
GET /api/v1/pages
```

#### Get Page by Slug
```http
GET /api/v1/pages/{slug}
```

#### Admin: List All Pages
```http
GET /api/v1/admin/pages
Authorization: Bearer {admin_access_token}
```

#### Admin: Create Page
```http
POST /api/v1/admin/pages
Authorization: Bearer {admin_access_token}
```

**Request Body:**
```json
{
  "title": "About Us",
  "slug": "about-us",
  "content": "<h1>About Hisi Studio</h1><p>...</p>",
  "meta_title": "About Us - Hisi Studio",
  "meta_description": "Learn about Hisi Studio...",
  "is_published": true
}
```

#### Admin: Update Page
```http
PUT /api/v1/admin/pages/{page_id}
Authorization: Bearer {admin_access_token}
```

#### Admin: Delete Page
```http
DELETE /api/v1/admin/pages/{page_id}
Authorization: Bearer {admin_access_token}
```

### Blog

#### List Blog Posts
```http
GET /api/v1/blog?page=1&per_page=10
```

#### Get Blog Post by Slug
```http
GET /api/v1/blog/{slug}
```

#### Admin: Create Blog Post
```http
POST /api/v1/admin/blog
Authorization: Bearer {admin_access_token}
```

**Request Body:**
```json
{
  "title": "Adaptive Fashion Trends 2024",
  "slug": "adaptive-fashion-trends-2024",
  "excerpt": "Discover the latest trends...",
  "content": "<h1>Trends</h1><p>...</p>",
  "featured_image": "https://cloudinary.com/image.jpg",
  "meta_title": "Adaptive Fashion Trends 2024",
  "meta_description": "Discover the latest adaptive fashion trends...",
  "is_published": true
}
```

#### Admin: Update Blog Post
```http
PUT /api/v1/admin/blog/{post_id}
Authorization: Bearer {admin_access_token}
```

#### Admin: Delete Blog Post
```http
DELETE /api/v1/admin/blog/{post_id}
Authorization: Bearer {admin_access_token}
```

### Settings

#### Get Public Settings
```http
GET /api/v1/settings
```

**Response:**
```json
{
  "success": true,
  "data": {
    "site_name": "Hisi Studio",
    "contact_email": "info@hisistudio.com",
    "social_media_links": {
      "facebook": "https://facebook.com/hisistudio",
      "instagram": "https://instagram.com/hisistudio"
    }
  }
}
```

#### Admin: Get All Settings
```http
GET /api/v1/admin/settings
Authorization: Bearer {admin_access_token}
```

#### Admin: Update Settings
```http
PUT /api/v1/admin/settings
Authorization: Bearer {admin_access_token}
```

**Request Body:**
```json
{
  "site_name": "Hisi Studio",
  "contact_email": "info@hisistudio.com",
  "contact_phone": "+254712345678",
  "social_media_links": {
    "facebook": "https://facebook.com/hisistudio",
    "instagram": "https://instagram.com/hisistudio",
    "twitter": "https://twitter.com/hisistudio"
  }
}
```

---

## 📧 Newsletter & Contact

### Newsletter

#### Subscribe
```http
POST /api/v1/newsletter/subscribe
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

#### Unsubscribe
```http
POST /api/v1/newsletter/unsubscribe
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

#### Admin: List Subscribers
```http
GET /api/v1/admin/newsletter/subscribers?page=1&status=subscribed
Authorization: Bearer {admin_access_token}
```

### Contact

#### Submit Contact Form
```http
POST /api/v1/contact
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+2547123456789", // optional
  "subject": "Product Inquiry", // optional
  "message": "I'd like to know more about..."
}
```

#### Admin: List Messages
```http
GET /api/v1/admin/contact/messages?page=1&status=unread
Authorization: Bearer {admin_access_token}
```

#### Admin: Get Message
```http
GET /api/v1/admin/contact/messages/{message_id}
Authorization: Bearer {admin_access_token}
```

#### Admin: Mark as Read
```http
PUT /api/v1/admin/contact/messages/{message_id}/read
Authorization: Bearer {admin_access_token}
```

#### Admin: Delete Message
```http
DELETE /api/v1/admin/contact/messages/{message_id}
Authorization: Bearer {admin_access_token}
```

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": { /* validation errors if applicable */ }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": {
    "items": [/* array of items */],
    "pagination": {
      "page": 1,
      "per_page": 10,
      "total": 100,
      "total_pages": 10,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

---

## 🔑 Authentication

Most endpoints require a JWT token. Include it in the Authorization header:

```http
Authorization: Bearer {your_access_token}
```

### Token Expiry
- **Access Token**: 15 minutes
- **Refresh Token**: 7 days

When access token expires, use the refresh endpoint to get a new one.

---

## 🚫 Error Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 500 | Internal Server Error |

---

## 🧪 Testing

### Example: Complete User Journey

```bash
# 1. Register
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","first_name":"Test","last_name":"User"}'

# 2. Login (save the access_token from response)
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# 3. Get products
curl http://localhost:5000/api/v1/products

# 4. Add to cart
curl -X POST http://localhost:5000/api/v1/cart/items \
  -H "Content-Type: application/json" \
  -d '{"product_id":"PRODUCT_ID","quantity":1}'

# 5. Create address
curl -X POST http://localhost:5000/api/v1/addresses \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test User","phone":"+2547123456789","address_line1":"123 Main St","city":"Nairobi","country":"Kenya","is_default":true}'

# 6. Create order
curl -X POST http://localhost:5000/api/v1/orders \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"shipping_address_id":"ADDRESS_ID"}'

# 7. Get order details
curl -H "Authorization: Bearer ACCESS_TOKEN" \
  http://localhost:5000/api/v1/orders/ORDER_ID
```

---

## 📝 Notes

- All timestamps are in UTC ISO 8601 format
- Prices are in Nigerian Naira (NGN) by default
- Phone numbers support Kenyan format: +254XXXXXXXXX or 07XXXXXXXX
- Email addresses are case-insensitive and stored lowercase
- Product slugs must be unique and URL-safe

---

**API Version:** 1.0.0
**Last Updated:** December 2024
**Base URL:** `/api/v1`
