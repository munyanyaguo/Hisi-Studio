import PropTypes from 'prop-types'
import { Accessibility, Lightbulb, Globe, Leaf, Heart, Star } from 'lucide-react'

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
                {/* Mission */}
                <div className="mb-20">
                    <div className="max-w-4xl mx-auto text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            {mission.title}
                        </h2>
                        <p className="text-xl text-gray-600 leading-relaxed mb-8">
                            {mission.description}
                        </p>
                    </div>

                    {/* Mission Points */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {mission.points.map((point, index) => (
                            <div
                                key={index}
                                className="flex items-start space-x-4 bg-gray-50 rounded-xl p-6 hover:bg-hisi-primary/5 transition-colors duration-300"
                            >
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-hisi-primary rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">{index + 1}</span>
                                    </div>
                                </div>
                                <p className="text-gray-700 leading-relaxed pt-1">{point}</p>
                            </div>
                        ))}
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

                    {/* Values Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {values.map((value) => {
                            const IconComponent = iconMap[value.icon] || Star
                            return (
                                <div
                                    key={value.id}
                                    className="bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-hisi-primary hover:shadow-xl transition-all duration-300 group"
                                >
                                    <div className="w-14 h-14 bg-hisi-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-hisi-primary group-hover:scale-110 transition-all duration-300">
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
        points: PropTypes.arrayOf(PropTypes.string).isRequired
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
