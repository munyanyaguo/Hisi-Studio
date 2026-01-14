import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import BlogCard from '../../components/blog/BlogCard'
import { footerLinks, socialLinks } from '../../data/mockData'
import { getBlogPostBySlug, getBlogPosts } from '../../services/blogApi'
import { Calendar, Clock, ArrowLeft, Share2, Loader2 } from 'lucide-react'

const BlogPostPage = () => {
    const { slug } = useParams()
    const [post, setPost] = useState(null)
    const [relatedPosts, setRelatedPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Fetch the blog post
    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true)
            setError(null)

            try {
                const data = await getBlogPostBySlug(slug)
                const postData = data.data || data

                // Transform API data to match component expectations
                setPost({
                    ...postData,
                    featuredImage: postData.featured_image || postData.featuredImage || '/images/blog/placeholder.jpg',
                    readTime: postData.read_time || postData.readTime || '5 min read',
                    date: postData.published_at || postData.date || postData.created_at,
                })

                // Fetch related posts
                if (postData.category) {
                    try {
                        const relatedData = await getBlogPosts({
                            category: postData.category,
                            perPage: 4
                        })
                        const related = (relatedData.data?.posts || relatedData.posts || [])
                            .filter(p => p.id !== postData.id && p.slug !== slug)
                            .slice(0, 3)
                        setRelatedPosts(related)
                    } catch (err) {
                        console.error('Failed to fetch related posts:', err)
                    }
                }
            } catch (err) {
                console.error('Failed to fetch blog post:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchPost()
    }, [slug])

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen">
                <Navbar isHeroDark={false} />
                <div className="pt-32 pb-20 flex flex-col items-center justify-center">
                    <Loader2 className="w-12 h-12 text-hisi-primary animate-spin mb-4" />
                    <p className="text-gray-600">Loading article...</p>
                </div>
                <Footer links={footerLinks} socialLinks={socialLinks} />
            </div>
        )
    }

    // Error or not found state
    if (error || !post) {
        return (
            <div className="min-h-screen">
                <Navbar isHeroDark={false} />
                <div className="pt-32 pb-20 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        {error || 'Post Not Found'}
                    </h1>
                    <p className="text-gray-600 mb-8">
                        The article you're looking for doesn't exist or has been removed.
                    </p>
                    <Link to="/blog" className="text-hisi-primary hover:underline">
                        ← Back to Blog
                    </Link>
                </div>
                <Footer links={footerLinks} socialLinks={socialLinks} />
            </div>
        )
    }

    // Format category for display
    const formatCategory = (category) => {
        if (!category) return 'Article'
        return category.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <div className="min-h-screen">
            <Navbar isHeroDark={false} />

            {/* Article Header */}
            <article className="pt-32 pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back Link */}
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 text-hisi-primary hover:text-hisi-accent transition-colors duration-300 mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Blog</span>
                    </Link>

                    {/* Category Badge */}
                    {post.category && (
                        <span className="inline-block bg-hisi-primary/10 text-hisi-primary text-sm font-bold px-4 py-2 mb-6">
                            {formatCategory(post.category)}
                        </span>
                    )}

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                        {post.title}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex items-center gap-6 text-gray-600 mb-8 pb-8 border-b border-gray-200">
                        {post.date && (
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                <span>{formatDate(post.date)}</span>
                            </div>
                        )}
                        {post.readTime && (
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                <span>{post.readTime}</span>
                            </div>
                        )}
                        <button
                            onClick={() => navigator.share?.({ title: post.title, url: window.location.href })}
                            className="ml-auto flex items-center gap-2 text-hisi-primary hover:text-hisi-accent transition-colors duration-300"
                        >
                            <Share2 className="w-5 h-5" />
                            <span className="hidden sm:inline">Share</span>
                        </button>
                    </div>

                    {/* Featured Image */}
                    <div className="aspect-[16/9] overflow-hidden mb-12 shadow-2xl">
                        <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = '/images/blog/placeholder.jpg'
                            }}
                        />
                    </div>

                    {/* Article Content */}
                    <div className="prose prose-lg max-w-none">
                        {/* Excerpt */}
                        {post.excerpt && (
                            <p className="text-xl text-gray-700 leading-relaxed mb-8">
                                {post.excerpt}
                            </p>
                        )}

                        {/* Full Content */}
                        {post.content ? (
                            <div
                                className="space-y-6 text-gray-700 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                        ) : (
                            <div className="space-y-6 text-gray-700 leading-relaxed">
                                <p>
                                    This is where the full blog post content would appear. In a real implementation,
                                    this would be populated with the actual article content from the CMS.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Author Info */}
                    {post.author && (
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <p className="text-gray-600">
                                Written by <span className="font-semibold text-gray-900">{post.author}</span>
                            </p>
                        </div>
                    )}
                </div>
            </article>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-bold text-gray-900 mb-12">Related Articles</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedPosts.map((relatedPost) => (
                                <BlogCard key={relatedPost.id} post={relatedPost} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <Footer links={footerLinks} socialLinks={socialLinks} />
        </div>
    )
}

export default BlogPostPage
