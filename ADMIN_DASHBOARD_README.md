# Hisi Studio Admin Dashboard

Complete admin dashboard implementation for managing the Hisi Studio e-commerce platform.

## Features

### ✅ Implemented

- **Dashboard Overview** - Role-based metrics, date filtering, quick actions
- **Order Management** - List, detail view, status updates
- **Media Library** - Upload, browse, delete images and videos
- **Content Management** - Blog post management
- **Role-Based Access Control** - Super Admin and Content Manager roles
- **Notifications** - In-app notification center
- **Responsive Design** - Mobile-friendly interface

### 🚧 Placeholders (Future Development)

- Inquiries Management
- Settings Panel
- Analytics Charts
- Customer Profiles
- Image Editor
- Real-time Notifications

## Getting Started

### Backend Setup

1. **Install Dependencies** (if not already done):
```bash
cd server
source venv/bin/activate
pip install flask-jwt-extended flask-cors flask-sqlalchemy flask-migrate python-dotenv psycopg2-binary requests bcrypt pillow stripe
```

2. **Run Database Migrations**:
```bash
cd server
source venv/bin/activate
flask db upgrade
```

3. **Create Super Admin User**:
```bash
cd server
source venv/bin/activate
python create_admin.py
```

Follow the prompts to create your admin account.

4. **Start Backend Server**:
```bash
cd server
source venv/bin/activate
python run.py
```

### Frontend Setup

1. **Install Dependencies** (if not already done):
```bash
cd client
npm install
```

2. **Start Development Server**:
```bash
cd client
npm run dev
```

3. **Access Admin Dashboard**:
Navigate to `http://localhost:5173/admin` and login with your admin credentials.

## Admin Routes

- `/admin` or `/admin/dashboard` - Dashboard Overview
- `/admin/orders` - Orders List
- `/admin/orders/:id` - Order Detail
- `/admin/media` - Media Library
- `/admin/content` - Content Management
- `/admin/inquiries` - Inquiries (placeholder)
- `/admin/settings` - Settings (placeholder)

## User Roles

### Super Admin
- Full access to all features
- View analytics and financial data
- Manage orders and customers
- Access all content management features

### Content Manager
- Limited to content management
- Can manage blog posts, media, and inquiries
- No access to analytics, orders, or customer data
- Can view products if granted permission

## API Endpoints

### Authentication
- `GET /api/v1/admin/verify` - Verify admin access

### Dashboard
- `GET /api/v1/admin/dashboard/overview?period=today` - Get dashboard metrics

### Orders
- `PATCH /api/v1/admin/orders/:id/status` - Update order status

### Media
- `GET /api/v1/admin/media?type=image` - Get media files
- `POST /api/v1/admin/media/upload` - Upload media
- `DELETE /api/v1/admin/media/:id` - Delete media

### Notifications
- `GET /api/v1/admin/notifications` - Get notifications
- `PATCH /api/v1/admin/notifications/:id/read` - Mark as read
- `PATCH /api/v1/admin/notifications/read-all` - Mark all as read

## File Structure

```
client/src/
├── layouts/
│   └── AdminLayout.jsx          # Main admin wrapper
├── components/admin/
│   ├── AdminSidebar.jsx         # Navigation sidebar
│   ├── AdminHeader.jsx          # Top header with notifications
│   └── dashboard/
│       ├── MetricCard.jsx       # KPI cards
│       └── DateRangePicker.jsx  # Date filter
└── pages/admin/
    ├── DashboardPage.jsx        # Dashboard overview
    ├── OrdersPage.jsx           # Orders list
    ├── OrderDetailPage.jsx      # Order details
    ├── MediaPage.jsx            # Media library
    ├── ContentPage.jsx          # Blog management
    ├── InquiriesPage.jsx        # Inquiries (placeholder)
    └── SettingsPage.jsx         # Settings (placeholder)

server/
├── app/
│   ├── models/admin.py          # Admin models
│   ├── routes/admin.py          # Admin endpoints
│   └── utils/admin_decorators.py # Security decorators
└── create_admin.py              # Admin user creation script
```

## Design Features

- **Premium Gradients** - Purple-blue color scheme
- **Smooth Animations** - Hover effects and transitions
- **Responsive Layout** - Works on all screen sizes
- **Accessibility** - ARIA labels and keyboard navigation
- **Role-Based UI** - Menu items filtered by user role

## Security

- JWT authentication required for all admin routes
- Role-based access control with decorators
- Permission-based feature access
- Protected routes on frontend

## Next Steps

1. Create your super admin user using `create_admin.py`
2. Login to the admin dashboard
3. Test all features
4. Customize as needed for your requirements

## Support

For issues or questions, refer to the main project documentation or contact the development team.
