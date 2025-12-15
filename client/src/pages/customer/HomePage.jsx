import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import HeroSection from '../../components/home/HeroSection'
import AboutSection from '../../components/home/AboutSection'
import FeaturedProducts from '../../components/home/FeaturedProducts'
import AdaptiveFeaturesSection from '../../components/home/AdaptiveFeaturesSection'
import CategoryGrid from '../../components/home/CategoryGrid'
import TestimonialsSection from '../../components/home/TestimonialsSection'
import InstagramFeed from '../../components/home/InstagramFeed'
import NewsletterSection from '../../components/home/NewsletterSection'

// Import mock data
import {
  heroSlides,
  featuredProducts,
  aboutContent,
  adaptiveFeatures,
  categories,
  testimonials,
  instagramPosts,
  footerLinks,
  socialLinks,
} from '../../data/mockData'

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <HeroSection slides={heroSlides} />

      {/* About/Mission Section */}
      <AboutSection content={aboutContent} />

      {/* Featured Products */}
      <FeaturedProducts products={featuredProducts} title="Featured Products" />

      {/* Adaptive Features */}
      <AdaptiveFeaturesSection features={adaptiveFeatures} />

      {/* Category Grid */}
      <CategoryGrid categories={categories} />

      {/* Testimonials */}
      <TestimonialsSection testimonials={testimonials} />

      {/* Instagram Feed */}
      <InstagramFeed posts={instagramPosts} username="hisistudio" />

      {/* Newsletter Signup */}
      <NewsletterSection />

      {/* Footer */}
      <Footer links={footerLinks} socialLinks={socialLinks} />
    </div>
  )
}

export default HomePage
