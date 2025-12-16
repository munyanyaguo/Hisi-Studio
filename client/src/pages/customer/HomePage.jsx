import { useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import HeroSection from '../../components/home/HeroSection'
import InstagramVideoSection from '../../components/home/InstagramVideoSection'
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
  pinnedInstagramVideo,
  footerLinks,
  socialLinks,
} from '../../data/mockData'

const HomePage = () => {
  const [isHeroDark, setIsHeroDark] = useState(true) // Default to dark

  const handleSlideChange = (slide) => {
    setIsHeroDark(slide.isDark !== false) // Default to dark if not specified
  }

  return (
    <div className="min-h-screen">
      <Navbar isHeroDark={isHeroDark} />

      {/* Hero Section */}
      <HeroSection slides={heroSlides} onSlideChange={handleSlideChange} />

      {/* Pinned Instagram Video Section */}
      <InstagramVideoSection
        videoUrl={pinnedInstagramVideo.videoUrl}
        caption={pinnedInstagramVideo.caption}
        username={pinnedInstagramVideo.username}
      />

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
      <InstagramFeed username="hisi_studio" />

      {/* Newsletter Signup */}
      <NewsletterSection />

      {/* Footer */}
      <Footer links={footerLinks} socialLinks={socialLinks} />
    </div>
  )
}

export default HomePage
