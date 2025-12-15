import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'

const TestimonialsSection = ({ testimonials = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)

    const testimonialCount = testimonials.length

    // Navigate to next testimonial
    const nextTestimonial = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonialCount)
    }, [testimonialCount])

    // Navigate to previous testimonial
    const prevTestimonial = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + testimonialCount) % testimonialCount)
    }, [testimonialCount])

    // Auto-advance testimonials
    useEffect(() => {
        if (!isAutoPlaying || testimonialCount === 0) return

        const interval = setInterval(() => {
            nextTestimonial()
        }, 6000) // 6 seconds per testimonial

        return () => clearInterval(interval)
    }, [isAutoPlaying, nextTestimonial, testimonialCount])

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') {
                prevTestimonial()
                setIsAutoPlaying(false)
            } else if (e.key === 'ArrowRight') {
                nextTestimonial()
                setIsAutoPlaying(false)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [nextTestimonial, prevTestimonial])

    if (testimonials.length === 0) return null

    const currentTestimonial = testimonials[currentIndex]

    return (
        <section className="py-20 bg-gradient-to-br from-hisi-primary to-hisi-secondary relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold mb-4">
                        Customer Stories
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        What Our Customers Say
                    </h2>
                </div>

                {/* Testimonial Card */}
                <div
                    className="relative"
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}
                >
                    <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 relative">
                        {/* Quote Icon */}
                        <div className="absolute -top-6 left-8 w-12 h-12 bg-hisi-accent rounded-full flex items-center justify-center shadow-lg">
                            <Quote className="w-6 h-6 text-white" />
                        </div>

                        {/* Content */}
                        <div className="text-center mb-8">
                            {/* Rating */}
                            {currentTestimonial.rating && (
                                <div className="flex items-center justify-center space-x-1 mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-5 h-5 ${i < currentTestimonial.rating
                                                    ? 'text-amber-400 fill-amber-400'
                                                    : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Testimonial Text */}
                            <blockquote className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 italic">
                                "{currentTestimonial.content}"
                            </blockquote>

                            {/* Customer Info */}
                            <div className="flex items-center justify-center space-x-4">
                                {currentTestimonial.image && (
                                    <img
                                        src={currentTestimonial.image}
                                        alt={currentTestimonial.name}
                                        className="w-16 h-16 rounded-full object-cover border-4 border-hisi-primary/20"
                                    />
                                )}
                                <div className="text-left">
                                    <p className="font-bold text-gray-900 text-lg">
                                        {currentTestimonial.name}
                                    </p>
                                    {currentTestimonial.role && (
                                        <p className="text-gray-600 text-sm">
                                            {currentTestimonial.role}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Navigation Arrows */}
                        <div className="flex items-center justify-center space-x-4">
                            <button
                                onClick={() => {
                                    prevTestimonial()
                                    setIsAutoPlaying(false)
                                }}
                                className="w-12 h-12 bg-gray-100 hover:bg-hisi-primary hover:text-white rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-hisi-primary/50"
                                aria-label="Previous testimonial"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>

                            {/* Dots Indicator */}
                            <div className="flex space-x-2">
                                {testimonials.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setCurrentIndex(index)
                                            setIsAutoPlaying(false)
                                        }}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-hisi-primary ${index === currentIndex
                                                ? 'bg-hisi-primary w-8'
                                                : 'bg-gray-300 hover:bg-gray-400'
                                            }`}
                                        aria-label={`Go to testimonial ${index + 1}`}
                                        aria-current={index === currentIndex}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={() => {
                                    nextTestimonial()
                                    setIsAutoPlaying(false)
                                }}
                                className="w-12 h-12 bg-gray-100 hover:bg-hisi-primary hover:text-white rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-hisi-primary/50"
                                aria-label="Next testimonial"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Screen Reader Announcements */}
                    <div
                        className="sr-only"
                        role="status"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        Testimonial {currentIndex + 1} of {testimonials.length}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TestimonialsSection
