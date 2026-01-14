import { useState, useEffect } from 'react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import MediaCard from '../../components/press/MediaCard'

// Import fallback data
import {
    pressHero as fallbackPressHero,
    featuredMedia as fallbackFeaturedMedia,
    pressReleases as fallbackPressReleases,
    exhibitions as fallbackExhibitions,
    speakingEngagements as fallbackSpeakingEngagements,
    collaborations as fallbackCollaborations,
    mediaKit as fallbackMediaKit,
    contactPress as fallbackContactPress
} from '../../data/pressData'

import { footerLinks, socialLinks } from '../../data/mockData'
import { FileText, Download, Mail, Phone, MapPin, Calendar, Mic, Loader2 } from 'lucide-react'
import { getPressContent } from '../../services/cmsApi'

const PressPage = () => {
    const [content, setContent] = useState({
        pressHero: fallbackPressHero,
        featuredMedia: fallbackFeaturedMedia,
        pressReleases: fallbackPressReleases,
        exhibitions: fallbackExhibitions,
        speakingEngagements: fallbackSpeakingEngagements,
        collaborations: fallbackCollaborations,
        mediaKit: fallbackMediaKit,
        contactPress: fallbackContactPress
    })
    const [loading, setLoading] = useState(true)

    // Fetch press page content from API
    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true)
            try {
                const data = await getPressContent()
                const pressData = data.data || data

                if (pressData) {
                    setContent({
                        pressHero: pressData.hero || pressData.pressHero || fallbackPressHero,
                        featuredMedia: pressData.featured_media || pressData.featuredMedia || fallbackFeaturedMedia,
                        pressReleases: pressData.press_releases || pressData.pressReleases || fallbackPressReleases,
                        exhibitions: pressData.exhibitions || fallbackExhibitions,
                        speakingEngagements: pressData.speaking_engagements || pressData.speakingEngagements || fallbackSpeakingEngagements,
                        collaborations: pressData.collaborations || fallbackCollaborations,
                        mediaKit: pressData.media_kit || pressData.mediaKit || fallbackMediaKit,
                        contactPress: pressData.contact_press || pressData.contactPress || fallbackContactPress
                    })
                }
            } catch (error) {
                console.error('Failed to fetch press content:', error)
                // Keep fallback data
            } finally {
                setLoading(false)
            }
        }

        fetchContent()
    }, [])

    const { pressHero, featuredMedia, pressReleases, exhibitions, speakingEngagements, collaborations, mediaKit, contactPress } = content

    // Separate featured and regular articles
    const featured = featuredMedia.filter(article => article.featured)
    const regular = featuredMedia.filter(article => !article.featured)

    if (loading) {
        return (
            <div className="min-h-screen">
                <Navbar isHeroDark={false} />
                <div className="pt-32 pb-20 flex flex-col items-center justify-center">
                    <Loader2 className="w-12 h-12 text-hisi-primary animate-spin mb-4" />
                    <p className="text-gray-600">Loading content...</p>
                </div>
                <Footer links={footerLinks} socialLinks={socialLinks} />
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            <Navbar isHeroDark={false} />

            {/* Hero Section */}
            <div className="pt-32 pb-12 bg-gradient-to-b from-hisi-primary to-hisi-accent">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-white/90 font-semibold text-sm uppercase tracking-wider mb-4">
                        {pressHero.subtitle}
                    </p>
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                        {pressHero.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                        {pressHero.description}
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <main id="main-content">
                {/* Featured Media */}
                {featured.length > 0 && (
                    <section className="py-20 bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-4xl font-bold text-gray-900 mb-12">Featured Coverage</h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {featured.map((article) => (
                                    <MediaCard key={article.id} article={article} featured={true} />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* All Media Coverage */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-bold text-gray-900 mb-12">Media Coverage</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {regular.map((article) => (
                                <MediaCard key={article.id} article={article} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Press Releases */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-bold text-gray-900 mb-12">Press Releases</h2>
                        <div className="space-y-6 max-w-4xl">
                            {pressReleases.map((release) => (
                                <div
                                    key={release.id}
                                    className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 border-l-4 border-hisi-primary"
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

                {/* Exhibitions */}
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
                                        <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
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
                                        {exhibition.gallery && (
                                            <div className="grid grid-cols-3 gap-4">
                                                {exhibition.gallery.map((img, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
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

                {/* Speaking Engagements */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-bold text-gray-900 mb-12">Speaking Engagements</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {speakingEngagements.map((engagement) => (
                                <div
                                    key={engagement.id}
                                    className="bg-gradient-to-br from-hisi-primary/5 to-hisi-accent/5 rounded-xl p-6 border-2 border-hisi-primary/20 hover:border-hisi-primary hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-hisi-primary rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Mic className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <span className="inline-block bg-hisi-accent text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
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

                {/* Collaborations */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-bold text-gray-900 mb-12">Collaborations</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {collaborations.map((collab) => (
                                <div
                                    key={collab.id}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                                >
                                    <div className="aspect-[16/10] overflow-hidden">
                                        <img
                                            src={collab.image}
                                            alt={collab.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <span className="inline-block bg-hisi-primary/10 text-hisi-primary text-xs font-bold px-3 py-1 rounded-full mb-3">
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

                {/* Media Kit & Contact */}
                <section className="py-20 bg-gradient-to-br from-hisi-primary to-hisi-accent">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Media Kit */}
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/20">
                                <h3 className="text-3xl font-bold text-white mb-4">
                                    {mediaKit.title}
                                </h3>
                                <p className="text-white/90 mb-6">
                                    {mediaKit.description}
                                </p>
                                <div className="space-y-3">
                                    {mediaKit.items.map((item, index) => (
                                        <button
                                            key={index}
                                            className="w-full flex items-center justify-between bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-4 transition-all duration-300 group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Download className="w-5 h-5 text-white" />
                                                <div className="text-left">
                                                    <p className="text-white font-semibold">{item.name}</p>
                                                    <p className="text-white/70 text-sm">{item.type} • {item.size}</p>
                                                </div>
                                            </div>
                                            <Download className="w-5 h-5 text-white group-hover:translate-y-1 transition-transform duration-300" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Contact */}
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/20">
                                <h3 className="text-3xl font-bold text-white mb-4">
                                    {contactPress.title}
                                </h3>
                                <p className="text-white/90 mb-6">
                                    {contactPress.description}
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                            <Mail className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-white/70 text-sm">Email</p>
                                            <a href={`mailto:${contactPress.email}`} className="text-white font-semibold hover:underline">
                                                {contactPress.email}
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                            <Phone className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-white/70 text-sm">Phone</p>
                                            <a href={`tel:${contactPress.phone}`} className="text-white font-semibold hover:underline">
                                                {contactPress.phone}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <Footer links={footerLinks} socialLinks={socialLinks} />
        </div>
    )
}

export default PressPage
