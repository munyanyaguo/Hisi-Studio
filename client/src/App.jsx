import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'

// Customer pages - loaded eagerly (main user experience)
import HomePage from './pages/customer/HomePage'
import AboutPage from './pages/customer/AboutPage'
import AccessibilityPage from './pages/customer/AccessibilityPage'
import PressPage from './pages/customer/PressPage'
import BlogPage from './pages/customer/BlogPage'
import BlogPostPage from './pages/customer/BlogPostPage'
import CustomerCollectionsPage from './pages/customer/CollectionsPage'
import ContactPage from './pages/customer/ContactPage'
import ShopPage from './pages/customer/ShopPage'
import ProductDetailsPage from './pages/customer/ProductDetailsPage'
import ProfilePage from './pages/customer/ProfilePage'
import NotFoundPage from './pages/error/NotFoundPage'
import LoginPage from './pages/auth/LoginPage'
import SignUpPage from './pages/auth/SignUpPage'

// Admin layout - loaded eagerly for auth check
import AdminLayout from './layouts/AdminLayout'

// Admin pages - lightweight ones loaded eagerly
import DashboardPage from './pages/admin/DashboardPage'
import OrdersPage from './pages/admin/OrdersPage'
import OrderDetailPage from './pages/admin/OrderDetailPage'
import MediaPage from './pages/admin/MediaPage'
import ContentPage from './pages/admin/ContentPage'
import InquiriesPage from './pages/admin/InquiriesPage'
import SettingsPage from './pages/admin/SettingsPage'
import CustomersPage from './pages/admin/CustomersPage'
import CustomerDetailPage from './pages/admin/CustomerDetailPage'
import ProductsPage from './pages/admin/ProductsPage'
import AdminCollectionsPage from './pages/admin/CollectionsPage'
import MessagingPage from './pages/admin/MessagingPage'
import SectionEditorPage from './pages/admin/SectionEditorPage'
import ReviewsPage from './pages/admin/ReviewsPage'

// Heavy admin pages - lazy loaded to reduce initial bundle size
const AnalyticsPage = lazy(() => import('./pages/admin/AnalyticsPage'))
const BlogPostEditor = lazy(() => import('./pages/admin/BlogPostEditor'))
const ProductEditor = lazy(() => import('./pages/admin/ProductEditor'))
const PressManagementPage = lazy(() => import('./pages/admin/PressManagementPage'))

// Loading fallback for lazy-loaded components
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
)

function App() {
  return (
    <Routes>
      {/* Customer Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/accessibility" element={<AccessibilityPage />} />
      <Route path="/press" element={<PressPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
      <Route path="/collections" element={<CustomerCollectionsPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/shop/:productId" element={<ProductDetailsPage />} />
      <Route path="/product/:productId" element={<ProductDetailsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/account" element={<ProfilePage />} />

      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="analytics" element={
          <Suspense fallback={<PageLoader />}>
            <AnalyticsPage />
          </Suspense>
        } />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/:orderId" element={<OrderDetailPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/new" element={
          <Suspense fallback={<PageLoader />}>
            <ProductEditor />
          </Suspense>
        } />
        <Route path="products/:id/edit" element={
          <Suspense fallback={<PageLoader />}>
            <ProductEditor />
          </Suspense>
        } />
        <Route path="media" element={<MediaPage />} />
        <Route path="content" element={<ContentPage />} />
        <Route path="content/new" element={
          <Suspense fallback={<PageLoader />}>
            <BlogPostEditor />
          </Suspense>
        } />
        <Route path="content/:postId/edit" element={
          <Suspense fallback={<PageLoader />}>
            <BlogPostEditor />
          </Suspense>
        } />
        <Route path="content/edit/:postId" element={
          <Suspense fallback={<PageLoader />}>
            <BlogPostEditor />
          </Suspense>
        } />
        <Route path="collections" element={<AdminCollectionsPage />} />
        <Route path="sections" element={<SectionEditorPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="press" element={
          <Suspense fallback={<PageLoader />}>
            <PressManagementPage />
          </Suspense>
        } />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="customers/:customerId" element={<CustomerDetailPage />} />
        <Route path="inquiries" element={<InquiriesPage />} />
        <Route path="messages" element={<MessagingPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
