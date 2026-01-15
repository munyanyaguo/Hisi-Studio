import { useState, useEffect } from 'react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import MediaCard from '../../components/press/MediaCard'
import ScrollAnimationWrapper from '../../components/ui/ScrollAnimationWrapper'
import { getPressPageContent } from '../../services/pressApi'
import { footerLinks, socialLinks } from '../../data/mockData'
import { FileText, Download, Mail, Phone, MapPin, Calendar, Mic, Loader2, AlertCircle, X, ExternalLink, Tag } from 'lucide-react'

const PressPage = () => {
    const [content, setContent] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedArticle, setSelectedArticle] = useState(null)

    // Fetch press page content from API
    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true)
            setError(null)
            try {
                const data = await getPressPageContent()
                setContent(data)
            } catch (err) {
                console.error('Failed to fetch press content:', err)
                setError('Failed to load press content. Please try again later.')
            } finally {
                setLoading(false)
            }
        }

        fetchContent()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen">
                <Navbar isHeroDark={false} />
                <div className="pt-32 pb-20 flex flex-col items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-12 h-12 text-hisi-primary animate-spin mb-4" />
                    <p className="text-gray-600">Loading content...</p>
                </div>
                <Footer links={footerLinks} socialLinks={socialLinks} />
            </div>
        )
    }

    if (error || !content) {
        return (
            <div className="min-h-screen">
                <Navbar isHeroDark={false} />
                <div className="pt-32 pb-20 flex flex-col items-center justify-center min-h-[60vh]">
                    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                    <p className="text-gray-600">{error || 'No content available'}</p>
                </div>
                <Footer links={footerLinks} socialLinks={socialLinks} />
            </div>
        )
    }

    const {
        hero: pressHero,
        featuredMedia,
        pressReleases,
        exhibitions,
        speakingEngagements,
        collaborations,
        mediaKit,
        contactPress
    } = content

    // Separate featured and regular articles
    const featured = featuredMedia?.filter(article => article.featured) || []
    const regular = featuredMedia?.filter(article => !article.featured) || []

    return (
        <div className="min-h-screen">
            <Navbar isHeroDark={false} />

            {/* Hero Section */}
            <div className="pt-32 pb-12 bg-gradient-to-b from-hisi-primary to-hisi-accent">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-white/90 font-semibold text-sm uppercase tracking-wider mb-4">
                        {pressHero?.subtitle || 'In the Spotlight'}
                    </p>
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                        {pressHero?.title || 'Press & Media'}
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                        {pressHero?.description || 'Discover our media coverage and press releases.'}
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <main id="main-content">
                {/* Featured Media */}
                {featured.length > 0 && (
                    <ScrollAnimationWrapper>
                        <section className="py-20 bg-white">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <h2 className="text-4xl font-bold text-gray-900 mb-12">Featured Coverage</h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {featured.map((article) => (
                                        <div key={article.id} onClick={() => setSelectedArticle(article)} className="cursor-pointer">
                                            <MediaCard article={article} featured={true} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </ScrollAnimationWrapper>
                )}

                {/* All Media Coverage */}
                {regular.length > 0 && (
                    <ScrollAnimationWrapper>
                        <section className="py-20 bg-gray-50">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <h2 className="text-4xl font-bold text-gray-900 mb-12">Media Coverage</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {regular.map((article) => (
                                        <div key={article.id} onClick={() => setSelectedArticle(article)} className="cursor-pointer">
                                            <MediaCard article={article} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </ScrollAnimationWrapper>
                )}

                {/* Press Releases */}
                {pressReleases?.length > 0 && (
                    <ScrollAnimationWrapper>
                        <section className="py-20 bg-white">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <h2 className="text-4xl font-bold text-gray-900 mb-12">Press Releases</h2>
                                <div className="space-y-6 max-w-4xl">
                                    {pressReleases.map((release) => (
                                        <div
                                            key={release.id}
                                            className="bg-gray-50 p-6 hover:shadow-lg transition-shadow duration-300 border-l-4 border-hisi-primary"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>{new Date(release.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                        {release.title}
                                                    </h3>
                                                    <p className="text-gray-600 leading-relaxed">
                                                        {release.excerpt}
                                                    </p>
                                                </div>
                                                <FileText className="w-6 h-6 text-hisi-primary flex-shrink-0" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </ScrollAnimationWrapper>
                )}

                {/* Exhibitions */}
                {exhibitions?.length > 0 && (
                    <ScrollAnimationWrapper>
                        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <h2 className="text-4xl font-bold text-gray-900 mb-12">Exhibitions</h2>
                                <div className="space-y-16">
                                    {exhibitions.map((exhibition, index) => (
                                        <div
                                            key={exhibition.id}
                                            className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                                                } gap-12 items-center`}
                                        >
                                            {/* Main Image */}
                                            <div className="w-full lg:w-1/2">
                                                <div className="aspect-[4/3] overflow-hidden shadow-xl">
                                                    <img
                                                        src={exhibition.image}
                                                        alt={exhibition.title}
                                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                                    />
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="w-full lg:w-1/2">
                                                <div className="flex items-center gap-2 text-hisi-primary mb-3">
                                                    <MapPin className="w-5 h-5" />
                                                    <span className="font-semibold">{exhibition.location}</span>
                                                </div>
                                                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                                                    {exhibition.title}
                                                </h3>
                                                <p className="text-gray-500 mb-4">
                                                    {new Date(exhibition.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </p>
                                                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                                                    {exhibition.description}
                                                </p>

                                                {/* Gallery Thumbnails */}
                                                {exhibition.gallery && exhibition.gallery.length > 0 && (
                                                    <div className="grid grid-cols-3 gap-4">
                                                        {exhibition.gallery.map((img, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="aspect-square overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                                                            >
                                                                <img
                                                                    src={img}
                                                                    alt={`${exhibition.title} - Gallery ${idx + 1}`}
                                                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </ScrollAnimationWrapper>
                )}

                {/* Speaking Engagements */}
                {speakingEngagements?.length > 0 && (
                    <ScrollAnimationWrapper>
                        <section className="py-20 bg-white">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <h2 className="text-4xl font-bold text-gray-900 mb-12">Speaking Engagements</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {speakingEngagements.map((engagement) => (
                                        <div
                                            key={engagement.id}
                                            className="bg-gradient-to-br from-hisi-primary/5 to-hisi-accent/5 p-6 border-2 border-hisi-primary/20 hover:border-hisi-primary hover:shadow-lg transition-all duration-300"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-hisi-primary flex items-center justify-center flex-shrink-0">
                                                    <Mic className="w-6 h-6 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <span className="inline-block bg-hisi-accent text-white text-xs font-bold px-3 py-1 mb-3">
                                                        {engagement.type}
                                                    </span>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                        {engagement.title}
                                                    </h3>
                                                    <p className="text-hisi-primary font-semibold mb-2">
                                                        {engagement.event}
                                                    </p>
                                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                                        <div className="flex items-center gap-1">
                                                            <MapPin className="w-4 h-4" />
                                                            <span>{engagement.location}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>{new Date(engagement.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-600 leading-relaxed">
                                                        {engagement.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </ScrollAnimationWrapper>
                )}

                {/* Collaborations */}
                {collaborations?.length > 0 && (
                    <ScrollAnimationWrapper>
                        <section className="py-20 bg-gray-50">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <h2 className="text-4xl font-bold text-gray-900 mb-12">Collaborations</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {collaborations.map((collab) => (
                                        <div
                                            key={collab.id}
                                            className="group bg-white overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                                        >
                                            <div className="aspect-[16/10] overflow-hidden">
                                                <img
                                                    src={collab.image}
                                                    alt={collab.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            </div>
                                            <div className="p-6">
                                                <span className="inline-block bg-hisi-primary/10 text-hisi-primary text-xs font-bold px-3 py-1 mb-3">
                                                    {collab.year}
                                                </span>
                                                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-hisi-primary transition-colors duration-300">
                                                    {collab.title}
                                                </h3>
                                                <p className="text-hisi-accent font-semibold mb-3">
                                                    {collab.partner}
                                                </p>
                                                <p className="text-gray-600 leading-relaxed">
                                                    {collab.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </ScrollAnimationWrapper>
                )}

                {/* Media Kit & Contact */}
                <ScrollAnimationWrapper>
                    <section className="py-12" style={{ background: 'linear-gradient(135deg, #1a365d 0%, #ed8936 100%)' }}>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Media Kit */}
                                <div className="bg-white/10 backdrop-blur-sm p-6 border-2 border-white/20">
                                    <h3 className="text-2xl font-bold text-white mb-3">
                                        {mediaKit?.title || 'Media Kit'}
                                    </h3>
                                    <p className="text-white/90 mb-6">
                                        {mediaKit?.description || 'Download our press kit for high-resolution images and brand assets.'}
                                    </p>
                                    <div className="space-y-3">
                                        {mediaKit?.items?.map((item, index) => (
                                            <a
                                                key={item.id || index}
                                                href={item.url || '#'}
                                                download={item.url ? item.name : undefined}
                                                target={item.url ? '_blank' : undefined}
                                                rel="noopener noreferrer"
                                                onClick={(e) => {
                                                    if (!item.url) {
                                                        e.preventDefault();
                                                        alert(`"${item.name}" download will be available soon. Please contact us for immediate access.`);
                                                    }
                                                }}
                                                className="w-full flex items-center justify-between bg-white/20 hover:bg-white/30 backdrop-blur-sm p-4 transition-all duration-300 group cursor-pointer"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Download className="w-5 h-5 text-white" />
                                                    <div className="text-left">
                                                        <p className="text-white font-semibold">{item.name}</p>
                                                        <p className="text-white/70 text-sm">{item.type} • {item.size}</p>
                                                    </div>
                                                </div>
                                                <Download className="w-5 h-5 text-white group-hover:translate-y-1 transition-transform duration-300" />
                                            </a>
                                        ))}
                                    </div>
                                </div>

                                {/* Contact */}
                                <div className="bg-white/10 backdrop-blur-sm p-6 border-2 border-white/20">
                                    <h3 className="text-2xl font-bold text-white mb-3">
                                        {contactPress?.title || 'Media Inquiries'}
                                    </h3>
                                    <p className="text-white/90 mb-4">
                                        {contactPress?.description || 'For press inquiries, please contact our media team.'}
                                    </p>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white/20 flex items-center justify-center">
                                                <Mail className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-white/70 text-sm">Email</p>
                                                <a href={`mailto:${contactPress?.email || 'press@hisistudio.com'}`} className="text-white font-semibold hover:underline">
                                                    {contactPress?.email || 'press@hisistudio.com'}
                                                </a>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white/20 flex items-center justify-center">
                                                <Phone className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-white/70 text-sm">Phone</p>
                                                <a href={`tel:${contactPress?.phone || '+254 XXX XXX XXX'}`} className="text-white font-semibold hover:underline">
                                                    {contactPress?.phone || '+254 XXX XXX XXX'}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </ScrollAnimationWrapper>
            </main>

            {/* Article Detail Modal */}
            {selectedArticle && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedArticle(null)}
                >
                    {/* Blurred Background */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                    {/* Modal Content */}
                    <div
                        className="relative bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedArticle(null)}
                            className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white shadow-lg transition-all duration-200"
                            aria-label="Close modal"
                        >
                            <X className="w-6 h-6 text-gray-700" />
                        </button>

                        {/* Article Image */}
                        {selectedArticle.image && (
                            <div className="aspect-[16/9] overflow-hidden">
                                <img
                                    src={selectedArticle.image}
                                    alt={selectedArticle.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Article Content */}
                        <div className="p-8">
                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date(selectedArticle.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Tag className="w-4 h-4" />
                                    <span>{selectedArticle.category}</span>
                                </div>
                                {selectedArticle.featured && (
                                    <span className="bg-hisi-accent text-white text-xs font-bold px-3 py-1">
                                        Featured
                                    </span>
                                )}
                            </div>

                            {/* Outlet */}
                            <p className="text-hisi-primary font-semibold text-lg mb-3">
                                {selectedArticle.outlet}
                            </p>

                            {/* Title */}
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                {selectedArticle.title}
                            </h2>

                            {/* Description */}
                            <p className="text-lg text-gray-600 leading-relaxed mb-8">
                                {selectedArticle.description}
                            </p>

                            {/* Link */}
                            {selectedArticle.link && selectedArticle.link !== '#' && (
                                <a
                                    href={selectedArticle.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-hisi-primary text-white px-6 py-3 font-semibold hover:bg-hisi-accent transition-colors duration-300"
                                >
                                    <span>Read Full Article</span>
                                    <ExternalLink className="w-5 h-5" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <Footer links={footerLinks} socialLinks={socialLinks} />
        </div>
    )
}

export default PressPage
