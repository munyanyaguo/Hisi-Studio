import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingBag, User, Menu, X, Eye, LogOut, UserCircle, Settings } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import FlipProductCard from '../product/FlipProductCard'

const Navbar = ({ isHeroDark = true }) => {
  const [isPastHero, setIsPastHero] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const shopCloseTimeout = useRef(null)
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()

  // Shared open/close for Shop dropdown — timeout bridges the gap
  // between the trigger button and the dropdown panel
  const openShopDropdown = useCallback(() => {
    clearTimeout(shopCloseTimeout.current)
    setShopDropdownOpen(true)
  }, [])

  const closeShopDropdown = useCallback(() => {
    shopCloseTimeout.current = setTimeout(() => {
      setShopDropdownOpen(false)
    }, 120)
  }, [])

  // Clean up timeout on unmount
  useEffect(() => {
    return () => clearTimeout(shopCloseTimeout.current)
  }, [])

  // TRUE = navbar bg is white, so use dark text
  // FALSE = navbar bg is transparent, so use white text
  const hasWhiteBg = isPastHero || shopDropdownOpen

  // Text color class based on navbar background
  const textColor = hasWhiteBg ? 'text-gray-700' : 'text-white'
  const hoverBg = hasWhiteBg ? 'hover:bg-gray-100' : 'hover:bg-white/20'

  const cartItemCount = 0

  // Scroll handler
  useEffect(() => {
    const onScroll = () => {
      setIsPastHero(window.scrollY > 100)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleHighContrast = useCallback(() => {
    setHighContrast(prev => !prev)
    document.documentElement.classList.toggle('high-contrast')
  }, [])

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [navigate])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'unset'
  }, [mobileMenuOpen])

  const navLinks = [
    { name: 'Shop', href: '/shop' },
    { name: 'Collections', href: '/collections' },
    { name: 'About', href: '/about' },
    { name: 'Accessibility', href: '/accessibility' },
    { name: 'Press', href: '/press' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ]

  const linkClass = `${textColor} hover:text-hisi-accent hover:underline transition-colors duration-300 text-sm font-medium tracking-wide focus:outline-none focus:ring-2 focus:ring-hisi-primary rounded px-2 py-1`

  const iconBtnClass = `p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-hisi-primary ${hoverBg}`

  const iconClass = `w-5 h-5 transition-colors duration-300 ${textColor}`

  return (
    <>
      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-hisi-primary focus:text-white focus:rounded"
      >
        Skip to main content
      </a>

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          hasWhiteBg ? 'bg-white shadow-lg' : 'bg-transparent'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">

            {/* LEFT: First 3 nav links */}
            <div className="hidden md:flex items-center flex-1">
              <div className="flex items-center justify-evenly w-full">
                {navLinks.slice(0, 3).map((link) => {
                  if (link.name === 'Shop') {
                    return (
                      <div
                        key={link.name}
                        className="relative h-full flex items-center"
                        onMouseEnter={openShopDropdown}
                        onMouseLeave={closeShopDropdown}
                      >
                        <Link
                          to="/shop"
                          className={`${linkClass} flex items-center space-x-1`}
                          onClick={() => setShopDropdownOpen(false)}
                        >
                          <span>{link.name}</span>
                          <svg
                            className={`w-4 h-4 transition-transform duration-300 ${shopDropdownOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </Link>
                      </div>
                    )
                  }

                  return (
                    <Link key={link.name} to={link.href} className={linkClass}>
                      {link.name}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* CENTER: Logo */}
            <div className="flex-shrink-0 mx-4 lg:mx-8">
              <Link
                to="/"
                className="flex items-center justify-center p-2 group focus:outline-none focus:ring-2 focus:ring-hisi-primary rounded-lg"
                aria-label="Hisi Studio Home"
              >
                <img
                  src={hasWhiteBg ? '/images/hisi-logo-light.png' : '/images/hisi-logo-white.png'}
                  alt="Hisi Studio"
                  className="h-20 w-auto object-contain transition-all duration-300"
                />
              </Link>
            </div>

            {/* RIGHT: Last 4 nav links + icons */}
            <div className="hidden md:flex items-center flex-1">
              <div className="flex items-center justify-evenly w-full">
                {navLinks.slice(3).map((link) => (
                  <Link key={link.name} to={link.href} className={linkClass}>
                    {link.name}
                  </Link>
                ))}

                {/* Icons */}
                <div className="flex items-center space-x-3">
                  {/* High Contrast */}
                  <button
                    onClick={toggleHighContrast}
                    className={iconBtnClass}
                    aria-label={`${highContrast ? 'Disable' : 'Enable'} high contrast mode`}
                    title="Toggle high contrast"
                  >
                    <Eye className={`w-5 h-5 transition-colors duration-300 ${highContrast ? 'text-hisi-primary' : textColor}`} />
                  </button>

                  {/* Search */}
                  <button
                    onClick={() => setSearchOpen(!searchOpen)}
                    className={iconBtnClass}
                    aria-label="Search"
                  >
                    <Search className={iconClass} />
                  </button>

                  {/* User Account */}
                  <div className="relative">
                    <button
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      onBlur={() => setTimeout(() => setProfileDropdownOpen(false), 200)}
                      className={iconBtnClass}
                      aria-label="Account menu"
                      aria-expanded={profileDropdownOpen}
                    >
                      <User className={iconClass} />
                    </button>

                    {profileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-fadeIn">
                        {isAuthenticated() ? (
                          <>
                            <div className="px-4 py-3 border-b border-gray-200">
                              <p className="text-sm font-semibold text-gray-900">{user?.first_name} {user?.last_name}</p>
                              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>
                            <Link to="/profile" className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors" onClick={() => setProfileDropdownOpen(false)}>
                              <UserCircle className="w-4 h-4" /><span>My Profile</span>
                            </Link>
                            <Link to="/account" className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors" onClick={() => setProfileDropdownOpen(false)}>
                              <Settings className="w-4 h-4" /><span>Account Settings</span>
                            </Link>
                            <div className="border-t border-gray-200 my-1"></div>
                            <button onClick={() => { logout(); setProfileDropdownOpen(false); navigate('/') }} className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left">
                              <LogOut className="w-4 h-4" /><span>Sign Out</span>
                            </button>
                          </>
                        ) : (
                          <>
                            <Link to="/login" className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors" onClick={() => setProfileDropdownOpen(false)}>
                              <User className="w-4 h-4" /><span>Sign In</span>
                            </Link>
                            <Link to="/signup" className="flex items-center space-x-3 px-4 py-3 text-sm font-semibold text-hisi-primary hover:bg-hisi-primary/10 transition-colors" onClick={() => setProfileDropdownOpen(false)}>
                              <UserCircle className="w-4 h-4" /><span>Create Account</span>
                            </Link>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Cart */}
                  <Link
                    to="/cart"
                    className={`relative ${iconBtnClass}`}
                    aria-label={`Shopping cart with ${cartItemCount} items`}
                  >
                    <ShoppingBag className={iconClass} />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-hisi-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{cartItemCount}</span>
                    )}
                  </Link>
                </div>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden ${iconBtnClass} ${textColor}`}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className={`w-6 h-6 transition-colors duration-300 ${textColor}`} />
              ) : (
                <Menu className={`w-6 h-6 transition-colors duration-300 ${textColor}`} />
              )}
            </button>
          </div>
        </div>

        {/* Shop Mega Menu Dropdown */}
        {shopDropdownOpen && (
          <div
            className="absolute left-0 right-0 top-24 flex justify-center z-40"
            onMouseEnter={openShopDropdown}
            onMouseLeave={closeShopDropdown}
          >
            <div className="bg-white shadow-2xl animate-fadeIn border border-gray-200 w-full max-w-5xl mx-4">
              <div className="px-6 py-6">
                <div className="grid grid-cols-10 gap-6">
                  {/* Categories */}
                  <div className="col-span-4">
                    <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-200 pb-2">
                      Shop by Category
                    </h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div className="space-y-2">
                        <div>
                          <Link to="/shop/adaptive-outerwear" onClick={() => setShopDropdownOpen(false)} className="text-gray-900 hover:text-hisi-primary hover:underline transition-colors duration-200 font-semibold text-sm block mb-2">Adaptive Outerwear</Link>
                          <ul className="space-y-1.5 ml-2">
                            <li><Link to="/shop/jackets" onClick={() => setShopDropdownOpen(false)} className="text-gray-600 hover:text-hisi-primary hover:underline text-xs">Jackets & Coats</Link></li>
                            <li><Link to="/shop/blazers" onClick={() => setShopDropdownOpen(false)} className="text-gray-600 hover:text-hisi-primary text-sm">Blazers</Link></li>
                          </ul>
                        </div>
                        <div>
                          <Link to="/shop/sensory-friendly" onClick={() => setShopDropdownOpen(false)} className="text-gray-900 hover:text-hisi-primary transition-colors duration-200 font-semibold text-sm block mb-2">Sensory-Friendly</Link>
                          <ul className="space-y-2 ml-3">
                            <li><Link to="/shop/soft-fabrics" onClick={() => setShopDropdownOpen(false)} className="text-gray-600 hover:text-hisi-primary text-sm">Soft Fabrics</Link></li>
                            <li><Link to="/shop/tagless" onClick={() => setShopDropdownOpen(false)} className="text-gray-600 hover:text-hisi-primary text-sm">Tag-Free</Link></li>
                          </ul>
                        </div>
                        <div><Link to="/shop/accessories" onClick={() => setShopDropdownOpen(false)} className="text-gray-900 hover:text-hisi-primary hover:underline transition-colors duration-200 font-semibold text-sm block">Accessories</Link></div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Link to="/shop/seated-comfort" onClick={() => setShopDropdownOpen(false)} className="text-gray-900 hover:text-hisi-primary transition-colors duration-200 font-semibold text-sm block mb-2">Seated Comfort</Link>
                          <ul className="space-y-2 ml-3">
                            <li><Link to="/shop/pants" onClick={() => setShopDropdownOpen(false)} className="text-gray-600 hover:text-hisi-primary text-sm">Pants & Trousers</Link></li>
                            <li><Link to="/shop/dresses" onClick={() => setShopDropdownOpen(false)} className="text-gray-600 hover:text-hisi-primary text-sm">Dresses</Link></li>
                          </ul>
                        </div>
                        <div>
                          <Link to="/shop/easy-dressing" onClick={() => setShopDropdownOpen(false)} className="text-gray-900 hover:text-hisi-primary transition-colors duration-200 font-semibold text-sm block mb-2">Easy Dressing</Link>
                          <ul className="space-y-2 ml-3">
                            <li><Link to="/shop/magnetic-closures" onClick={() => setShopDropdownOpen(false)} className="text-gray-600 hover:text-hisi-primary text-sm">Magnetic Closures</Link></li>
                            <li><Link to="/shop/side-openings" onClick={() => setShopDropdownOpen(false)} className="text-gray-600 hover:text-hisi-primary text-sm">Side Openings</Link></li>
                          </ul>
                        </div>
                        <div><Link to="/shop/all" onClick={() => setShopDropdownOpen(false)} className="text-hisi-primary hover:text-hisi-accent transition-colors duration-200 font-semibold text-sm block">View All →</Link></div>
                      </div>
                    </div>
                  </div>

                  {/* New In */}
                  <div className="col-span-3 border-l border-gray-200 pl-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wide">New In</h3>
                    <ul className="space-y-2">
                      <li><Link to="/shop/new" onClick={() => setShopDropdownOpen(false)} className="text-gray-900 hover:text-hisi-primary hover:underline transition-colors duration-200 font-semibold text-xs flex items-center space-x-1.5"><span className="w-1.5 h-1.5 bg-hisi-accent rounded-full"></span><span>All New Arrivals</span></Link></li>
                      <li><Link to="/shop/best-sellers" onClick={() => setShopDropdownOpen(false)} className="text-gray-600 hover:text-hisi-primary hover:underline transition-colors duration-200 text-xs">Best Sellers</Link></li>
                      <li><Link to="/shop/trending" onClick={() => setShopDropdownOpen(false)} className="text-gray-600 hover:text-hisi-primary transition-colors duration-200 text-xs">Trending Now</Link></li>
                      <li><Link to="/shop/limited-edition" onClick={() => setShopDropdownOpen(false)} className="text-gray-600 hover:text-hisi-primary transition-colors duration-200 text-xs">Limited Edition</Link></li>
                      <li className="pt-4 border-t border-gray-200"><Link to="/shop/sale" onClick={() => setShopDropdownOpen(false)} className="text-red-600 hover:text-red-700 transition-colors duration-200 text-sm font-bold flex items-center space-x-2"><span>🔥</span><span>Sale - Up to 40% Off</span></Link></li>
                    </ul>
                  </div>

                  {/* Featured Products */}
                  <div className="col-span-3 border-l border-gray-200 pl-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wide">Featured</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <FlipProductCard id="1" image="/images/products/jacket-main.jpg" name="Adaptive Bomber Jacket" price={89000} description="Stylish bomber jacket with magnetic closures" category="Outerwear" />
                      <FlipProductCard id="4" image="/images/products/top-main.jpg" name="Sensory-Friendly Top" price={42000} description="Ultra-soft, tagless top with flat seams" category="Tops" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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
                {isAuthenticated() ? (
                  <>
                    <div className="px-2 py-2 bg-gray-50 rounded-lg">
                      <p className="text-sm font-semibold text-gray-900">
                        {user?.first_name} {user?.last_name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 text-gray-700 hover:text-hisi-primary transition-colors duration-300 py-2 focus:outline-none focus:ring-2 focus:ring-hisi-primary rounded px-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <UserCircle className="w-5 h-5" />
                      <span className="font-medium">My Profile</span>
                    </Link>

                    <Link
                      to="/account"
                      className="flex items-center space-x-3 text-gray-700 hover:text-hisi-primary transition-colors duration-300 py-2 focus:outline-none focus:ring-2 focus:ring-hisi-primary rounded px-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Settings className="w-5 h-5" />
                      <span className="font-medium">Account Settings</span>
                    </Link>

                    <button
                      onClick={() => {
                        logout()
                        setMobileMenuOpen(false)
                        navigate('/')
                      }}
                      className="flex items-center space-x-3 text-red-600 hover:text-red-700 transition-colors duration-300 py-2 w-full focus:outline-none focus:ring-2 focus:ring-hisi-primary rounded px-2"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center space-x-3 text-gray-700 hover:text-hisi-primary transition-colors duration-300 py-2 focus:outline-none focus:ring-2 focus:ring-hisi-primary rounded px-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <span className="font-medium">Sign In</span>
                    </Link>

                    <Link
                      to="/signup"
                      className="flex items-center space-x-3 text-hisi-primary hover:text-hisi-accent transition-colors duration-300 py-2 focus:outline-none focus:ring-2 focus:ring-hisi-primary rounded px-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <UserCircle className="w-5 h-5" />
                      <span className="font-semibold">Create Account</span>
                    </Link>
                  </>
                )}

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
    </>
  )
}

export default Navbar
