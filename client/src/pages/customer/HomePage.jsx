import Navbar from '../../components/layout/Navbar'
import HeroSection from '../../components/home/HeroSection'
import FeaturedProducts from '../../components/home/FeaturedProducts'

const HomePage = () => {
  // Hero slides data
  const heroSlides = [
    {
      id: 1,
      image: '/images/hero/slide-1.jpg',
      title: 'Adaptive Fashion',
      subtitle: 'Style Meets Accessibility',
      cta: 'Shop Now',
      ctaLink: '/shop',
    },
    {
      id: 2,
      image: '/images/hero/slide-2.jpg',
      title: 'New Collection',
      subtitle: 'Designed for Everyone',
      cta: 'Explore',
      ctaLink: '/collections',
    },
    {
      id: 3,
      image: '/images/hero/slide-3.jpg',
      title: 'Our Story',
      subtitle: 'Inclusivity in Every Stitch',
      cta: 'Learn More',
      ctaLink: '/about',
    },
  ]

  // Featured products data
  const featuredProducts = [
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

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection slides={heroSlides} />
      <FeaturedProducts products={featuredProducts} title="Featured Products" />

      {/* Additional sections can be added here */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Hisi Studio
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We create adaptive fashion that combines style, comfort, and accessibility.
            Every piece is thoughtfully designed to empower individuals with mobility
            challenges, sensory sensitivities, and diverse body types.
          </p>
        </div>
      </section>
    </div>
  )
}

export default HomePage
