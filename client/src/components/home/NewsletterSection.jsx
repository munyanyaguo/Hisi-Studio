import { useState } from 'react'
import { Mail, CheckCircle, AlertCircle } from 'lucide-react'

const NewsletterSection = () => {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState('idle') // idle, loading, success, error
    const [message, setMessage] = useState('')

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return re.test(email)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validation
        if (!email) {
            setStatus('error')
            setMessage('Please enter your email address')
            return
        }

        if (!validateEmail(email)) {
            setStatus('error')
            setMessage('Please enter a valid email address')
            return
        }

        // Simulate API call
        setStatus('loading')

        // TODO: Replace with actual API call to backend
        setTimeout(() => {
            setStatus('success')
            setMessage('Thank you for subscribing! Check your inbox for a welcome email.')
            setEmail('')

            // Reset after 5 seconds
            setTimeout(() => {
                setStatus('idle')
                setMessage('')
            }, 5000)
        }, 1000)
    }

    return (
        <section className="py-20 bg-gradient-to-br from-hisi-primary via-hisi-secondary to-hisi-primary relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                        <Mail className="w-8 h-8 text-white" />
                    </div>

                    {/* Heading */}
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Stay Connected
                    </h2>
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Subscribe to our newsletter for exclusive offers, new arrivals, and adaptive fashion tips.
                    </p>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                        <div className="flex flex-col sm:flex-row gap-3 mb-4">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="flex-1 px-6 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={status === 'loading'}
                                aria-label="Email address"
                                aria-describedby={status === 'error' ? 'email-error' : undefined}
                            />
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="px-8 py-4 bg-hisi-accent text-white font-medium rounded-lg hover:bg-hisi-gold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl whitespace-nowrap"
                            >
                                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                            </button>
                        </div>

                        {/* Status Messages */}
                        {status === 'success' && (
                            <div
                                className="flex items-center justify-center space-x-2 text-white bg-green-500/20 backdrop-blur-sm px-4 py-3 rounded-lg animate-fadeIn"
                                role="alert"
                            >
                                <CheckCircle className="w-5 h-5" />
                                <span>{message}</span>
                            </div>
                        )}

                        {status === 'error' && (
                            <div
                                id="email-error"
                                className="flex items-center justify-center space-x-2 text-white bg-red-500/20 backdrop-blur-sm px-4 py-3 rounded-lg animate-fadeIn"
                                role="alert"
                            >
                                <AlertCircle className="w-5 h-5" />
                                <span>{message}</span>
                            </div>
                        )}
                    </form>

                    {/* Privacy Note */}
                    <p className="text-white/70 text-sm mt-6">
                        We respect your privacy. Unsubscribe at any time.
                    </p>
                </div>
            </div>
        </section>
    )
}

export default NewsletterSection
