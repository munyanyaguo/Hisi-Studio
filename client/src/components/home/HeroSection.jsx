import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const HeroSection = ({ slides = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const slideCount = slides.length

  // Navigate to next slide
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slideCount)
  }, [slideCount])

  // Navigate to previous slide
  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount)
  }, [slideCount])

  // Go to specific slide
  const goToSlide = (index) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
  }

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying || slideCount === 0) return

    const interval = setInterval(() => {
      nextSlide()
    }, 5000) // 5 seconds per slide

    return () => clearInterval(interval)
  }, [isAutoPlaying, nextSlide, slideCount])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide()
        setIsAutoPlaying(false)
      } else if (e.key === 'ArrowRight') {
        nextSlide()
        setIsAutoPlaying(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextSlide, prevSlide])

  // Handle touch gestures for mobile
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      nextSlide()
      setIsAutoPlaying(false)
    } else if (isRightSwipe) {
      prevSlide()
      setIsAutoPlaying(false)
    }

    // Reset
    setTouchStart(0)
    setTouchEnd(0)
  }

  // Default slides if none provided
  const defaultSlides = [
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

  const displaySlides = slides.length > 0 ? slides : defaultSlides

  if (displaySlides.length === 0) {
    return null
  }

  return (
    <section
      className="relative h-screen w-full overflow-hidden bg-gray-900"
      role="region"
      aria-label="Hero carousel"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      <div className="relative h-full w-full">
        {displaySlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
            aria-hidden={index !== currentSlide}
          >
            {/* Background Image */}
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
              loading={index === 0 ? 'eager' : 'lazy'}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center text-center px-4">
              <div className="max-w-4xl animate-fadeInUp">
                <h2 className="text-white text-5xl sm:text-6xl md:text-7xl font-bold mb-4 tracking-tight">
                  {slide.title}
                </h2>
                <p className="text-white/90 text-xl sm:text-2xl md:text-3xl font-light mb-8">
                  {slide.subtitle}
                </p>
                {slide.cta && (
                  <a
                    href={slide.ctaLink}
                    className="inline-block bg-white text-gray-900 px-8 py-4 text-lg font-medium hover:bg-hisi-primary hover:text-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50 rounded-lg"
                  >
                    {slide.cta}
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => {
          prevSlide()
          setIsAutoPlaying(false)
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={() => {
          nextSlide()
          setIsAutoPlaying(false)
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3"
        role="tablist"
        aria-label="Slide navigation"
      >
        {displaySlides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 ${
              index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-selected={index === currentSlide}
            role="tab"
          />
        ))}
      </div>

      {/* Screen Reader Announcements */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        Slide {currentSlide + 1} of {displaySlides.length}:{' '}
        {displaySlides[currentSlide].title}
      </div>
    </section>
  )
}

export default HeroSection
