import { useState, useEffect } from 'react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import BlogCard from '../../components/blog/BlogCard'
import { footerLinks, socialLinks } from '../../data/mockData'
import { getBlogPosts } from '../../services/blogApi'
import { subscribe } from '../../services/newsletterApi'
import { Search, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

// Fallback data for when API is unavailable
const fallbackBlogData = {
    blogHero: {
        subtitle: 'Our Journal',
        title: 'Stories & Insights',
        description: 'Explore the world of adaptive fashion through stories, tips, and inspiration.'
    },
    blogCategories: [
        { id: 'all', name: 'All', slug: 'all' },
        { id: 'fashion', name: 'Fashion', slug: 'fashion' },
        { id: 'accessibility', name: 'Accessibility', slug: 'accessibility' },
        { id: 'stories', name: 'Stories', slug: 'stories' },
        { id: 'tips', name: 'Tips & Guides', slug: 'tips' }
    ],
    newsletterCTA: {
        title: 'Stay in the Loop',
        description: 'Subscribe to our newsletter for the latest stories and updates.',
        placeholder: 'Enter your email',
        buttonText: 'Subscribe'
    }
}

const BlogPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [blogPosts, setBlogPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [newsletterEmail, setNewsletterEmail] = useState('')
    const [newsletterStatus, setNewsletterStatus] = useState('idle') // idle, loading, success, error
    const [newsletterMessage, setNewsletterMessage] = useState('')
    const [pagination, setPagination] = useState({
        page: 1,
        perPage: 12,
        total: 0,
        totalPages: 0
    })

    // Fetch blog posts
    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true)
            setError(null)
            try {
                const data = await getBlogPosts({
                    page: pagination.page,
                    perPage: pagination.perPage,
                    category: selectedCategory !== 'all' ? selectedCategory : null,
                    search: searchQuery || null
                })

                const posts = data.data?.posts || data.posts || data.data || []
                setBlogPosts(Array.isArray(posts) ? posts : [])

                if (data.data?.pagination) {
                    setPagination(prev => ({
                        ...prev,
                        total: data.data.pagination.total_items || 0,
                        totalPages: data.data.pagination.total_pages || 0
                    }))
                }
            } catch (err) {
                console.error('Failed to fetch blog posts:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchPosts()
    }, [pagination.page, selectedCategory, searchQuery])

    // Handle newsletter subscription
    const handleNewsletterSubmit = async (e) => {
        e.preventDefault()

        if (!newsletterEmail) {
            setNewsletterStatus('error')
            setNewsletterMessage('Please enter your email address')
            return
        }

        setNewsletterStatus('loading')

        try {
            await subscribe(newsletterEmail)
            setNewsletterStatus('success')
            setNewsletterMessage('Thank you for subscribing!')
            setNewsletterEmail('')

            // Reset after 5 seconds
            setTimeout(() => {
                setNewsletterStatus('idle')
                setNewsletterMessage('')
            }, 5000)
        } catch (err) {
            setNewsletterStatus('error')
            setNewsletterMessage(err.message || 'Failed to subscribe. Please try again.')
        }
    }

    // Filter posts based on category and search (client-side filtering as backup)
    const filteredPosts = blogPosts.filter(post => {
        const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
        const matchesSearch = !searchQuery ||
            post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    // Separate featured and regular posts
    const featuredPosts = filteredPosts.filter(post => post.featured || post.is_featured)
    const regularPosts = filteredPosts.filter(post => !post.featured && !post.is_featured)

    const { blogHero, blogCategories, newsletterCTA } = fallbackBlogData

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
                                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-hisi-primary focus:border-transparent text-gray-900 placeholder-gray-400"
                                />
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div className="flex flex-wrap justify-center gap-3">
                            {blogCategories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.slug)}
                                    className={`px-6 py-2 font-semibold transition-all duration-300 ${selectedCategory === category.slug
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

                {/* Loading State */}
                {loading && (
                    <section className="py-20 bg-gray-50">
                        <div className="flex flex-col items-center justify-center">
                            <Loader2 className="w-12 h-12 text-hisi-primary animate-spin mb-4" />
                            <p className="text-gray-600">Loading articles...</p>
                        </div>
                    </section>
                )}

                {/* Error State */}
                {error && !loading && (
                    <section className="py-20 bg-gray-50">
                        <div className="text-center">
                            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to load articles</h3>
                            <p className="text-gray-600 mb-4">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-3 bg-hisi-primary text-white font-medium hover:bg-hisi-accent transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </section>
                )}

                {/* Featured Posts */}
                {!loading && !error && featuredPosts.length > 0 && (
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
                {!loading && !error && (
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

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-12">
                                    <button
                                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                        disabled={pagination.page === 1}
                                        className="px-4 py-2 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                                    >
                                        Previous
                                    </button>

                                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setPagination(prev => ({ ...prev, page }))}
                                            className={`px-4 py-2 ${pagination.page === page
                                                    ? 'bg-hisi-primary text-white'
                                                    : 'border border-gray-300 hover:bg-gray-100'
                                                } transition-colors`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                        disabled={pagination.page === pagination.totalPages}
                                        className="px-4 py-2 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* Newsletter CTA */}
                <section className="py-20 bg-gradient-to-br from-hisi-primary to-hisi-accent">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            {newsletterCTA.title}
                        </h2>
                        <p className="text-xl text-white/90 mb-10">
                            {newsletterCTA.description}
                        </p>
                        <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                            <input
                                type="email"
                                value={newsletterEmail}
                                onChange={(e) => setNewsletterEmail(e.target.value)}
                                placeholder={newsletterCTA.placeholder}
                                className="flex-1 px-6 py-4 focus:outline-none focus:ring-2 focus:ring-white text-gray-900"
                                disabled={newsletterStatus === 'loading'}
                                required
                            />
                            <button
                                type="submit"
                                disabled={newsletterStatus === 'loading'}
                                className="px-8 py-4 bg-white text-hisi-primary font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                            >
                                {newsletterStatus === 'loading' ? 'Subscribing...' : newsletterCTA.buttonText}
                            </button>
                        </form>

                        {/* Newsletter Status Messages */}
                        {newsletterStatus === 'success' && (
                            <div className="flex items-center justify-center gap-2 mt-4 text-white">
                                <CheckCircle className="w-5 h-5" />
                                <span>{newsletterMessage}</span>
                            </div>
                        )}
                        {newsletterStatus === 'error' && (
                            <div className="flex items-center justify-center gap-2 mt-4 text-red-200">
                                <AlertCircle className="w-5 h-5" />
                                <span>{newsletterMessage}</span>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Footer */}
            <Footer links={footerLinks} socialLinks={socialLinks} />
        </div>
    )
}

export default BlogPage
