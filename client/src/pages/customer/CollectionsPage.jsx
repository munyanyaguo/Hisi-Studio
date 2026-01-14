import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'

// Import fallback data
import {
    collectionsHero,
    collections as fallbackCollections,
    collectionCategories,
    featuredProducts as fallbackFeaturedProducts,
    collectionsCTA
} from '../../data/collectionsData'

import { footerLinks, socialLinks } from '../../data/mockData'
import { ArrowRight, Check, Package, Home, ChevronRight, Sparkles, Heart, Shield, Loader2 } from 'lucide-react'
import { getCollections } from '../../services/cmsApi'
import { getFeaturedProducts } from '../../services/productsApi'
import { subscribe } from '../../services/newsletterApi'

const CollectionsPage = () => {
    const [collections, setCollections] = useState(fallbackCollections)
    const [featuredProducts, setFeaturedProducts] = useState(fallbackFeaturedProducts)
    const [loading, setLoading] = useState(true)
    const [emailInput, setEmailInput] = useState('')
    const [newsletterStatus, setNewsletterStatus] = useState('idle')

    // Fetch collections and featured products from API
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                // Fetch collections
                const collectionsData = await getCollections()
                const fetchedCollections = collectionsData.data || collectionsData.categories || collectionsData

                if (Array.isArray(fetchedCollections) && fetchedCollections.length > 0) {
                    // Transform API data to match component expectations
                    const transformedCollections = fetchedCollections.map(col => ({
                        id: col.id,
                        name: col.name,
                        slug: col.slug,
                        description: col.description || 'Explore our collection',
                        image: col.image || `/images/collections/${col.slug}.jpg`,
                        productCount: col.product_count || col.productCount || 0,
                        features: col.features || col.accessibility_features || [],
                        featured: col.featured || col.is_featured || false
                    }))
                    setCollections(transformedCollections)
                }

                // Fetch featured products
                const productsData = await getFeaturedProducts(4)
                const fetchedProducts = productsData.data?.products || productsData.products || []

                if (fetchedProducts.length > 0) {
                    const transformedProducts = fetchedProducts.map(prod => ({
                        id: prod.id,
                        name: prod.name,
                        price: prod.price,
                        image: prod.main_image || prod.images?.main || '/images/products/placeholder.jpg',
                        collection: prod.category?.name || 'Adaptive Fashion',
                        badge: prod.badge || (prod.is_featured ? 'Featured' : null)
                    }))
                    setFeaturedProducts(transformedProducts)
                }
            } catch (error) {
                console.error('Failed to fetch collections data:', error)
                // Keep fallback data
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    // Separate featured and regular collections
    const featuredCollections = collections.filter(c => c.featured)
    const regularCollections = collections.filter(c => !c.featured)

    const handleNewsletterSubmit = async (e) => {
        e.preventDefault()
        setNewsletterStatus('loading')

        try {
            await subscribe(emailInput)
            setNewsletterStatus('success')
            setEmailInput('')
            setTimeout(() => setNewsletterStatus('idle'), 5000)
        } catch (error) {
            setNewsletterStatus('error')
            setTimeout(() => setNewsletterStatus('idle'), 3000)
        }
    }

    return (
        <div className="min-h-screen">
            <Navbar isHeroDark={false} />

            {/* Hero Section with Breadcrumbs */}
            <div className="pt-32 pb-12 bg-gradient-to-b from-hisi-primary to-hisi-accent relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[url('/images/patterns/african-pattern.svg')] bg-repeat"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center space-x-2 text-white/80 text-sm mb-8">
                        <Link to="/" className="hover:text-white transition-colors duration-300 flex items-center gap-1">
                            <Home className="w-4 h-4" />
                            <span>Home</span>
                        </Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-white font-semibold">Collections</span>
                    </nav>

                    {/* Hero Content */}
                    <div className="text-center">
                        <p className="text-white/90 font-semibold text-sm uppercase tracking-wider mb-4">
                            {collectionsHero.subtitle}
                        </p>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            {collectionsHero.title}
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
                            {collectionsHero.description}
                        </p>

                        {/* Collection Stats */}
                        <div className="flex flex-wrap justify-center gap-8 mt-12">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-white mb-2">{collections.length}</div>
                                <div className="text-white/80 text-sm">Curated Collections</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-white mb-2">
                                    {collections.reduce((sum, c) => sum + c.productCount, 0)}+
                                </div>
                                <div className="text-white/80 text-sm">Adaptive Products</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-white mb-2">100%</div>
                                <div className="text-white/80 text-sm">Inclusive Design</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main id="main-content">
                {/* Why Shop Collections - Benefits Section */}
                <section className="py-16 bg-white border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Why Shop Our Collections?
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Every collection is thoughtfully curated with adaptive features designed for comfort, dignity, and style
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center p-6">
                                <div className="w-16 h-16 bg-hisi-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Sparkles className="w-8 h-8 text-hisi-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Innovative Design</h3>
                                <p className="text-gray-600">
                                    Cutting-edge adaptive features like magnetic closures, sensory-friendly fabrics, and seated comfort designs
                                </p>
                            </div>

                            <div className="text-center p-6">
                                <div className="w-16 h-16 bg-hisi-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Heart className="w-8 h-8 text-hisi-accent" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Inclusive for All</h3>
                                <p className="text-gray-600">
                                    Designed with input from disability communities to ensure every piece truly meets real needs
                                </p>
                            </div>

                            <div className="text-center p-6">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Shield className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Quality & Sustainability</h3>
                                <p className="text-gray-600">
                                    Ethically sourced materials, eco-friendly production, and durable construction for lasting wear
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Collections */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-bold text-gray-900 mb-12">Featured Collections</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {featuredCollections.map((collection) => (
                                <Link
                                    key={collection.id}
                                    to={`/shop?collection=${collection.slug}`}
                                    className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                                >
                                    {/* Image */}
                                    <div className="aspect-[4/5] overflow-hidden relative">
                                        <img
                                            src={collection.image}
                                            alt={collection.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                                        {/* Content Overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                            <h3 className="text-2xl font-bold mb-2 group-hover:text-hisi-accent transition-colors duration-300">
                                                {collection.name}
                                            </h3>
                                            <p className="text-white/90 text-sm mb-4 line-clamp-2">
                                                {collection.description}
                                            </p>

                                            {/* Features */}
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {collection.features.slice(0, 2).map((feature, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full"
                                                    >
                                                        {feature}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Product Count & Arrow */}
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm flex items-center gap-1">
                                                    <Package className="w-4 h-4" />
                                                    {collection.productCount} Products
                                                </span>
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* All Collections */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-bold text-gray-900 mb-12">All Collections</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {regularCollections.map((collection) => (
                                <Link
                                    key={collection.id}
                                    to={`/shop?collection=${collection.slug}`}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
                                >
                                    {/* Image */}
                                    <div className="aspect-square overflow-hidden">
                                        <img
                                            src={collection.image}
                                            alt={collection.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-hisi-primary transition-colors duration-300">
                                            {collection.name}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                            {collection.description}
                                        </p>

                                        {/* Features */}
                                        <ul className="space-y-1 mb-4">
                                            {collection.features.slice(0, 3).map((feature, idx) => (
                                                <li key={idx} className="flex items-center text-xs text-gray-600">
                                                    <Check className="w-3 h-3 text-hisi-primary mr-2 flex-shrink-0" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* Product Count */}
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500 flex items-center gap-1">
                                                <Package className="w-4 h-4" />
                                                {collection.productCount} items
                                            </span>
                                            <ArrowRight className="w-4 h-4 text-hisi-primary group-hover:translate-x-2 transition-transform duration-300" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Shop by Category */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Shop by Category</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {collectionCategories.map((category) => (
                                <div
                                    key={category.id}
                                    className="bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-hisi-primary/30 transition-colors duration-300"
                                >
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                                        {category.name}
                                    </h3>
                                    <ul className="space-y-3">
                                        {category.items.map((item, idx) => (
                                            <li key={idx}>
                                                <Link
                                                    to={`/shop?filter=${item.toLowerCase().replace(/\s+/g, '-')}`}
                                                    className="flex items-center text-gray-700 hover:text-hisi-primary transition-colors duration-300 group"
                                                >
                                                    <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                                                    <span>{item}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Featured Products */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-bold text-gray-900 mb-12">Featured Products</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {featuredProducts.map((product) => (
                                <Link
                                    key={product.id}
                                    to={`/product/${product.id}`}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
                                >
                                    {/* Image with Badge */}
                                    <div className="aspect-[4/5] overflow-hidden relative">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        {product.badge && (
                                            <span className="absolute top-4 right-4 bg-hisi-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                                {product.badge}
                                            </span>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <p className="text-xs text-hisi-primary font-semibold mb-2">
                                            {product.collection}
                                        </p>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-hisi-primary transition-colors duration-300">
                                            {product.name}
                                        </h3>
                                        <p className="text-xl font-bold text-gray-900">
                                            KES {product.price.toLocaleString()}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Newsletter Signup */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-gradient-to-br from-hisi-primary/10 to-hisi-accent/10 rounded-3xl p-12 text-center border-2 border-hisi-primary/20">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Stay Updated on New Collections
                            </h2>
                            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                                Be the first to know about new adaptive fashion collections, exclusive designs, and special offers
                            </p>
                            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                                <input
                                    type="email"
                                    value={emailInput}
                                    onChange={(e) => setEmailInput(e.target.value)}
                                    placeholder="Enter your email"
                                    className="flex-1 px-6 py-4 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-hisi-primary focus:border-transparent"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="px-8 py-4 bg-hisi-primary text-white rounded-lg font-semibold hover:bg-hisi-accent transition-colors duration-300 shadow-lg hover:shadow-xl whitespace-nowrap"
                                >
                                    Subscribe
                                </button>
                            </form>
                            <p className="text-sm text-gray-500 mt-4">
                                We respect your privacy. Unsubscribe anytime.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Custom Design CTA */}
                <section className="py-20 bg-gradient-to-br from-hisi-primary to-hisi-accent">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            {collectionsCTA.title}
                        </h2>
                        <p className="text-xl text-white/90 mb-10">
                            {collectionsCTA.description}
                        </p>
                        <Link
                            to={collectionsCTA.buttonLink}
                            className="inline-block px-8 py-4 bg-white text-hisi-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl"
                        >
                            {collectionsCTA.buttonText}
                        </Link>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <Footer links={footerLinks} socialLinks={socialLinks} />
        </div>
    )
}

export default CollectionsPage
