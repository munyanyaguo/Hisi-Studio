import { Magnet, Accessibility, Sparkles, Maximize2, Zap, Heart } from 'lucide-react'

const iconMap = {
    Magnet,
    Accessibility,
    Sparkles,
    Maximize2,
    Zap,
    Heart,
}

const AdaptiveFeaturesSection = ({ features = [] }) => {
    return (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-block px-4 py-2 bg-hisi-accent/10 text-hisi-accent rounded-full text-sm font-semibold mb-4">
                        What Makes Us Different
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Adaptive Features
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Every piece is thoughtfully designed with features that make dressing easier,
                        more comfortable, and more inclusive for everyone.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature) => {
                        const IconComponent = iconMap[feature.icon] || Zap

                        return (
                            <div
                                key={feature.id}
                                className="group bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                            >
                                {/* Icon */}
                                <div className="w-14 h-14 bg-gradient-to-br from-hisi-primary to-hisi-secondary rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <IconComponent className="w-7 h-7 text-white" />
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-hisi-primary transition-colors duration-300">
                                    {feature.title}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        )
                    })}
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-12">
                    <p className="text-gray-600 mb-4">
                        Want to learn more about our inclusive design process?
                    </p>
                    <a
                        href="/accessibility"
                        className="inline-block text-hisi-primary font-semibold hover:text-hisi-accent transition-colors duration-300 border-b-2 border-hisi-primary hover:border-hisi-accent"
                    >
                        Explore Our Accessibility Commitment →
                    </a>
                </div>
            </div>
        </section>
    )
}

export default AdaptiveFeaturesSection
