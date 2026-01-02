import PropTypes from 'prop-types'

const StorySection = ({ story }) => {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Image */}
                    <div className="order-2 lg:order-1">
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src={story.image}
                                alt={story.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="order-1 lg:order-2 space-y-6">
                        <div>
                            <p className="text-hisi-primary font-semibold text-sm uppercase tracking-wider mb-2">
                                {story.subtitle}
                            </p>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                                {story.title}
                            </h2>
                        </div>

                        <p className="text-lg text-gray-600 leading-relaxed">
                            {story.description}
                        </p>

                        {/* Quote */}
                        {story.quote && (
                            <div className="border-l-4 border-hisi-accent pl-6 py-4 bg-gray-50 rounded-r-lg">
                                <blockquote className="text-xl font-medium text-gray-900 italic mb-2">
                                    "{story.quote}"
                                </blockquote>
                                <cite className="text-sm text-gray-600 not-italic">
                                    — {story.author}
                                </cite>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

StorySection.propTypes = {
    story: PropTypes.shape({
        title: PropTypes.string.isRequired,
        subtitle: PropTypes.string,
        description: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        quote: PropTypes.string,
        author: PropTypes.string
    }).isRequired
}

export default StorySection
