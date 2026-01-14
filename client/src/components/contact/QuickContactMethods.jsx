import { Phone, Mail, MessageCircle, MapPin, Instagram, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getContactInfo } from '../../services/contactApi'

const QuickContactMethods = () => {
    const [contactMethods, setContactMethods] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchContactInfo = async () => {
            try {
                const response = await getContactInfo()
                const data = response.data || response

                // Map API data to component format
                const methods = [
                    {
                        icon: Phone,
                        title: 'Phone',
                        value: data.phone?.value || '+254 700 123 456',
                        action: data.phone?.action || 'tel:+254700123456',
                        actionLabel: 'Call Now',
                        availability: data.phone?.availability || 'Mon-Fri, 9AM-6PM EAT',
                        color: 'from-blue-500 to-cyan-500'
                    },
                    {
                        icon: MessageCircle,
                        title: 'WhatsApp',
                        value: data.whatsapp?.value || '+254 700 123 456',
                        action: data.whatsapp?.action || 'https://wa.me/254700123456',
                        actionLabel: 'Chat on WhatsApp',
                        availability: data.whatsapp?.availability || 'Usually responds in minutes',
                        color: 'from-green-500 to-emerald-500'
                    },
                    {
                        icon: Mail,
                        title: 'Email',
                        value: data.email?.value || 'hello@hisistudio.com',
                        action: data.email?.action || 'mailto:hello@hisistudio.com',
                        actionLabel: 'Send Email',
                        availability: data.email?.availability || 'Response within 24 hours',
                        color: 'from-purple-500 to-pink-500'
                    },
                    {
                        icon: Instagram,
                        title: 'Instagram',
                        value: data.instagram?.value || '@hisi_studio',
                        action: data.instagram?.action || 'https://www.instagram.com/hisi_studio/',
                        actionLabel: 'Message on Instagram',
                        availability: data.instagram?.availability || 'Active daily',
                        color: 'from-pink-500 to-orange-500'
                    }
                ]

                setContactMethods(methods)
            } catch (error) {
                console.error('Error fetching contact info:', error)
                // Set default values on error
                setContactMethods([
                    {
                        icon: Phone,
                        title: 'Phone',
                        value: '+254 700 123 456',
                        action: 'tel:+254700123456',
                        actionLabel: 'Call Now',
                        availability: 'Mon-Fri, 9AM-6PM EAT',
                        color: 'from-blue-500 to-cyan-500'
                    },
                    {
                        icon: MessageCircle,
                        title: 'WhatsApp',
                        value: '+254 700 123 456',
                        action: 'https://wa.me/254700123456',
                        actionLabel: 'Chat on WhatsApp',
                        availability: 'Usually responds in minutes',
                        color: 'from-green-500 to-emerald-500'
                    },
                    {
                        icon: Mail,
                        title: 'Email',
                        value: 'hello@hisistudio.com',
                        action: 'mailto:hello@hisistudio.com',
                        actionLabel: 'Send Email',
                        availability: 'Response within 24 hours',
                        color: 'from-purple-500 to-pink-500'
                    },
                    {
                        icon: Instagram,
                        title: 'Instagram',
                        value: '@hisi_studio',
                        action: 'https://www.instagram.com/hisi_studio/',
                        actionLabel: 'Message on Instagram',
                        availability: 'Active daily',
                        color: 'from-pink-500 to-orange-500'
                    }
                ])
            } finally {
                setLoading(false)
            }
        }

        fetchContactInfo()
    }, [])

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
        // Could add toast notification here
    }

    if (loading) {
        return (
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Prefer Another Way to Connect?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Choose your preferred communication channel
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white p-6 shadow-lg animate-pulse">
                                <div className="w-14 h-14 bg-gray-200 mb-4"></div>
                                <div className="h-6 bg-gray-200 mb-2"></div>
                                <div className="h-4 bg-gray-200 mb-4"></div>
                                <div className="h-10 bg-gray-200"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Prefer Another Way to Connect?
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Choose your preferred communication channel
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {contactMethods.map((method, index) => (
                        <div
                            key={index}
                            className="group bg-white p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-transparent relative overflow-hidden"
                        >
                            {/* Gradient Background on Hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${method.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                            {/* Icon - Boxy */}
                            <div className={`relative w-14 h-14 bg-gradient-to-br ${method.color} flex items-center justify-center mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                                <method.icon className="w-7 h-7 text-white" />
                            </div>

                            {/* Content */}
                            <div className="relative">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{method.title}</h3>
                                <p className="text-sm text-gray-600 mb-1 font-mono">{method.value}</p>

                                {/* Availability */}
                                <div className="flex items-center space-x-1 text-xs text-gray-500 mb-4">
                                    <Clock className="w-3 h-3" />
                                    <span>{method.availability}</span>
                                </div>

                                {/* Action Buttons - Boxy */}
                                <div className="flex space-x-2">
                                    <a
                                        href={method.action}
                                        target={method.action.startsWith('http') ? '_blank' : undefined}
                                        rel={method.action.startsWith('http') ? 'noopener noreferrer' : undefined}
                                        className={`flex-1 text-center px-4 py-2 bg-gradient-to-r ${method.color} text-white text-sm font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300`}
                                    >
                                        {method.actionLabel}
                                    </a>

                                    {method.title !== 'Instagram' && (
                                        <button
                                            onClick={() => copyToClipboard(method.value)}
                                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold transition-colors duration-300"
                                            title="Copy to clipboard"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Live Chat CTA - Boxy */}
                <div className="mt-12 text-center">
                    <div className="inline-block bg-white shadow-xl p-8 max-w-2xl">
                        <div className="flex items-center justify-center space-x-3 mb-4">
                            <div className="relative">
                                <MessageCircle className="w-8 h-8 text-hisi-primary" />
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Need Immediate Help?</h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Our team is online and ready to assist you with any questions
                        </p>
                        <button className="px-8 py-4 bg-gradient-to-r from-hisi-primary to-hisi-accent text-white font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center space-x-2 mx-auto">
                            <MessageCircle className="w-5 h-5" />
                            <span>Start Live Chat</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default QuickContactMethods
