import { useState, useEffect } from 'react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import FlipProductCard from '../../components/product/FlipProductCard'
import { footerLinks, socialLinks } from '../../data/mockData'
import { getProducts, getCategories } from '../../services/productsApi'
import { Loader2, AlertCircle, Filter, Search } from 'lucide-react'

const ShopPage = () => {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [pagination, setPagination] = useState({
        page: 1,
        perPage: 12,
        total: 0,
        totalPages: 0
    })

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories()
                setCategories(data.data || data.categories || [])
            } catch (err) {
                console.error('Failed to fetch categories:', err)
            }
        }
        fetchCategories()
    }, [])

    // Fetch products when filters change
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            setError(null)
            try {
                const data = await getProducts({
                    page: pagination.page,
                    perPage: pagination.perPage,
                    category: selectedCategory,
                    search: searchQuery || null
                })

                const productsData = data.data?.products || data.products || []
                setProducts(productsData)

                if (data.data?.pagination) {
                    setPagination(prev => ({
                        ...prev,
                        total: data.data.pagination.total_items || 0,
                        totalPages: data.data.pagination.total_pages || 0
                    }))
                }
            } catch (err) {
                console.error('Failed to fetch products:', err)
                setError(err.message || 'Failed to load products')
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [pagination.page, pagination.perPage, selectedCategory, searchQuery])

    const handleCategoryFilter = (categorySlug) => {
        setSelectedCategory(categorySlug === selectedCategory ? null : categorySlug)
        setPagination(prev => ({ ...prev, page: 1 }))
    }

    const handleSearch = (e) => {
        e.preventDefault()
        setPagination(prev => ({ ...prev, page: 1 }))
    }

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }))
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // Format price in KES
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 0
        }).format(price)
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
                {/* Hero Section */}
                <section className="relative py-20 px-4 sm:px-6 lg:px-8 mt-20 bg-gradient-to-r from-hisi-primary to-hisi-accent">
                    <div className="max-w-7xl mx-auto text-center">
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            Shop Adaptive Fashion
                        </h1>
                        <p className="text-xl text-white/90 max-w-3xl mx-auto">
                            Discover our collection of inclusive, stylish clothing designed for everyone
                        </p>
                    </div>
                </section>

                {/* Filters Section */}
                <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white border-b">
                    <div className="max-w-7xl mx-auto">
                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="mb-6">
                            <div className="relative max-w-md">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="search"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-hisi-primary focus:border-transparent"
                                />
                            </div>
                        </form>

                        {/* Category Filters */}
                        {categories.length > 0 && (
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => handleCategoryFilter(null)}
                                    className={`flex items-center gap-2 px-4 py-2 font-medium transition-all ${selectedCategory === null
                                            ? 'bg-hisi-primary text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <Filter className="w-4 h-4" />
                                    All Products
                                </button>
                                {categories.map((category) => (
                                    <button
                                        key={category.id || category.slug}
                                        onClick={() => handleCategoryFilter(category.slug)}
                                        className={`px-4 py-2 font-medium transition-all ${selectedCategory === category.slug
                                                ? 'bg-hisi-primary text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Products Grid */}
                <section className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">
                                {selectedCategory
                                    ? categories.find(c => c.slug === selectedCategory)?.name || 'Products'
                                    : 'All Products'}
                            </h2>
                            <p className="text-gray-600">
                                {loading ? 'Loading...' : `${products.length} products`}
                            </p>
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="w-12 h-12 text-hisi-primary animate-spin mb-4" />
                                <p className="text-gray-600">Loading products...</p>
                            </div>
                        )}

                        {/* Error State */}
                        {error && !loading && (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to load products</h3>
                                <p className="text-gray-600 mb-4">{error}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="px-6 py-3 bg-hisi-primary text-white font-medium hover:bg-hisi-accent transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}

                        {/* Empty State */}
                        {!loading && !error && products.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <p className="text-xl text-gray-600 mb-4">No products found</p>
                                <button
                                    onClick={() => {
                                        setSelectedCategory(null)
                                        setSearchQuery('')
                                    }}
                                    className="text-hisi-primary hover:underline"
                                >
                                    Clear filters
                                </button>
                            </div>
                        )}

                        {/* Product Grid */}
                        {!loading && !error && products.length > 0 && (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                    {products.map((product) => (
                                        <FlipProductCard
                                            key={product.id}
                                            id={product.id}
                                            image={product.main_image || product.images?.main || '/images/products/placeholder.jpg'}
                                            name={product.name}
                                            price={product.price}
                                            description={product.description}
                                            category={product.category?.name || product.category}
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {pagination.totalPages > 1 && (
                                    <div className="flex justify-center items-center gap-2 mt-12">
                                        <button
                                            onClick={() => handlePageChange(pagination.page - 1)}
                                            disabled={pagination.page === 1}
                                            className="px-4 py-2 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                                        >
                                            Previous
                                        </button>

                                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`px-4 py-2 ${pagination.page === page
                                                        ? 'bg-hisi-primary text-white'
                                                        : 'border border-gray-300 hover:bg-gray-100'
                                                    } transition-colors`}
                                            >
                                                {page}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => handlePageChange(pagination.page + 1)}
                                            disabled={pagination.page === pagination.totalPages}
                                            className="px-4 py-2 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </div>
            <Footer links={footerLinks} socialLinks={socialLinks} />
        </>
    )
}

export default ShopPage
