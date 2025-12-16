import { useState } from 'react'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const ContactTestimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0)

    const testimonials = [
        {
            name: 'Grace Wanjiku',
            role: 'Custom Order Client',
            image: 'https://ui-avatars.com/api/?name=Grace+Wanjiku&background=8B5CF6&color=fff&size=200',
            story: 'I reached out to Hisi Studio for a custom wheelchair-friendly dress for my sister\'s wedding. The team was incredibly patient, understanding my needs perfectly. The final piece was stunning and made me feel confident and beautiful.',
            result: 'Perfect custom dress delivered in 3 weeks',
            rating: 5
        },
        {
            name: 'David Kimani',
            role: 'Accessibility Consultation',
            image: 'https://ui-avatars.com/api/?name=David+Kimani&background=3B82F6&color=fff&size=200',
            story: 'As someone with limited dexterity, finding stylish clothing was always frustrating. The accessibility consultation changed everything. They introduced me to magnetic closures and adaptive features I didn\'t know existed.',
            result: 'Found 5 perfect pieces in one consultation',
            rating: 5
        },
        {
            name: 'Amina Hassan',
            role: 'Partnership Inquiry',
            image: 'https://ui-avatars.com/api/?name=Amina+Hassan&background=EC4899&color=fff&size=200',
            story: 'I contacted Hisi Studio about a wholesale partnership for my boutique. Their response was professional and welcoming. We now stock their adaptive collection and our customers love it!',
            result: 'Successful wholesale partnership established',
            rating: 5
        },
        {
            name: 'James Omondi',
            role: 'General Inquiry',
            image: 'https://ui-avatars.com/api/?name=James+Omondi&background=10B981&color=fff&size=200',
            story: 'I had questions about sensory-friendly fabrics for my son. The team responded within hours with detailed information and product recommendations. Their knowledge and care were exceptional.',
            result: 'Found perfect sensory-friendly options',
            rating: 5
        }
    ]

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    }

    const currentTestimonial = testimonials[currentIndex]

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Success Stories
                    </h2>
                    <p className="text-lg text-gray-600">
                        Hear from customers who reached out to us
                    </p>
                </div>

                <div className="relative">
                    {/* Main Testimonial Card */}
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-2xl overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 p-8 md:p-12">
                            {/* Image Section */}
                            <div className="md:col-span-2 flex flex-col items-center justify-center">
                                <div className="relative">
                                    <div className="absolute -inset-4 bg-gradient-to-br from-hisi-primary to-hisi-accent rounded-full blur-2xl opacity-20"></div>
                                    <img
                                        src={currentTestimonial.image}
                                        alt={currentTestimonial.name}
                                        className="relative w-48 h-48 rounded-full object-cover border-4 border-white shadow-xl"
                                    />
                                </div>

                                <div className="mt-6 text-center">
                                    <h3 className="text-2xl font-bold text-gray-900">{currentTestimonial.name}</h3>
                                    <p className="text-hisi-primary font-medium mt-1">{currentTestimonial.role}</p>

                                    {/* Star Rating */}
                                    <div className="flex items-center justify-center space-x-1 mt-3">
                                        {[...Array(currentTestimonial.rating)].map((_, i) => (
                                            <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="md:col-span-3 flex flex-col justify-center">
                                <Quote className="w-12 h-12 text-hisi-primary/20 mb-4" />

                                <p className="text-lg text-gray-700 leading-relaxed mb-6 italic">
                                    "{currentTestimonial.story}"
                                </p>

                                <div className="bg-gradient-to-r from-hisi-primary/10 to-hisi-accent/10 rounded-xl p-4 border-l-4 border-hisi-primary">
                                    <p className="text-sm font-semibold text-gray-900">
                                        ✨ {currentTestimonial.result}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-center space-x-4 mt-8">
                        <button
                            onClick={prevTestimonial}
                            className="w-12 h-12 bg-white hover:bg-hisi-primary text-gray-700 hover:text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>

                        {/* Dots Indicator */}
                        <div className="flex space-x-2">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`transition-all duration-300 rounded-full ${index === currentIndex
                                            ? 'w-8 h-3 bg-hisi-primary'
                                            : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                                        }`}
                                    aria-label={`Go to testimonial ${index + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextTestimonial}
                            className="w-12 h-12 bg-white hover:bg-hisi-primary text-gray-700 hover:text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
                            aria-label="Next testimonial"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <p className="text-gray-600 mb-4">
                        Ready to start your own success story?
                    </p>
                    <button
                        onClick={() => {
                            const formSection = document.getElementById('contact-form')
                            formSection?.scrollIntoView({ behavior: 'smooth' })
                        }}
                        className="px-8 py-3 bg-gradient-to-r from-hisi-primary to-hisi-accent text-white font-semibold rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                    >
                        Get in Touch
                    </button>
                </div>
            </div>
        </section>
    )
}

export default ContactTestimonials
