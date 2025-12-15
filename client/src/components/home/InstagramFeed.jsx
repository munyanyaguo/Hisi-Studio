import { Instagram, ExternalLink } from 'lucide-react'

const InstagramFeed = ({ posts = [], username = 'hisistudio' }) => {
    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-semibold mb-4">
                        <Instagram className="w-4 h-4" />
                        <span>Follow Us on Instagram</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        @{username}
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Join our community and see how our customers are styling their adaptive fashion pieces.
                    </p>
                </div>

                {/* Instagram Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    {posts.map((post) => (
                        <a
                            key={post.id}
                            href={post.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                        >
                            {/* Image */}
                            <img
                                src={post.image}
                                alt={post.alt}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                loading="lazy"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-3 right-3">
                                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                        <ExternalLink className="w-4 h-4 text-gray-900" />
                                    </div>
                                </div>
                            </div>

                            {/* Instagram Icon Overlay */}
                            <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                    <Instagram className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        </a>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="text-center">
                    <a
                        href={`https://instagram.com/${username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500/50 shadow-lg hover:shadow-xl"
                    >
                        <Instagram className="w-5 h-5" />
                        <span>Follow @{username}</span>
                    </a>
                </div>
            </div>
        </section>
    )
}

export default InstagramFeed
