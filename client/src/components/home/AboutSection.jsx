import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'

const AboutSection = ({ content }) => {
    if (!content) return null

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Image */}
                    <div className="order-2 lg:order-1">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                            <img
                                src={content.image}
                                alt={content.title}
                                className="w-full h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="order-1 lg:order-2">
                        <div className="inline-block px-4 py-2 bg-hisi-primary/10 text-hisi-primary rounded-full text-sm font-semibold mb-4">
                            {content.subtitle}
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                            {content.title}
                        </h2>

                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            {content.description}
                        </p>

                        {/* Highlights */}
                        {content.highlights && content.highlights.length > 0 && (
                            <ul className="space-y-4 mb-8">
                                {content.highlights.map((highlight, index) => (
                                    <li key={index} className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 w-6 h-6 bg-hisi-primary rounded-full flex items-center justify-center mt-0.5">
                                            <Check className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-gray-700 text-base">{highlight}</span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* CTA Button */}
                        {content.cta && (
                            <Link
                                to={content.ctaLink}
                                className="inline-block bg-hisi-primary text-white px-8 py-4 rounded-lg font-medium hover:bg-hisi-primary/90 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-hisi-primary/50 shadow-lg hover:shadow-xl"
                            >
                                {content.cta}
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AboutSection
