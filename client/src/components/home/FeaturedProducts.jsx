import { useState } from 'react'
import { Heart, Eye, ShoppingCart, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

const FeaturedProducts = ({ products = [], title = 'Featured Products' }) => {
  const [hoveredProduct, setHoveredProduct] = useState(null)
  const [wishlist, setWishlist] = useState([])

  // Toggle wishlist
  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }

  // Default products if none provided
  const defaultProducts = [
    {
      id: 1,
      name: 'Adaptive Bomber Jacket',
      price: 89000,
      originalPrice: 120000,
      images: {
        main: '/images/products/jacket-main.jpg',
        hover: '/images/products/jacket-hover.jpg',
      },
      badge: 'New',
      accessibilityFeatures: ['Magnetic closures', 'Easy grip zippers'],
    },
    {
      id: 2,
      name: 'Inclusive Wrap Dress',
      price: 65000,
      images: {
        main: '/images/products/dress-main.jpg',
        hover: '/images/products/dress-hover.jpg',
      },
      badge: 'Best Seller',
      accessibilityFeatures: ['Adjustable waist', 'Side openings'],
    },
    {
      id: 3,
      name: 'Adaptive Trousers',
      price: 55000,
      originalPrice: 75000,
      images: {
        main: '/images/products/trousers-main.jpg',
        hover: '/images/products/trousers-hover.jpg',
      },
      badge: 'Sale',
      accessibilityFeatures: ['Elastic waistband', 'Seated comfort'],
    },
    {
      id: 4,
      name: 'Sensory-Friendly Top',
      price: 42000,
      images: {
        main: '/images/products/top-main.jpg',
        hover: '/images/products/top-hover.jpg',
      },
      badge: 'Featured',
      accessibilityFeatures: ['Tag-free', 'Soft fabric', 'Flat seams'],
    },
  ]

  const displayProducts = products.length > 0 ? products : defaultProducts

  // Format price in Naira
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price)
  }

  // Calculate discount percentage
  const getDiscount = (original, current) => {
    if (!original) return null
    return Math.round(((original - current) / original) * 100)
  }

  return (
    <section className="py-16 bg-gray-50" id="main-content">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our collection of adaptive fashion designed for comfort,
            style, and accessibility
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((product) => {
            const discount = getDiscount(product.originalPrice, product.price)
            const isHovered = hoveredProduct === product.id
            const isInWishlist = wishlist.includes(product.id)

            return (
              <div
                key={product.id}
                className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                {/* Product Image */}
                <Link
                  to={`/product/${product.id}`}
                  className="relative block aspect-[3/4] overflow-hidden bg-gray-100"
                >
                  <img
                    src={
                      isHovered && product.images.hover
                        ? product.images.hover
                        : product.images.main
                    }
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Badge */}
                  {product.badge && (
                    <span
                      className={`absolute top-4 left-4 px-3 py-1 text-xs font-semibold rounded-full ${
                        product.badge === 'Sale'
                          ? 'bg-red-500 text-white'
                          : product.badge === 'New'
                          ? 'bg-hisi-primary text-white'
                          : product.badge === 'Best Seller'
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-900 text-white'
                      }`}
                    >
                      {product.badge}
                    </span>
                  )}

                  {/* Discount Badge */}
                  {discount && (
                    <span className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
                      -{discount}%
                    </span>
                  )}

                  {/* Quick Actions */}
                  <div
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex space-x-2 transition-opacity duration-300 ${
                      isHovered ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        // Quick view modal (implement later)
                      }}
                      className="bg-white p-3 rounded-full shadow-lg hover:bg-hisi-primary hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-hisi-primary"
                      aria-label={`Quick view ${product.name}`}
                    >
                      <Eye className="w-5 h-5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        toggleWishlist(product.id)
                      }}
                      className={`bg-white p-3 rounded-full shadow-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-hisi-primary ${
                        isInWishlist
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'hover:bg-red-500 hover:text-white'
                      }`}
                      aria-label={
                        isInWishlist
                          ? `Remove ${product.name} from wishlist`
                          : `Add ${product.name} to wishlist`
                      }
                    >
                      <Heart
                        className="w-5 h-5"
                        fill={isInWishlist ? 'currentColor' : 'none'}
                      />
                    </button>
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-4">
                  <Link to={`/product/${product.id}`} className="block group">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-hisi-primary transition-colors duration-300">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Accessibility Features */}
                  {product.accessibilityFeatures &&
                    product.accessibilityFeatures.length > 0 && (
                      <div className="flex items-start space-x-1 mb-3">
                        <Zap className="w-4 h-4 text-hisi-accent flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {product.accessibilityFeatures.join(' • ')}
                        </p>
                      </div>
                    )}

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => {
                      // Add to cart functionality (implement with Redux later)
                      console.log('Add to cart:', product.id)
                    }}
                    className="w-full bg-hisi-primary text-white py-3 rounded-lg font-medium hover:bg-hisi-primary/90 transition-colors duration-300 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-hisi-primary focus:ring-offset-2"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link
            to="/shop"
            className="inline-block bg-gray-900 text-white px-8 py-4 rounded-lg font-medium hover:bg-hisi-primary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-hisi-primary focus:ring-offset-2"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
