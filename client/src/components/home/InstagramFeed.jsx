import { Instagram } from 'lucide-react'
import { useEffect, useRef } from 'react'

const InstagramFeed = ({ username }) => {
    const scrollRef = useRef(null)

    // Real Instagram post URLs from @hisi_studio
    const instagramPosts = [
        'https://www.instagram.com/p/DGfhSLRNHHT/',
        'https://www.instagram.com/p/DGfhSLRNHHT/',
        'https://www.instagram.com/p/DGfhSLRNHHT/',
        'https://www.instagram.com/p/DGfhSLRNHHT/',
        'https://www.instagram.com/p/DGfhSLRNHHT/',
        'https://www.instagram.com/p/DGfhSLRNHHT/',
    ]

    useEffect(() => {
        const scrollContainer = scrollRef.current
        if (!scrollContainer) return

        let scrollPosition = 0
        const scrollSpeed = 1
        let animationFrameId

        const scroll = () => {
            scrollPosition += scrollSpeed

            if (scrollPosition >= scrollContainer.scrollWidth / 2) {
                scrollPosition = 0
            }

            scrollContainer.scrollLeft = scrollPosition
            animationFrameId = requestAnimationFrame(scroll)
        }

        animationFrameId = requestAnimationFrame(scroll)

        const handleMouseEnter = () => {
            cancelAnimationFrame(animationFrameId)
        }

        const handleMouseLeave = () => {
            animationFrameId = requestAnimationFrame(scroll)
        }

        scrollContainer.addEventListener('mouseenter', handleMouseEnter)
        scrollContainer.addEventListener('mouseleave', handleMouseLeave)

        return () => {
            cancelAnimationFrame(animationFrameId)
            scrollContainer.removeEventListener('mouseenter', handleMouseEnter)
            scrollContainer.removeEventListener('mouseleave', handleMouseLeave)
        }
    }, [])

    // Duplicate posts for seamless infinite scroll
    const duplicatedPosts = [...instagramPosts, ...instagramPosts]

    const getEmbedUrl = (url) => {
        const match = url.match(/\/p\/([^\/]+)/)
        if (match) {
            return `https://www.instagram.com/p/${match[1]}/embed/captioned`
        }
        return url
    }

    return (
        <section className="py-16 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Follow Us on Instagram
                    </h2>
                    <a
                        href={`https://www.instagram.com/${username}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-hisi-primary hover:text-hisi-accent transition-colors duration-300 group"
                    >
                        <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-semibold text-lg">@{username}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                </div>
            </div>

            {/* Infinite Scroll Container */}
            <div
                ref={scrollRef}
                className="flex gap-0 overflow-x-hidden"
                style={{ scrollBehavior: 'auto' }}
            >
                {duplicatedPosts.map((postUrl, index) => (
                    <div
                        key={`post-${index}`}
                        className="flex-shrink-0 border-r border-gray-200 last:border-r-0"
                        style={{ width: '400px', height: '600px' }}
                    >
                        <iframe
                            src={getEmbedUrl(postUrl)}
                            className="w-full h-full"
                            frameBorder="0"
                            scrolling="no"
                            allowtransparency="true"
                            title={`Instagram Post ${index + 1}`}
                        />
                    </div>
                ))}
            </div>

            {/* Bottom CTA */}
            <div className="text-center mt-8">
                <a
                    href={`https://www.instagram.com/${username}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-semibold rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                >
                    <Instagram className="w-5 h-5 mr-2" />
                    Follow @{username}
                </a>
            </div>
        </section>
    )
}

export default InstagramFeed
