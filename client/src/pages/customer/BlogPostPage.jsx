import { useParams, Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import BlogCard from '../../components/blog/BlogCard'

// Import mock data
import { blogPosts } from '../../data/blogData'
import { footerLinks, socialLinks } from '../../data/mockData'
import { Calendar, Clock, ArrowLeft, Share2 } from 'lucide-react'

const BlogPostPage = () => {
    const { slug } = useParams()

    // Find the post by slug
    const post = blogPosts.find(p => p.slug === slug)

    // Get related posts (same category, excluding current post)
    const relatedPosts = blogPosts
        .filter(p => p.category === post?.category && p.id !== post?.id)
        .slice(0, 3)

    if (!post) {
        return (
            <div className="min-h-screen">
                <Navbar isHeroDark={false} />
                <div className="pt-32 pb-20 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
                    <Link to="/blog" className="text-hisi-primary hover:underline">
                        ← Back to Blog
                    </Link>
                </div>
                <Footer links={footerLinks} socialLinks={socialLinks} />
            </div>
        )
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
                    <span className="inline-block bg-hisi-primary/10 text-hisi-primary text-sm font-bold px-4 py-2 rounded-full mb-6">
                        {post.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                        {post.title}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex items-center gap-6 text-gray-600 mb-8 pb-8 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            <span>{post.readTime}</span>
                        </div>
                        <button className="ml-auto flex items-center gap-2 text-hisi-primary hover:text-hisi-accent transition-colors duration-300">
                            <Share2 className="w-5 h-5" />
                            <span className="hidden sm:inline">Share</span>
                        </button>
                    </div>

                    {/* Featured Image */}
                    <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-12 shadow-2xl">
                        <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Article Content */}
                    <div className="prose prose-lg max-w-none">
                        <p className="text-xl text-gray-700 leading-relaxed mb-8">
                            {post.excerpt}
                        </p>

                        {/* Placeholder for full content */}
                        <div className="space-y-6 text-gray-700 leading-relaxed">
                            <p>
                                This is where the full blog post content would appear. In a real implementation,
                                this would be populated with the actual article content, which could be stored
                                in markdown format or retrieved from a CMS.
                            </p>

                            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Key Insights</h2>
                            <p>
                                The article would continue with detailed insights, examples, and analysis
                                related to the topic. This could include images, quotes, lists, and other
                                rich content elements.
                            </p>

                            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Conclusion</h2>
                            <p>
                                The conclusion would summarize the main points and provide actionable takeaways
                                for readers interested in adaptive fashion, disability inclusion, or sustainable design.
                            </p>
                        </div>
                    </div>

                    {/* Author Info */}
                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <p className="text-gray-600">
                            Written by <span className="font-semibold text-gray-900">{post.author}</span>
                        </p>
                    </div>
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
