import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Heart, Eye } from 'lucide-react'

const FlipProductCard = ({ id, image, name, price, description, category }) => {
    const [isFlipped, setIsFlipped] = useState(false)

    return (
        <Link
            to={`/product/${id}`}
            className="group block"
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
        >
            <div className="relative w-full aspect-[3/4] perspective-1000">
                {/* Card Container */}
                <div className="relative w-full h-full transition-all duration-500 transform-style-3d">

                    {/* Front Side - Image - Boxy (no rounded corners) */}
                    <div
                        className={`absolute inset-0 w-full h-full overflow-hidden shadow-lg transition-all duration-500 ${isFlipped ? 'opacity-0 h-0' : 'opacity-100 h-full'
                            }`}
                    >
                        <img
                            src={image}
                            alt={name}
                            className="w-full h-full object-cover"
                        />
                        {/* Gradient overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {/* Category badge - Boxy */}
                        {category && (
                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1">
                                <span className="text-xs font-semibold text-gray-900">{category}</span>
                            </div>
                        )}
                    </div>

                    {/* Back Side - Info with translucent overlay - Boxy */}
                    <div
                        className={`absolute inset-0 w-full h-full overflow-hidden shadow-2xl transition-all duration-500 ${isFlipped ? 'opacity-100 h-full' : 'opacity-0 h-0'
                            }`}
                    >
                        {/* Background image with blur */}
                        <div className="absolute inset-0">
                            <img
                                src={image}
                                alt={name}
                                className="w-full h-full object-cover blur-sm scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-hisi-primary/90 via-hisi-accent/85 to-purple-600/90 backdrop-blur-md"></div>
                        </div>

                        {/* Content */}
                        <div className="relative h-full flex flex-col justify-between p-6 text-white">
                            <div>
                                <h3 className="text-lg font-bold mb-2 line-clamp-2">{name}</h3>
                                <p className="text-sm text-white/90 line-clamp-3 mb-4">{description}</p>
                            </div>

                            <div>
                                <div className="text-2xl font-bold mb-4">KES {price.toLocaleString()}</div>

                                {/* Action buttons - Boxy */}
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault()
                                            // Add to cart logic
                                        }}
                                        className="flex-1 bg-white text-hisi-primary font-semibold py-2 px-4 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center space-x-2"
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        <span className="text-sm">Add to Cart</span>
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.preventDefault()
                                            // Add to wishlist logic
                                        }}
                                        className="bg-white/20 backdrop-blur-sm text-white p-2 hover:bg-white/30 transition-colors duration-200"
                                    >
                                        <Heart className="w-5 h-5" />
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.preventDefault()
                                            // Quick view logic
                                        }}
                                        className="bg-white/20 backdrop-blur-sm text-white p-2 hover:bg-white/30 transition-colors duration-200"
                                    >
                                        <Eye className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product name and price below card (always visible) */}
            <div className="mt-3">
                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-hisi-primary transition-colors line-clamp-2">
                    {name}
                </h4>
                <p className="text-sm text-gray-600 font-medium mt-1">KES {price.toLocaleString()}</p>
            </div>
        </Link>
    )
}

export default FlipProductCard
