import PropTypes from 'prop-types'
import { Accessibility, Lightbulb, Globe, Leaf, Heart, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

const iconMap = {
    accessibility: Accessibility,
    lightbulb: Lightbulb,
    globe: Globe,
    leaf: Leaf,
    heart: Heart,
    star: Star
}

const MissionValuesSection = ({ mission, values }) => {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Mission - Image Right, Text Left with Right-aligned text */}
                <div className="mb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Text Content - Left side, Right-aligned */}
                        <div className="lg:text-right lg:pr-8">
                            <div className="inline-block px-4 py-2 bg-hisi-primary/10 text-hisi-primary text-sm font-semibold mb-4">
                                Our Purpose
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                {mission.title}
                            </h2>
                            <p className="text-xl text-gray-600 leading-relaxed mb-8">
                                {mission.description}
                            </p>

                            {/* Mission Points - Right aligned */}
                            <div className="space-y-4 mb-8">
                                {mission.points.map((point, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4 lg:flex-row-reverse bg-gray-50 p-4 hover:bg-hisi-primary/5 transition-colors duration-300"
                                    >
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-hisi-primary flex items-center justify-center">
                                                <span className="text-white font-bold text-sm">{index + 1}</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed">{point}</p>
                                    </div>
                                ))}
                            </div>

                            {/* CTA Button - Right aligned, Boxy */}
                            <Link
                                to="/about"
                                className="inline-block bg-hisi-primary text-white px-10 py-4 font-semibold uppercase tracking-wider hover:bg-hisi-primary/90 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-hisi-primary/50 shadow-lg hover:shadow-xl"
                            >
                                Learn More About Us
                            </Link>
                        </div>

                        {/* Image - Right side, same size as Featured Collection */}
                        <div className="order-first lg:order-last">
                            <div className="relative overflow-hidden shadow-2xl">
                                <img
                                    src={mission.image || '/images/about/mission.jpg'}
                                    alt="Our Mission"
                                    className="w-full h-[600px] object-cover"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Values */}
                <div>
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Our Values
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            The principles that guide everything we do
                        </p>
                    </div>

                    {/* Values Grid - Boxy Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {values.map((value) => {
                            const IconComponent = iconMap[value.icon] || Star
                            return (
                                <div
                                    key={value.id}
                                    className="bg-white border-2 border-gray-100 p-8 hover:border-hisi-primary hover:shadow-xl transition-all duration-300 group"
                                >
                                    <div className="w-14 h-14 bg-hisi-primary/10 flex items-center justify-center mb-6 group-hover:bg-hisi-primary group-hover:scale-110 transition-all duration-300">
                                        <IconComponent className="w-7 h-7 text-hisi-primary group-hover:text-white transition-colors duration-300" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                        {value.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {value.description}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}

MissionValuesSection.propTypes = {
    mission: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        points: PropTypes.arrayOf(PropTypes.string).isRequired,
        image: PropTypes.string
    }).isRequired,
    values: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            icon: PropTypes.string.isRequired
        })
    ).isRequired
}

export default MissionValuesSection
