import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingBag, User, Menu, X, Eye } from 'lucide-react'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const navigate = useNavigate()

  // Cart item count (will come from Redux later)
  const cartItemCount = 0

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Toggle high contrast mode
  const toggleHighContrast = () => {
    setHighContrast(!highContrast)
    document.documentElement.classList.toggle('high-contrast')
  }

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [navigate])

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  const navLinks = [
    { name: 'Shop', href: '/shop' },
    { name: 'Collections', href: '/collections' },
    { name: 'About', href: '/about' },
    { name: 'Accessibility', href: '/accessibility' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <>
      {/* Skip to main content - Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-hisi-primary focus:text-white focus:rounded"
      >
        Skip to main content
      </a>

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md'
            : 'bg-white'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-2 group focus:outline-none focus:ring-2 focus:ring-hisi-primary rounded-lg px-2"
              aria-label="Hisi Studio Home"
            >
              <span className="text-2xl font-bold text-hisi-primary group-hover:text-hisi-accent transition-colors duration-300">
                HISI
              </span>
              <span className="text-2xl font-light text-gray-700">STUDIO</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-gray-700 hover:text-hisi-primary transition-colors duration-300 text-sm font-medium tracking-wide focus:outline-none focus:ring-2 focus:ring-hisi-primary rounded px-2 py-1"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
              {/* Accessibility Toggle */}
              <button
                onClick={toggleHighContrast}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-hisi-primary"
                aria-label={`${highContrast ? 'Disable' : 'Enable'} high contrast mode`}
                title="Toggle high contrast"
              >
                <Eye className={`w-5 h-5 ${highContrast ? 'text-hisi-primary' : 'text-gray-700'}`} />
              </button>

              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-hisi-primary hidden sm:block"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-gray-700" />
              </button>

              {/* User Account */}
              <Link
                to="/account"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-hisi-primary hidden sm:block"
                aria-label="Account"
              >
                <User className="w-5 h-5 text-gray-700" />
              </Link>

              {/* Shopping Cart */}
              <Link
                to="/cart"
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-hisi-primary"
                aria-label={`Shopping cart with ${cartItemCount} items`}
              >
                <ShoppingBag className="w-5 h-5 text-gray-700" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-hisi-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-hisi-primary"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="border-t border-gray-200 bg-white py-4 animate-slideDown">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <input
                type="search"
                placeholder="Search for products..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hisi-primary focus:border-transparent"
                aria-label="Search products"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 top-20 bg-white z-40 overflow-y-auto animate-slideDown"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block text-lg font-medium text-gray-700 hover:text-hisi-primary transition-colors duration-300 py-2 focus:outline-none focus:ring-2 focus:ring-hisi-primary rounded px-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-4 border-t border-gray-200 space-y-4">
                <Link
                  to="/account"
                  className="flex items-center space-x-3 text-gray-700 hover:text-hisi-primary transition-colors duration-300 py-2 focus:outline-none focus:ring-2 focus:ring-hisi-primary rounded px-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">My Account</span>
                </Link>

                <button
                  onClick={() => {
                    setSearchOpen(true)
                    setMobileMenuOpen(false)
                  }}
                  className="flex items-center space-x-3 text-gray-700 hover:text-hisi-primary transition-colors duration-300 py-2 w-full focus:outline-none focus:ring-2 focus:ring-hisi-primary rounded px-2"
                >
                  <Search className="w-5 h-5" />
                  <span className="font-medium">Search</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-20" aria-hidden="true" />
    </>
  )
}

export default Navbar
