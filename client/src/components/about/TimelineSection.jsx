import PropTypes from 'prop-types'

const TimelineSection = ({ timeline }) => {
    return (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Our Journey
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        From a vision to a movement—discover the milestones that shaped Hisi Studio
                    </p>
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* Center Line - Hidden on mobile */}
                    <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-hisi-primary via-hisi-accent to-hisi-primary opacity-20"></div>

                    {/* Timeline Items */}
                    <div className="space-y-12 lg:space-y-24">
                        {timeline.map((item, index) => (
                            <div
                                key={item.id}
                                className={`relative flex flex-col lg:flex-row items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                                    }`}
                            >
                                {/* Content - Boxy Card */}
                                <div className="w-full lg:w-5/12 mb-6 lg:mb-0">
                                    <div
                                        className={`bg-white shadow-lg p-8 hover:shadow-2xl transition-shadow duration-300 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'
                                            }`}
                                    >
                                        <span className="inline-block px-4 py-1 bg-hisi-primary text-white text-sm font-bold mb-4">
                                            {item.year}
                                        </span>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Center Dot - Keep rounded for visual flow */}
                                <div className="hidden lg:flex w-2/12 justify-center">
                                    <div className="w-6 h-6 bg-hisi-accent rounded-full border-4 border-white shadow-lg z-10"></div>
                                </div>

                                {/* Image - Boxy */}
                                <div className="w-full lg:w-5/12">
                                    <div className="aspect-[4/3] overflow-hidden shadow-xl">
                                        <img
                                            src={item.image}
                                            alt={`${item.year} - ${item.title}`}
                                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

TimelineSection.propTypes = {
    timeline: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            year: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            image: PropTypes.string.isRequired
        })
    ).isRequired
}

export default TimelineSection
