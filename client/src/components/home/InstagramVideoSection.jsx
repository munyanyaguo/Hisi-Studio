import { Instagram, Volume2, VolumeX } from 'lucide-react'
import { useState, useRef } from 'react'

const InstagramVideoSection = ({ videoUrl, videoFile, caption, username }) => {
    const [isMuted, setIsMuted] = useState(true)
    const videoRef = useRef(null)

    // Extract Instagram post ID from URL for embed fallback
    const getEmbedUrl = (url) => {
        const match = url.match(/\/p\/([^\/]+)/)
        if (match) {
            return `https://www.instagram.com/p/${match[1]}/embed/`
        }
        return url
    }

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted
            setIsMuted(!isMuted)
        }
    }

    return (
        <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <Instagram className="w-8 h-8 text-hisi-primary" />
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Latest from Instagram
                        </h2>
                    </div>
                    <a
                        href={`https://www.instagram.com/${username}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-hisi-primary hover:text-hisi-accent transition-colors duration-300"
                    >
                        <span className="font-medium">@{username}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                </div>

                {/* Video and Caption Grid */}
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Video Player or Instagram Embed - Boxy */}
                    <div className="relative overflow-hidden shadow-2xl bg-white">
                        <div className="aspect-[4/5] relative">
                            {videoFile ? (
                                <>
                                    <video
                                        ref={videoRef}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        src={videoFile}
                                    />
                                    <button
                                        onClick={toggleMute}
                                        className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white p-3 transition-all duration-300 backdrop-blur-sm z-10"
                                        aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                                    >
                                        {isMuted ? (
                                            <VolumeX className="w-5 h-5" />
                                        ) : (
                                            <Volume2 className="w-5 h-5" />
                                        )}
                                    </button>
                                </>
                            ) : (
                                <iframe
                                    src={getEmbedUrl(videoUrl)}
                                    className="absolute inset-0 w-full h-full"
                                    frameBorder="0"
                                    scrolling="no"
                                    allow="encrypted-media"
                                    title="Instagram Video"
                                />
                            )}
                        </div>
                    </div>

                    {/* Caption and CTA */}
                    <div className="space-y-6">
                        <div className="prose prose-lg max-w-none">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {caption}
                            </p>
                        </div>

                        {/* Follow CTA - Boxy */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href={`https://www.instagram.com/${username}/`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                            >
                                <Instagram className="w-5 h-5 mr-2" />
                                Follow Us on Instagram
                            </a>
                            <a
                                href={videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center px-6 py-3 border-2 border-hisi-primary text-hisi-primary font-semibold hover:bg-hisi-primary hover:text-white transition-all duration-300"
                            >
                                View Full Post
                            </a>
                        </div>

                        {/* Engagement Stats */}
                        <div className="flex items-center space-x-6 pt-4 border-t border-gray-200">
                            <div className="flex items-center space-x-2 text-gray-600">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm font-medium">Join our community</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default InstagramVideoSection
