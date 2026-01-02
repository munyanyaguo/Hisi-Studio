import { useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import BlogCard from '../../components/blog/BlogCard'

// Import mock data
import {
    blogHero,
    blogCategories,
    blogPosts,
    newsletterCTA
} from '../../data/blogData'

import { footerLinks, socialLinks } from '../../data/mockData'
import { Search } from 'lucide-react'

const BlogPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')

    // Filter posts based on category and search
    const filteredPosts = blogPosts.filter(post => {
        const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    // Separate featured and regular posts
    const featuredPosts = filteredPosts.filter(post => post.featured)
    const regularPosts = filteredPosts.filter(post => !post.featured)

    return (
        <div className="min-h-screen">
            <Navbar isHeroDark={false} />

            {/* Hero Section */}
            <div className="pt-32 pb-12 bg-gradient-to-b from-hisi-primary to-hisi-accent">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-white/90 font-semibold text-sm uppercase tracking-wider mb-4">
                        {blogHero.subtitle}
                    </p>
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                        {blogHero.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                        {blogHero.description}
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <main id="main-content">
                {/* Search and Filter */}
                <section className="py-12 bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Search Bar */}
                        <div className="mb-8">
                            <div className="relative max-w-2xl mx-auto">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="search"
                                    placeholder="Search articles..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-hisi-primary focus:border-transparent text-gray-900 placeholder-gray-400"
                                />
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div className="flex flex-wrap justify-center gap-3">
                            {blogCategories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.slug)}
                                    className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${selectedCategory === category.slug
                                            ? 'bg-hisi-primary text-white shadow-lg'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Featured Posts */}
                {featuredPosts.length > 0 && (
                    <section className="py-20 bg-gray-50">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-4xl font-bold text-gray-900 mb-12">Featured Articles</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {featuredPosts.map((post) => (
                                    <BlogCard key={post.id} post={post} featured={true} />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* All Posts */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-bold text-gray-900 mb-12">
                            {selectedCategory === 'all' ? 'All Articles' : `${blogCategories.find(c => c.slug === selectedCategory)?.name} Articles`}
                        </h2>

                        {regularPosts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {regularPosts.map((post) => (
                                    <BlogCard key={post.id} post={post} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-xl text-gray-600">
                                    No articles found. Try adjusting your search or filter.
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Newsletter CTA */}
                <section className="py-20 bg-gradient-to-br from-hisi-primary to-hisi-accent">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            {newsletterCTA.title}
                        </h2>
                        <p className="text-xl text-white/90 mb-10">
                            {newsletterCTA.description}
                        </p>
                        <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                            <input
                                type="email"
                                placeholder={newsletterCTA.placeholder}
                                className="flex-1 px-6 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-gray-900"
                                required
                            />
                            <button
                                type="submit"
                                className="px-8 py-4 bg-white text-hisi-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl"
                            >
                                {newsletterCTA.buttonText}
                            </button>
                        </form>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <Footer links={footerLinks} socialLinks={socialLinks} />
        </div>
    )
}

export default BlogPage
