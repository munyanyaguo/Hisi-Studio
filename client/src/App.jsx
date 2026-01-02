import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/customer/HomePage'
import AboutPage from './pages/customer/AboutPage'
import AccessibilityPage from './pages/customer/AccessibilityPage'
import PressPage from './pages/customer/PressPage'
import BlogPage from './pages/customer/BlogPage'
import BlogPostPage from './pages/customer/BlogPostPage'
import CollectionsPage from './pages/customer/CollectionsPage'
import ContactPage from './pages/customer/ContactPage'
import ShopPage from './pages/customer/ShopPage'
import NotFoundPage from './pages/error/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/accessibility" element={<AccessibilityPage />} />
      <Route path="/press" element={<PressPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
      <Route path="/collections" element={<CollectionsPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
