import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getFeaturedProducts } from '../../services/productsApi'
import { Loader2 } from 'lucide-react'

const FeaturedProducts = ({ products: propProducts = [], title = 'Featured Collection', fetchFromApi = true }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [products, setProducts] = useState(propProducts)
  const [loading, setLoading] = useState(false)

  // Default products as fallback
  const defaultProducts = [
    {
      id: 1,
      name: 'Adaptive Bomber Jacket',
      price: 89000,
      images: {
        main: '/images/products/jacket-main.jpg',
      },
      description: 'Premium adaptive outerwear with magnetic closures',
    },
    {
      id: 2,
      name: 'Inclusive Wrap Dress',
      price: 65000,
      images: {
        main: '/images/products/dress-main.jpg',
      },
      description: 'Elegant wrap design with adjustable features',
    },
    {
      id: 3,
      name: 'Adaptive Trousers',
      price: 55000,
      images: {
        main: '/images/products/trousers-main.jpg',
      },
      description: 'Comfortable seated-friendly design',
    },
    {
      id: 4,
      name: 'Sensory-Friendly Top',
      price: 42000,
      images: {
        main: '/images/products/top-main.jpg',
      },
      description: 'Tag-free with soft flat seams',
    },
    {
      id: 5,
      name: 'Easy-Wear Cardigan',
      price: 48000,
      images: {
        main: '/images/products/cardigan-main.jpg',
      },
      description: 'Oversized buttons for easy grip',
    },
  ]

  // Fetch products from API if none provided and fetchFromApi is true
  useEffect(() => {
    const fetchProducts = async () => {
      if (propProducts.length > 0 || !fetchFromApi) {
        setProducts(propProducts.length > 0 ? propProducts : defaultProducts)
        return
      }

      setLoading(true)
      try {
        const data = await getFeaturedProducts(8)
        const fetchedProducts = data.data?.products || data.products || []

        if (fetchedProducts.length > 0) {
          // Transform API data to match component expectations
          const transformedProducts = fetchedProducts.map(product => ({
            ...product,
            images: {
              main: product.main_image || product.images?.main || '/images/products/placeholder.jpg',
              hover: product.hover_image || product.images?.hover,
            }
          }))
          setProducts(transformedProducts)
        } else {
          setProducts(defaultProducts)
        }
      } catch (error) {
        console.error('Failed to fetch featured products:', error)
        setProducts(defaultProducts)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [propProducts, fetchFromApi])

  const displayProducts = products.length > 0 ? products : defaultProducts

  // Featured product is the first one
  const featuredProduct = displayProducts[0]
  // Carousel products are the rest
  const carouselProducts = displayProducts.slice(1)

  // Auto-advance carousel every 5 seconds
  const nextSlide = useCallback(() => {
    if (carouselProducts.length > 4) {
      setCurrentIndex((prev) => (prev + 1) % (carouselProducts.length - 3))
    }
  }, [carouselProducts.length])

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [nextSlide])

  // Get visible products for carousel (show 4 at a time)
  const getVisibleProducts = () => {
    if (carouselProducts.length === 0) return []
    const visible = []
    const count = Math.min(4, carouselProducts.length)
    for (let i = 0; i < count; i++) {
      const index = (currentIndex + i) % carouselProducts.length
      visible.push(carouselProducts[index])
    }
    return visible
  }

  // Helper to get product image
  const getProductImage = (product) => {
    return product.images?.main || product.main_image || '/images/products/placeholder.jpg'
  }

  if (loading) {
    return (
      <section className="bg-gray-50 py-20" id="main-content">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-hisi-primary animate-spin mb-4" />
          <p className="text-gray-600">Loading featured products...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-gray-50" id="main-content">
      {/* Section Header */}
      <div className="text-center py-12 px-4">
        <h2 className="text-4xl font-bold text-gray-900 mb-2 font-braille">{title}</h2>
        <p className="text-2xl text-gray-800 font-serif">2 THUKU 0 COLLECTION</p>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Left Side - Large Featured Product Card */}
        <div className="lg:w-1/2 relative">
          <Link to={`/product/${featuredProduct.id}`} className="block h-full">
            <div className="relative h-[500px] lg:h-[700px] overflow-hidden bg-gray-200">
              <img
                src={getProductImage(featuredProduct)}
                alt={featuredProduct.name}
                className="w-full h-full object-cover"
              />

              {/* Bottom overlay with logo and description */}
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                {/* Logo/Brand */}
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src="/images/hisi-logo-white.png"
                    alt="Hisi Studio"
                    className="h-12 w-auto"
                  />
                </div>

                {/* Description */}
                <p className="text-white/90 text-sm leading-relaxed max-w-md">
                  Driven by the goal of leading the fashion world into a more sustainable future,
                  Hisi Studio focuses on creating quality handcrafted pieces that celebrate
                  African heritage while prioritizing accessibility.
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Right Side - Content and Carousel */}
        <div className="lg:w-1/2 bg-gray-100 p-8 lg:p-12 flex flex-col">
          {/* Top Section - Description and CTA */}
          <div className="mb-8">
            <div className="flex justify-between items-start mb-6">
              <p className="text-gray-700 text-sm leading-relaxed max-w-sm font-serif">
                From the 2 Thuku 0 Collection, explore adaptive fashion that combines
                style with functionality. Each piece is designed with inclusivity at its core.
              </p>
              <Link
                to="/collections"
                className="text-sm font-medium uppercase tracking-wider border border-gray-900 px-4 py-2 hover:bg-gray-900 hover:text-white transition-colors flex-shrink-0 ml-4"
              >
                View Collection
              </Link>
            </div>
          </div>

          {/* Carousel Section - 4 Small Product Cards */}
          <div className="flex-1">
            {carouselProducts.length > 0 && (
              <div className="grid grid-cols-4 gap-3 mb-8">
                {getVisibleProducts().map((product, index) => (
                  <Link
                    key={`${product.id}-${index}`}
                    to={`/product/${product.id}`}
                    className="group relative aspect-square overflow-hidden bg-white"
                  >
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </Link>
                ))}
              </div>
            )}

            {/* Carousel Indicators */}
            {carouselProducts.length > 4 && (
              <div className="flex justify-center space-x-2 mb-8">
                {Array.from({ length: Math.max(1, carouselProducts.length - 3) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 transition-all duration-300 ${index === currentIndex ? 'bg-gray-900 w-6' : 'bg-gray-400'
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
