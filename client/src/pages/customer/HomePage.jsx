import { useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import HeroSection from '../../components/home/HeroSection'
import AboutUsHero from '../../components/home/AboutUsHero'
import AboutSection from '../../components/home/AboutSection'
import FeaturedProducts from '../../components/home/FeaturedProducts'
import AdaptiveFeaturesSection from '../../components/home/AdaptiveFeaturesSection'
import CategoryGrid from '../../components/home/CategoryGrid'
import TestimonialsSection from '../../components/home/TestimonialsSection'
import InstagramFeed from '../../components/home/InstagramFeed'
import ScrollAnimationWrapper from '../../components/ui/ScrollAnimationWrapper'

// Import mock data
import {
  heroSlides,
  featuredProducts,
  aboutContent,
  adaptiveFeatures,
  categories,
  testimonials,
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

      {/* Hero Section - No animation needed, it's above fold */}
      <HeroSection slides={heroSlides} onSlideChange={handleSlideChange} />

      {/* Featured Products - Animate on scroll */}
      <ScrollAnimationWrapper>
        <FeaturedProducts products={featuredProducts} title="Featured Collection" />
      </ScrollAnimationWrapper>

      {/* About Us Hero - Full width image section */}
      <ScrollAnimationWrapper>
        <AboutUsHero />
      </ScrollAnimationWrapper>

      {/* About/Mission Section */}
      <ScrollAnimationWrapper>
        <AboutSection content={aboutContent} />
      </ScrollAnimationWrapper>

      {/* Adaptive Features */}
      <ScrollAnimationWrapper>
        <AdaptiveFeaturesSection features={adaptiveFeatures} />
      </ScrollAnimationWrapper>

      {/* Category Grid */}
      <ScrollAnimationWrapper>
        <CategoryGrid categories={categories} />
      </ScrollAnimationWrapper>

      {/* Testimonials */}
      <ScrollAnimationWrapper>
        <TestimonialsSection testimonials={testimonials} />
      </ScrollAnimationWrapper>

      {/* Instagram Feed */}
      <ScrollAnimationWrapper>
        <InstagramFeed username="hisi_studio" />
      </ScrollAnimationWrapper>

      {/* Footer */}
      <Footer links={footerLinks} socialLinks={socialLinks} />
    </div>
  )
}

export default HomePage
