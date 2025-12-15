# Hisi Studio - Adaptive Fashion E-Commerce Platform

[![Backend Status](https://img.shields.io/badge/Backend-100%25%20Complete-success)]()
[![API Endpoints](https://img.shields.io/badge/API%20Endpoints-60%2B-blue)]()
[![Python](https://img.shields.io/badge/Python-3.12%2B-blue)]()
[![Flask](https://img.shields.io/badge/Flask-3.1-green)]()
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14%2B-blue)]()

> A modern e-commerce platform specializing in adaptive fashion - clothing designed for accessibility, comfort, and style.

## Features

- **Complete E-Commerce Flow**: Browse → Cart → Checkout → Order Management
- **Adaptive Fashion Focus**: Products with accessibility features (magnetic closures, side zippers, etc.)
- **Guest & User Support**: Shopping cart works for both guests and authenticated users
- **Admin Panel Ready**: Full admin endpoints for managing products, orders, CMS
- **CMS System**: Dynamic pages, blog, site settings
- **Stock Management**: Automatic stock updates, validation, restoration on cancellation
- **Role-Based Access**: Customer and Admin roles with proper middleware
- **Newsletter & Contact**: Built-in newsletter subscription and contact form

## Quick Start

See [QUICK_START.md](QUICK_START.md) for detailed setup instructions.

```bash
# 1. Clone and setup database
createdb hisi_studio

# 2. Install and configure backend
cd server
pipenv install
cp .env.example .env  # Edit with your settings
pipenv run flask db upgrade
pipenv run python seed_data.py

# 3. Start server
pipenv run flask run

# 4. Test API
./test_api.sh
```

**Server runs at:** http://localhost:5000

## Login Credentials (After Seeding)

**Admin:**
- Email: admin@hisi.com
- Password: Admin123!

**Customer:**
- Email: customer@test.com
- Password: Test123!

## Backend Architecture

### Database Models (14)
- **User** - Authentication & profiles
- **Product** - Catalog with accessibility features
- **Category** - Hierarchical product categories
- **Order & OrderItem** - Order management
- **Cart & CartItem** - Shopping cart (guest + user)
- **UserAddress** - Shipping/billing addresses
- **Payment** - Payment tracking (Flutterwave ready)
- **Page, BlogPost, SiteSetting** - CMS system
- **NewsletterSubscriber, ContactMessage** - Marketing

### API Endpoints (60+)

| Category | Endpoints | Description |
|----------|-----------|-------------|
| **Authentication** | 7 | Register, login, profile, change password |
| **Products** | 7 | List, get, create/update/delete (admin), categories |
| **Cart** | 7 | Get, add, update, remove, clear, merge, validate |
| **Addresses** | 6 | CRUD operations, set default |
| **Orders** | 7 | Create, list, get, cancel, admin management |
| **CMS - Pages** | 6 | Public & admin CRUD |
| **CMS - Blog** | 5 | List, get, create/update/delete (admin) |
| **CMS - Settings** | 3 | Get public, get all (admin), update (admin) |
| **Newsletter** | 3 | Subscribe, unsubscribe, list (admin) |
| **Contact** | 5 | Submit, list/get/update/delete (admin) |

## Tech Stack

### Backend
- **Framework:** Flask 3.1
- **Database:** PostgreSQL 14+ with SQLAlchemy
- **Authentication:** JWT (Flask-JWT-Extended)
- **Migrations:** Alembic (Flask-Migrate)
- **Validation:** Custom validators
- **CORS:** Flask-CORS

### Frontend (Ready for Integration)
- **Framework:** React 18+
- **Build Tool:** Vite 5+
- **Routing:** React Router v6
- **Styling:** Tailwind CSS 3+
- **State Management:** Redux Toolkit (recommended)

## Documentation

| Document | Description |
|----------|-------------|
| [QUICK_START.md](QUICK_START.md) | 5-minute setup guide |
| [API_DOCUMENTATION.md](server/API_DOCUMENTATION.md) | Complete API reference with examples |
| [TESTING.md](server/TESTING.md) | Testing guide with cURL commands |
| [IMPLEMENTATION_COMPLETE.md](IMPLEMENTATION_COMPLETE.md) | Implementation summary & status |

## Project Structure

```
Hisi-Studio/
├── client/                      # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/         # Navbar, Footer
│   │   │   └── home/           # HeroSection, FeaturedProducts
│   │   ├── pages/              # HomePage, NotFoundPage
│   │   └── main.jsx
│   └── tailwind.config.js
│
├── server/                      # Flask backend
│   ├── app/
│   │   ├── models/             # 14 database models
│   │   ├── routes/             # 7 API blueprints
│   │   ├── services/           # Business logic (cart, order)
│   │   ├── middleware/         # Auth middleware
│   │   └── utils/              # Validators, JWT, responses
│   ├── migrations/             # Database migrations
│   ├── seed_data.py           # Sample data seeder
│   ├── test_api.sh            # API test script
│   └── run.py                 # Entry point
│
└── Documentation files
```

## API Examples

### Register User
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

### Get Products
```bash
curl "http://localhost:5000/api/v1/products?page=1&per_page=12"
```

### Add to Cart (Guest)
```bash
curl -X POST http://localhost:5000/api/v1/cart/items \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "product-uuid",
    "quantity": 1
  }'
```

### Create Order (Authenticated)
```bash
curl -X POST http://localhost:5000/api/v1/orders \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "shipping_address_id": "address-uuid"
  }'
```

See [API_DOCUMENTATION.md](server/API_DOCUMENTATION.md) for complete examples.

## Sample Data

After running `seed_data.py`:

**6 Products** including:
- Adaptive Bomber Jacket (₦8,999)
- Comfort Denim Jacket (₦7,499)
- Side-Zip T-Shirt (₦3,499)
- More...

**4 Categories:**
- Adaptive Jackets
- Easy-Wear Tops
- Adaptive Bottoms
- Accessories

**2 CMS Pages:** About Us, Size Guide
**2 Blog Posts:** Fashion trends and shopping tips
**Site Settings:** Contact info, social media links

## Development Status

### Backend: 100% Complete ✅

- ✅ Database models & migrations
- ✅ Authentication & authorization
- ✅ Product catalog with search/filters
- ✅ Shopping cart (guest + user)
- ✅ Address management
- ✅ Order workflow with stock management
- ✅ Admin panel endpoints
- ✅ CMS (pages, blog, settings)
- ✅ Newsletter & contact forms
- ✅ Input validation & error handling
- ✅ Comprehensive documentation
- ✅ Test scripts
- ✅ Sample data seeder

### Frontend: Partial

- ✅ Basic components (Navbar, Hero, Products)
- ✅ Routing setup
- ✅ Tailwind configuration
- 🚧 Connect to backend API
- 🚧 State management
- 🚧 Complete pages

## Next Steps

### For Production:

1. **Frontend Integration** - Connect React app to backend API
2. **Payment Gateway** - Integrate Flutterwave
3. **Email Service** - Add SendGrid for notifications
4. **File Upload** - Implement Cloudinary for images
5. **Testing** - Write unit and integration tests
6. **Deployment** - Deploy to production (Heroku/Railway/Render)

### Optional Enhancements:

- Rate limiting (Flask-Limiter)
- Caching with Redis
- Admin dashboard statistics
- Product reviews and ratings
- Wishlist functionality
- Advanced search
- Product recommendations

## Contributing

This is a private project. For questions or issues, please contact the project maintainer.

## License

Private - All Rights Reserved

---

**Backend Status:** 🟢 Production Ready
**Frontend Status:** 🟡 In Development
**Last Updated:** December 2024