import { Instagram } from 'lucide-react'

const InstagramFeed = ({ username }) => {
    // Instagram posts from @hisi_studio
    // These will be fetched from Instagram's API in production
    const instagramPosts = [
        { id: 1, image: '/images/instagram/post-1.jpg', link: 'https://www.instagram.com/p/DGfhSLRNHHT/' },
        { id: 2, image: '/images/instagram/post-2.jpg', link: 'https://www.instagram.com/p/DGfhSLRNHHT/' },
        { id: 3, image: '/images/instagram/post-3.jpg', link: 'https://www.instagram.com/p/DGfhSLRNHHT/' },
        { id: 4, image: '/images/instagram/post-4.jpg', link: 'https://www.instagram.com/p/DGfhSLRNHHT/' },
        { id: 5, image: '/images/instagram/post-5.jpg', link: 'https://www.instagram.com/p/DGfhSLRNHHT/' },
        { id: 6, image: '/images/instagram/post-6.jpg', link: 'https://www.instagram.com/p/DGfhSLRNHHT/' },
    ]

    return (
        <section className="bg-white">
            {/* Instagram Posts Grid - Full Width, Boxy, No Gaps */}
            <div className="grid grid-cols-3 sm:grid-cols-6">
                {instagramPosts.map((post) => (
                    <a
                        key={post.id}
                        href={post.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative aspect-square overflow-hidden bg-gray-100"
                    >
                        {/* Post Image */}
                        <img
                            src={post.image}
                            alt={`Instagram post ${post.id}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                                e.target.style.display = 'none'
                                e.target.nextSibling.style.display = 'flex'
                            }}
                        />
                        {/* Fallback placeholder */}
                        <div
                            style={{ display: 'none' }}
                            className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 items-center justify-center"
                        >
                            <Instagram className="w-8 h-8 text-white" />
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <Instagram className="w-8 h-8 text-white transform scale-75 group-hover:scale-100 transition-transform duration-300" />
                        </div>
                    </a>
                ))}
            </div>
        </section>
    )
}

export default InstagramFeed
