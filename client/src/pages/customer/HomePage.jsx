import { useState, useEffect } from 'react'
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
import { getPageSections } from '../../services/cmsApi'

// Import fallback data for sections not yet fully API-integrated
import {
  heroSlides,
  aboutContent,
  adaptiveFeatures,
  testimonials,
  footerLinks,
  socialLinks,
} from '../../data/mockData'

// Helper to transform section content from API format to component format
const transformSectionContent = (sectionData) => {
  const result = {};
  if (sectionData && Array.isArray(sectionData)) {
    sectionData.forEach(item => {
      result[item.content_key] = item.content_value;
    });
  }
  return result;
};

const HomePage = () => {
  const [isHeroDark, setIsHeroDark] = useState(true)
  const [sectionContent, setSectionContent] = useState({})
  const [heroData, setHeroData] = useState(heroSlides)
  const [aboutData, setAboutData] = useState(aboutContent)

  // Fetch section content from CMS
  useEffect(() => {
    const fetchSectionContent = async () => {
      try {
        const data = await getPageSections('home');
        const sections = data.data || {};
        setSectionContent(sections);

        // Transform hero section into slides format
        if (sections.hero) {
          const heroContent = transformSectionContent(sections.hero);
          if (heroContent.title || heroContent.image_url) {
            const heroSlide = {
              id: 1,
              image: heroContent.image_url || '/images/hero/slide-1.jpg',
              title: heroContent.title || '2 THUKU 0 COLLECTION',
              subtitle: heroContent.subtitle || 'Adaptive Fashion for Everyone',
              cta: 'Shop Now',
              ctaLink: '/shop',
              isDark: true
            };
            // Keep original slides but update first one with CMS content
            setHeroData(prev => [heroSlide, ...prev.slice(1)]);
          }
        }

        // Transform about section
        if (sections.about) {
          const aboutContent = transformSectionContent(sections.about);
          setAboutData(prev => ({
            ...prev,
            title: aboutContent.title || prev.title,
            description: aboutContent.description || prev.description,
            image: aboutContent.image_url || prev.image,
            subtitle: aboutContent.subtitle || prev.subtitle
          }));
        }

        // Transform mission section and merge with about if needed
        if (sections.mission) {
          const missionContent = transformSectionContent(sections.mission);
          // Mission data can be used for AboutUsHero or another section
          setSectionContent(prev => ({
            ...prev,
            missionData: missionContent
          }));
        }
      } catch (error) {
        console.error('Failed to fetch section content:', error);
        // Use fallback data
      }
    };

    fetchSectionContent();
  }, []);

  const handleSlideChange = (slide) => {
    setIsHeroDark(slide.isDark !== false)
  }

  return (
    <div className="min-h-screen">
      <Navbar isHeroDark={isHeroDark} />

      {/* Hero Section */}
      <HeroSection slides={heroData} onSlideChange={handleSlideChange} />

      {/* Featured Products - Fetches from API when fetchFromApi is true */}
      <ScrollAnimationWrapper>
        <FeaturedProducts fetchFromApi={true} title="Featured Collection" />
      </ScrollAnimationWrapper>

      {/* About Us Hero - Full width image section */}
      <ScrollAnimationWrapper>
        <AboutUsHero missionData={sectionContent.missionData} />
      </ScrollAnimationWrapper>

      {/* About/Mission Section */}
      <ScrollAnimationWrapper>
        <AboutSection content={aboutData} />
      </ScrollAnimationWrapper>

      {/* Adaptive Features */}
      <ScrollAnimationWrapper>
        <AdaptiveFeaturesSection features={adaptiveFeatures} />
      </ScrollAnimationWrapper>

      {/* Category Grid - Fetches from API when fetchFromApi is true */}
      <ScrollAnimationWrapper>
        <CategoryGrid fetchFromApi={true} />
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

