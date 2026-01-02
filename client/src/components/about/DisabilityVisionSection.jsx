import PropTypes from 'prop-types'

const DisabilityVisionSection = ({ vision }) => {
    return (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <p className="text-hisi-primary font-semibold text-sm uppercase tracking-wider mb-2">
                        {vision.subtitle}
                    </p>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        {vision.title}
                    </h2>
                    <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                        {vision.description}
                    </p>
                </div>

                {/* Initiatives Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {vision.initiatives.map((initiative) => (
                        <div
                            key={initiative.id}
                            className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                        >
                            {/* Image */}
                            <div className="aspect-[16/10] overflow-hidden">
                                <img
                                    src={initiative.image}
                                    alt={initiative.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>

                            {/* Content */}
                            <div className="p-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-hisi-primary transition-colors duration-300">
                                    {initiative.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {initiative.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Call to Action */}
                <div className="mt-16 text-center">
                    <div className="inline-block bg-hisi-primary/5 border-2 border-hisi-primary/20 rounded-2xl p-8 max-w-2xl">
                        <p className="text-lg text-gray-700 mb-6">
                            Want to learn more about our accessibility initiatives and adaptive fashion methods?
                        </p>
                        <a
                            href="/accessibility"
                            className="inline-block bg-hisi-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-hisi-accent transition-colors duration-300 shadow-lg hover:shadow-xl"
                        >
                            Explore Our Accessibility Work
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

DisabilityVisionSection.propTypes = {
    vision: PropTypes.shape({
        title: PropTypes.string.isRequired,
        subtitle: PropTypes.string,
        description: PropTypes.string.isRequired,
        initiatives: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number.isRequired,
                title: PropTypes.string.isRequired,
                description: PropTypes.string.isRequired,
                image: PropTypes.string.isRequired
            })
        ).isRequired
    }).isRequired
}

export default DisabilityVisionSection
