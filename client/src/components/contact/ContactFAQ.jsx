import { useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'

const ContactFAQ = () => {
    const [openIndex, setOpenIndex] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')

    const faqs = [
        {
            category: 'orders',
            question: 'How long does it take to process a custom order?',
            answer: 'Custom orders typically take 2-4 weeks depending on complexity. We\'ll provide a detailed timeline after reviewing your requirements during the consultation.'
        },
        {
            category: 'orders',
            question: 'Can I request modifications to existing designs?',
            answer: 'Absolutely! We can modify any of our existing designs to include specific adaptive features or adjust sizing to meet your needs.'
        },
        {
            category: 'accessibility',
            question: 'What adaptive features do you offer?',
            answer: 'We offer magnetic closures, adjustable waistbands, wheelchair-friendly designs, sensory-friendly fabrics, easy-grip zippers, and many more features. Each piece can be customized to your specific needs.'
        },
        {
            category: 'accessibility',
            question: 'Do you offer free accessibility consultations?',
            answer: 'Yes! We offer complimentary 30-minute consultations to help you find the perfect adaptive solutions for your lifestyle and needs.'
        },
        {
            category: 'shipping',
            question: 'Do you ship internationally?',
            answer: 'Currently, we ship within Kenya. International shipping is coming soon! Join our mailing list to be notified when we expand.'
        },
        {
            category: 'shipping',
            question: 'What are the shipping costs?',
            answer: 'Shipping within Nairobi is KES 300. Outside Nairobi is KES 500-800 depending on location. Free shipping on orders over KES 15,000.'
        },
        {
            category: 'returns',
            question: 'What is your return policy?',
            answer: 'We offer 30-day returns on all standard items. Custom orders can be returned within 14 days if there\'s a manufacturing defect. We want you to be completely satisfied!'
        },
        {
            category: 'returns',
            question: 'How do I initiate a return?',
            answer: 'Contact us via email or phone with your order number. We\'ll provide a return label and guide you through the process.'
        },
        {
            category: 'general',
            question: 'Do you have a physical showroom?',
            answer: 'Yes! Visit us at Westlands, Nairobi. We recommend booking an appointment for personalized attention, but walk-ins are welcome during business hours.'
        },
        {
            category: 'general',
            question: 'How can I become a wholesale partner?',
            answer: 'We\'d love to partner with you! Fill out the Partnership inquiry form above or email us at partnerships@hisistudio.com with details about your business.'
        }
    ]

    const categories = [
        { id: 'all', label: 'All Questions' },
        { id: 'orders', label: 'Orders & Custom Requests' },
        { id: 'accessibility', label: 'Accessibility' },
        { id: 'shipping', label: 'Shipping' },
        { id: 'returns', label: 'Returns & Exchanges' },
        { id: 'general', label: 'General' }
    ]

    const filteredFaqs = faqs.filter(faq => {
        const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
        const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesCategory && matchesSearch
    })

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-lg text-gray-600">
                        Quick answers to common questions
                    </p>
                </div>

                {/* Search Bar - Boxy */}
                <div className="mb-8">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 focus:border-hisi-primary focus:ring-2 focus:ring-hisi-primary/20 transition-all duration-300"
                        />
                    </div>
                </div>

                {/* Category Filter - Boxy */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${selectedCategory === cat.id
                                ? 'bg-hisi-primary text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* FAQ Accordion - Boxy */}
                <div className="space-y-4">
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white border-2 border-gray-100 overflow-hidden hover:border-hisi-primary/30 transition-all duration-300"
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-300"
                                >
                                    <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                                    <ChevronDown
                                        className={`w-5 h-5 text-hisi-primary flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>

                                <div
                                    className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'
                                        }`}
                                >
                                    <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 mb-4">No questions found matching your search.</p>
                            <button
                                onClick={() => {
                                    setSearchTerm('')
                                    setSelectedCategory('all')
                                }}
                                className="text-hisi-primary hover:text-hisi-accent font-semibold"
                            >
                                Clear filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Still Have Questions CTA - Boxy */}
                <div className="mt-12 text-center bg-gradient-to-br from-hisi-primary/5 to-hisi-accent/5 p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        Still Have Questions?
                    </h3>
                    <p className="text-gray-600 mb-6">
                        We're here to help! Reach out to us directly.
                    </p>
                    <button
                        onClick={() => {
                            const formSection = document.getElementById('contact-form')
                            formSection?.scrollIntoView({ behavior: 'smooth' })
                        }}
                        className="px-8 py-3 bg-gradient-to-r from-hisi-primary to-hisi-accent text-white font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                    >
                        Contact Us
                    </button>
                </div>
            </div>
        </section>
    )
}

export default ContactFAQ
