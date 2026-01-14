import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Star, Quote, PenLine, X } from 'lucide-react'
import { getReviews, submitReview } from '../../services/reviewsApi'
import { useAuth } from '../../contexts/AuthContext'

const TestimonialsSection = ({ testimonials: propTestimonials = [] }) => {
    const { user } = useAuth()
    const [reviews, setReviews] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)
    const [loading, setLoading] = useState(true)
    const [showReviewForm, setShowReviewForm] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' })
    const [reviewForm, setReviewForm] = useState({
        rating: 5,
        title: '',
        content: ''
    })

    // Fetch reviews from API
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await getReviews({ perPage: 10, featured: false })
                if (response.data && response.data.length > 0) {
                    // Transform API response to match testimonial format
                    const transformedReviews = response.data.map(review => ({
                        id: review.id,
                        name: review.user?.name || 'Anonymous',
                        role: 'Verified Customer',
                        content: review.content,
                        rating: review.rating,
                        image: null // Users don't have profile images in this system
                    }))
                    setReviews(transformedReviews)
                } else {
                    // Fallback to prop testimonials if no API data
                    setReviews(propTestimonials)
                }
            } catch (error) {
                console.error('Error fetching reviews:', error)
                // Fallback to prop testimonials on error
                setReviews(propTestimonials)
            } finally {
                setLoading(false)
            }
        }

        fetchReviews()
    }, [propTestimonials])

    const displayReviews = reviews.length > 0 ? reviews : propTestimonials
    const reviewCount = displayReviews.length

    // Navigate to next testimonial
    const nextTestimonial = useCallback(() => {
        if (reviewCount === 0) return
        setCurrentIndex((prev) => (prev + 1) % reviewCount)
    }, [reviewCount])

    // Navigate to previous testimonial
    const prevTestimonial = useCallback(() => {
        if (reviewCount === 0) return
        setCurrentIndex((prev) => (prev - 1 + reviewCount) % reviewCount)
    }, [reviewCount])

    // Auto-advance testimonials
    useEffect(() => {
        if (!isAutoPlaying || reviewCount === 0) return

        const interval = setInterval(() => {
            nextTestimonial()
        }, 6000) // 6 seconds per testimonial

        return () => clearInterval(interval)
    }, [isAutoPlaying, nextTestimonial, reviewCount])

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

    // Handle review submission
    const handleSubmitReview = async (e) => {
        e.preventDefault()

        if (!reviewForm.content.trim()) {
            setSubmitMessage({ type: 'error', text: 'Please write your review' })
            return
        }

        setSubmitting(true)
        setSubmitMessage({ type: '', text: '' })

        try {
            await submitReview({
                rating: reviewForm.rating,
                title: reviewForm.title,
                content: reviewForm.content
            })

            setSubmitMessage({
                type: 'success',
                text: 'Thank you! Your review has been submitted and will appear after approval.'
            })
            setReviewForm({ rating: 5, title: '', content: '' })

            // Close form after 3 seconds
            setTimeout(() => {
                setShowReviewForm(false)
                setSubmitMessage({ type: '', text: '' })
            }, 3000)
        } catch (error) {
            setSubmitMessage({
                type: 'error',
                text: error.message || 'Failed to submit review. Please try again.'
            })
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <section className="py-20 bg-gradient-to-br from-hisi-primary to-hisi-secondary">
                <div className="max-w-5xl mx-auto px-4 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
            </section>
        )
    }

    if (displayReviews.length === 0) return null

    const currentTestimonial = displayReviews[currentIndex]

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
                    <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold mb-4">
                        Customer Reviews
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        What Our Customers Say
                    </h2>

                    {/* Write Review Button - Only for logged in users */}
                    {user && (
                        <button
                            onClick={() => setShowReviewForm(true)}
                            className="mt-4 inline-flex items-center space-x-2 bg-white text-hisi-primary px-6 py-3 font-semibold hover:bg-white/90 transition-colors"
                        >
                            <PenLine className="w-5 h-5" />
                            <span>Write a Review</span>
                        </button>
                    )}
                </div>

                {/* Review Form Modal */}
                {showReviewForm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white max-w-md w-full p-6 relative animate-fadeIn">
                            <button
                                onClick={() => setShowReviewForm(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Write a Review</h3>

                            <form onSubmit={handleSubmitReview} className="space-y-4">
                                {/* Rating */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                                    <div className="flex space-x-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                                                className="focus:outline-none"
                                            >
                                                <Star
                                                    className={`w-8 h-8 transition-colors ${star <= reviewForm.rating
                                                            ? 'text-amber-400 fill-amber-400'
                                                            : 'text-gray-300'
                                                        }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Title (optional)</label>
                                    <input
                                        type="text"
                                        value={reviewForm.title}
                                        onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                                        placeholder="Summarize your experience"
                                        className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-hisi-primary"
                                    />
                                </div>

                                {/* Content */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Your Review</label>
                                    <textarea
                                        value={reviewForm.content}
                                        onChange={(e) => setReviewForm(prev => ({ ...prev, content: e.target.value }))}
                                        placeholder="Share your experience with our products..."
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-hisi-primary resize-none"
                                        required
                                    />
                                </div>

                                {/* Submit Message */}
                                {submitMessage.text && (
                                    <div className={`p-3 text-sm ${submitMessage.type === 'success'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                        }`}>
                                        {submitMessage.text}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-hisi-primary text-white py-3 font-semibold hover:bg-hisi-primary/90 transition-colors disabled:opacity-50"
                                >
                                    {submitting ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Testimonial Card */}
                <div
                    className="relative"
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}
                >
                    <div className="bg-white shadow-2xl p-8 md:p-12 relative">
                        {/* Quote Icon */}
                        <div className="absolute -top-6 left-8 w-12 h-12 bg-hisi-accent flex items-center justify-center shadow-lg">
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
                                className="w-12 h-12 bg-gray-100 hover:bg-hisi-primary hover:text-white flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-hisi-primary/50"
                                aria-label="Previous testimonial"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>

                            {/* Dots Indicator */}
                            <div className="flex space-x-2">
                                {displayReviews.map((_, index) => (
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
                                className="w-12 h-12 bg-gray-100 hover:bg-hisi-primary hover:text-white flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-hisi-primary/50"
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
                        Review {currentIndex + 1} of {displayReviews.length}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TestimonialsSection
