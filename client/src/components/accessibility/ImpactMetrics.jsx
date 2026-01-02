import PropTypes from 'prop-types'
import { Users, Leaf, Heart, Globe } from 'lucide-react'

const iconMap = {
    users: Users,
    leaf: Leaf,
    heart: Heart,
    globe: Globe
}

const ImpactMetrics = ({ metrics }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric) => {
                const IconComponent = iconMap[metric.icon] || Heart
                return (
                    <div
                        key={metric.id}
                        className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-hisi-primary group"
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-hisi-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-hisi-primary group-hover:scale-110 transition-all duration-300">
                                <IconComponent className="w-8 h-8 text-hisi-primary group-hover:text-white transition-colors duration-300" />
                            </div>
                            <div className="text-4xl font-bold text-hisi-primary mb-2">
                                {metric.value}
                            </div>
                            <div className="text-sm font-semibold text-gray-900 mb-2">
                                {metric.label}
                            </div>
                            <p className="text-xs text-gray-600">
                                {metric.description}
                            </p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

ImpactMetrics.propTypes = {
    metrics: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            label: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            icon: PropTypes.string.isRequired
        })
    ).isRequired
}

export default ImpactMetrics
