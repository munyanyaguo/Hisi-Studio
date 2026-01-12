import { useState, useEffect } from 'react'
import {
    Mail, Send, Clock, CheckCircle, Sparkles, Heart, Users, Zap
} from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import QuickContactMethods from '../../components/contact/QuickContactMethods'
import ContactFAQ from '../../components/contact/ContactFAQ'
import LocationMap from '../../components/contact/LocationMap'
import ContactTestimonials from '../../components/contact/ContactTestimonials'
import BookingSystem from '../../components/contact/BookingSystem'
import { footerLinks, socialLinks } from '../../data/mockData'
import { getContactStats, submitContactForm } from '../../services/contactApi'

const ContactPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('general')
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        category: 'general',
        message: '',
        consultationType: '',
        orderDetails: '',
        partnershipType: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)
    const [submitError, setSubmitError] = useState('')
    const [stats, setStats] = useState(null)
    const [statsLoading, setStatsLoading] = useState(true)

    // Fetch stats on mount
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await getContactStats()
                setStats(response.data)
            } catch (error) {
                console.error('Failed to load stats:', error)
                // Keep default values if fetch fails
            } finally {
                setStatsLoading(false)
            }
        }
        fetchStats()
    }, [])

    const categories = [
        { id: 'general', label: 'General Inquiry', responseTime: '24 hours', icon: Mail },
        { id: 'custom', label: 'Custom Orders', responseTime: '48 hours', icon: Sparkles },
        { id: 'accessibility', label: 'Accessibility Consultation', responseTime: '24 hours', icon: Heart },
        { id: 'partnership', label: 'Partnership/Wholesale', responseTime: '3-5 days', icon: Users },
        { id: 'press', label: 'Press/Media', responseTime: '48 hours', icon: Send },
    ]

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitError('')

        try {
            await submitContactForm(formData)
            setSubmitSuccess(true)

            // Reset form after 5 seconds
            setTimeout(() => {
                setSubmitSuccess(false)
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    category: selectedCategory,
                    message: '',
                    consultationType: '',
                    orderDetails: '',
                    partnershipType: '',
                })
            }, 5000)
        } catch (error) {
            console.error('Form submission error:', error)
            setSubmitError(error.message || 'Failed to send message. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <>
            <Navbar isHeroDark={true} />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
                {/* Hero Section */}
                <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0">
                        <img
                            src="/images/contact-hero.png"
                            alt="Person using braille communication device"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/85 to-gray-900/70"></div>
                    </div>

                    {/* Animated Accent Elements */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-20 left-10 w-72 h-72 bg-hisi-primary/20 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-20 right-10 w-96 h-96 bg-hisi-accent/20 rounded-full blur-3xl animate-pulse"></div>
                    </div>

                    <div className="relative max-w-7xl mx-auto h-full flex flex-col justify-between min-h-[600px]">
                        <div className="w-full pt-12 text-center">
                            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                                <Heart className="w-4 h-4 text-white" />
                                <span className="text-sm font-semibold text-white">We're Here to Help</span>
                            </div>

                            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                                Let's Get in Touch
                            </h1>

                            <p className="text-xl text-gray-200 mb-12 max-w-3xl mx-auto">
                                Whether you need adaptive clothing for visual impairments, custom pieces with tactile elements,
                                accessibility consultations, or just want to connect – we're excited to hear from you.
                                Every conversation matters, and every voice is valued.
                            </p>
                        </div>

                        {/* Quick Stats - Positioned at Bottom */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto w-full pb-8">
                            <div className="bg-transparent backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/5 transition-all duration-300">
                                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
                                    <Clock className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-3xl font-bold text-white mb-2">
                                    {statsLoading || !stats ? '...' : `${stats.response_rate}%`}
                                </div>
                                <div className="text-sm text-gray-300">Response Rate</div>
                            </div>

                            <div className="bg-transparent backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/5 transition-all duration-300">
                                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-3xl font-bold text-white mb-2">
                                    {statsLoading || !stats ? '...' : `${stats.completed_consultations}+`}
                                </div>
                                <div className="text-sm text-gray-300">Consultations Completed</div>
                            </div>

                            <div className="bg-transparent backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/5 transition-all duration-300">
                                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-3xl font-bold text-white mb-2">
                                    {statsLoading || !stats ? '...' : `${stats.total_orders}+`}
                                </div>
                                <div className="text-sm text-gray-300">Orders Fulfilled</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Contact Us Section */}
                <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                How Can We Help You Today?
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Choose the service that best fits your needs
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    icon: Sparkles,
                                    title: 'Personalized Styling',
                                    description: 'Expert advice on adaptive fashion including tactile elements, braille labels, and designs for visual impairments',
                                    color: 'from-purple-500 to-pink-500',
                                    category: 'accessibility',
                                    consultationType: 'styling'
                                },
                                {
                                    icon: Zap,
                                    title: 'Custom Orders',
                                    description: 'Bespoke pieces with tactile identifiers, easy-to-navigate closures, and features tailored for blind and visually impaired individuals',
                                    color: 'from-blue-500 to-cyan-500',
                                    category: 'custom',
                                    consultationType: ''
                                },
                                {
                                    icon: Heart,
                                    title: 'Accessibility Consultations',
                                    description: 'Free consultations for visual impairments, tactile navigation systems, and adaptive features for independent dressing',
                                    color: 'from-red-500 to-orange-500',
                                    category: 'accessibility',
                                    consultationType: 'accessibility'
                                },
                                {
                                    icon: Users,
                                    title: 'Partnership Opportunities',
                                    description: 'Collaborate with us on inclusive fashion initiatives, community programs, and accessibility advocacy',
                                    color: 'from-green-500 to-emerald-500',
                                    category: 'partnership',
                                    consultationType: ''
                                }
                            ].map((service, index) => (
                                <div
                                    key={index}
                                    onClick={() => {
                                        // Set the category
                                        setSelectedCategory(service.category)
                                        setFormData({
                                            ...formData,
                                            category: service.category,
                                            consultationType: service.consultationType
                                        })
                                        // Scroll to form
                                        const formSection = document.getElementById('contact-form')
                                        formSection?.scrollIntoView({ behavior: 'smooth' })
                                    }}
                                    className="group relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-transparent overflow-hidden cursor-pointer"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                                    <div className={`w-14 h-14 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300`}>
                                        <service.icon className="w-7 h-7 text-white" />
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>

                                    <div className="mt-4 text-sm font-semibold text-hisi-primary group-hover:text-hisi-accent transition-colors duration-300 flex items-center space-x-1">
                                        <span>Get Started</span>
                                        <Send className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Form Section */}
                <section id="contact-form" className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-5xl mx-auto">
                        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                            <div className="bg-gradient-to-r from-hisi-primary to-hisi-accent p-1">
                                <div className="bg-white rounded-t-3xl">
                                    <div className="flex overflow-x-auto scrollbar-hide">
                                        {categories.map((cat) => (
                                            <button
                                                key={cat.id}
                                                onClick={() => {
                                                    setSelectedCategory(cat.id)
                                                    setFormData({ ...formData, category: cat.id })
                                                }}
                                                className={`flex-1 min-w-[150px] px-4 py-4 text-sm font-medium transition-all duration-300 ${selectedCategory === cat.id
                                                    ? 'bg-hisi-primary/10 text-hisi-primary border-2 border-hisi-primary shadow-md'
                                                    : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100 hover:text-hisi-primary'
                                                    }`}
                                            >
                                                <div className="flex flex-col items-center space-y-1">
                                                    <cat.icon className={`w-5 h-5 ${selectedCategory === cat.id ? 'text-hisi-primary' : 'text-gray-600'}`} />
                                                    <span className="hidden sm:inline font-semibold">{cat.label}</span>
                                                    <span className={`text-xs ${selectedCategory === cat.id ? 'text-hisi-primary/80' : 'text-gray-500'}`}>
                                                        ~{cat.responseTime}
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-8">
                                {submitSuccess ? (
                                    <div className="text-center py-12">
                                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <CheckCircle className="w-12 h-12 text-green-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Message Sent Successfully!</h3>
                                        <p className="text-gray-600 mb-6">
                                            We've received your message and will get back to you within{' '}
                                            <span className="font-semibold text-hisi-primary">
                                                {categories.find(c => c.id === selectedCategory)?.responseTime}
                                            </span>
                                        </p>
                                        <button
                                            onClick={() => setSubmitSuccess(false)}
                                            className="px-6 py-3 bg-hisi-primary text-white rounded-lg hover:bg-hisi-accent transition-colors duration-300"
                                        >
                                            Send Another Message
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {submitError && (
                                            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start space-x-3">
                                                <div className="flex-shrink-0">
                                                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-sm font-semibold text-red-800">Error sending message</h3>
                                                    <p className="text-sm text-red-700 mt-1">{submitError}</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Full Name <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    required
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hisi-primary focus:border-transparent transition-all duration-300"
                                                    placeholder="John Doe"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Email Address <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hisi-primary focus:border-transparent transition-all duration-300"
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                                                Phone Number (Optional)
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hisi-primary focus:border-transparent transition-all duration-300"
                                                placeholder="+254 700 000 000"
                                            />
                                        </div>

                                        {selectedCategory === 'custom' && (
                                            <div>
                                                <label htmlFor="orderDetails" className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Order Details
                                                </label>
                                                <textarea
                                                    id="orderDetails"
                                                    name="orderDetails"
                                                    value={formData.orderDetails}
                                                    onChange={handleInputChange}
                                                    rows={3}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hisi-primary focus:border-transparent transition-all duration-300"
                                                    placeholder="Describe your custom order requirements..."
                                                />
                                            </div>
                                        )}

                                        {selectedCategory === 'accessibility' && (
                                            <div>
                                                <label htmlFor="consultationType" className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Consultation Type
                                                </label>
                                                <select
                                                    id="consultationType"
                                                    name="consultationType"
                                                    value={formData.consultationType}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hisi-primary focus:border-transparent transition-all duration-300"
                                                >
                                                    <option value="">Select consultation type</option>
                                                    <option value="visual-impairment">Visual Impairment / Blindness</option>
                                                    <option value="tactile-elements">Tactile Elements & Braille Labels</option>
                                                    <option value="wheelchair">Wheelchair-Friendly Clothing</option>
                                                    <option value="sensory">Sensory-Friendly Options</option>
                                                    <option value="dexterity">Limited Dexterity Solutions</option>
                                                    <option value="general">General Accessibility</option>
                                                </select>
                                            </div>
                                        )}

                                        {selectedCategory === 'partnership' && (
                                            <div>
                                                <label htmlFor="partnershipType" className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Partnership Type
                                                </label>
                                                <select
                                                    id="partnershipType"
                                                    name="partnershipType"
                                                    value={formData.partnershipType}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hisi-primary focus:border-transparent transition-all duration-300"
                                                >
                                                    <option value="">Select partnership type</option>
                                                    <option value="wholesale">Wholesale</option>
                                                    <option value="retail">Retail Partnership</option>
                                                    <option value="collaboration">Brand Collaboration</option>
                                                    <option value="community">Community Initiative</option>
                                                </select>
                                            </div>
                                        )}

                                        <div>
                                            <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                                                Your Message <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                required
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                rows={6}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hisi-primary focus:border-transparent transition-all duration-300"
                                                placeholder="Tell us more about how we can help you..."
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-hisi-primary/10 text-hisi-primary border-2 border-hisi-primary font-bold py-4 px-6 rounded-lg hover:bg-hisi-primary/20 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-hisi-primary border-t-transparent rounded-full animate-spin"></div>
                                                    <span>Sending...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-5 h-5" />
                                                    <span>Send Message</span>
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <QuickContactMethods />
                <BookingSystem />
                <LocationMap />
                <ContactTestimonials />
                <ContactFAQ />
            </div>
            <Footer links={footerLinks} socialLinks={socialLinks} />
        </>
    )
}

export default ContactPage
