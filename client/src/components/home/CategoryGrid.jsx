import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const CategoryGrid = ({ categories = [] }) => {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Shop by Category
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover our curated collections designed with specific adaptive features
                        to meet your unique needs.
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            to={`/shop/${category.slug}`}
                            className="group relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                        >
                            {/* Image */}
                            <div className="relative h-80 overflow-hidden">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    loading="lazy"
                                />

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-hisi-primary/0 group-hover:bg-hisi-primary/20 transition-colors duration-500" />
                            </div>

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <div className="transform translate-y-0 group-hover:-translate-y-2 transition-transform duration-300">
                                    <h3 className="text-2xl font-bold mb-2">
                                        {category.name}
                                    </h3>
                                    <p className="text-white/90 text-sm mb-3 line-clamp-2">
                                        {category.description}
                                    </p>

                                    {/* Product Count */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-white/80 text-sm">
                                            {category.productCount} Products
                                        </span>

                                        {/* Arrow Icon */}
                                        <div className="w-8 h-8 bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white group-hover:text-hisi-primary transition-all duration-300">
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* View All Link */}
                <div className="text-center mt-12">
                    <Link
                        to="/shop"
                        className="inline-flex items-center space-x-2 text-hisi-primary font-semibold hover:text-hisi-accent transition-colors duration-300 text-lg group"
                    >
                        <span>View All Collections</span>
                        <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default CategoryGrid
