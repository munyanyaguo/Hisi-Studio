import PropTypes from 'prop-types'
import { ExternalLink, Calendar, Tag } from 'lucide-react'

const MediaCard = ({ article, featured = false }) => {
    return (
        <div
            className={`group bg-white overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 ${featured ? 'border-2 border-hisi-primary' : ''
                }`}
        >

            {/* Image */}
            <div className="aspect-[16/10] overflow-hidden relative">
                <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Meta Info */}
                <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Tag className="w-4 h-4" />
                        <span>{article.category}</span>
                    </div>
                </div>

                {/* Outlet */}
                <p className="text-hisi-primary font-semibold text-sm mb-2">
                    {article.outlet}
                </p>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-hisi-primary transition-colors duration-300 line-clamp-2">
                    {article.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                    {article.description}
                </p>

                {/* Link - Always show */}
                {article.link && article.link !== '#' ? (
                    <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-hisi-primary font-semibold hover:text-hisi-accent transition-colors duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <span>Read Article</span>
                        <ExternalLink className="w-4 h-4" />
                    </a>
                ) : (
                    <span className="inline-flex items-center gap-2 text-hisi-primary font-semibold">
                        <span>View Details</span>
                        <ExternalLink className="w-4 h-4" />
                    </span>
                )}
            </div>
        </div>
    )
}

MediaCard.propTypes = {
    article: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        outlet: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        link: PropTypes.string,
        featured: PropTypes.bool
    }).isRequired,
    featured: PropTypes.bool
}

export default MediaCard
