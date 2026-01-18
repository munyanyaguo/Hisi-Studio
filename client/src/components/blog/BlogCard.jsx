import PropTypes from 'prop-types'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const BlogCard = ({ post, featured = false }) => {
    // Normalize field names (handle both API and legacy field names)
    const featuredImage = post.featured_image || post.featuredImage || '/images/blog/placeholder.jpg'
    const readTime = post.read_time || post.readTime || '5 min read'
    const date = post.published_at || post.date || post.created_at
    const category = post.category || 'article'
    const isFeatured = post.is_featured || post.featured || false

    return (
        <Link
            to={`/blog/${post.slug}`}
            className={`group block bg-white overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 ${featured || isFeatured ? 'md:col-span-2 md:flex md:flex-row' : ''
                }`}
        >
            {/* Image */}
            <div className={`overflow-hidden ${featured || isFeatured ? 'md:w-1/2' : 'aspect-[16/10]'}`}>
                <img
                    src={featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                        e.target.src = '/images/blog/placeholder.jpg'
                    }}
                />
            </div>

            {/* Content */}
            <div className={`p-6 ${featured || isFeatured ? 'md:w-1/2 md:flex md:flex-col md:justify-center md:p-8' : ''}`}>
                {/* Category Badge - Boxy */}
                <span className="inline-block bg-hisi-primary/10 text-hisi-primary text-xs font-bold px-3 py-1 mb-3">
                    {category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>

                {/* Title */}
                <h3 className={`font-bold text-gray-900 mb-3 group-hover:text-hisi-primary transition-colors duration-300 ${featured || isFeatured ? 'text-3xl md:text-4xl' : 'text-xl'
                    }`}>
                    {post.title}
                </h3>

                {/* Excerpt */}
                <p className={`text-gray-600 leading-relaxed mb-4 ${featured || isFeatured ? 'text-lg' : ''}`}>
                    {post.excerpt}
                </p>

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{date ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{readTime}</span>
                    </div>
                </div>

                {/* Read More Link */}
                <div className="flex items-center gap-2 text-hisi-primary font-semibold group-hover:gap-3 transition-all duration-300">
                    <span>Read More</span>
                    <ArrowRight className="w-4 h-4" />
                </div>
            </div>
        </Link>
    )
}

BlogCard.propTypes = {
    post: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        title: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired,
        excerpt: PropTypes.string,
        author: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        date: PropTypes.string,
        published_at: PropTypes.string,
        created_at: PropTypes.string,
        category: PropTypes.string,
        featured_image: PropTypes.string,
        featuredImage: PropTypes.string,
        read_time: PropTypes.string,
        readTime: PropTypes.string,
        is_featured: PropTypes.bool,
        featured: PropTypes.bool
    }).isRequired,
    featured: PropTypes.bool
}

export default BlogCard
