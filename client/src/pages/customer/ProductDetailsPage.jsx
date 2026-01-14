import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Heart, Share2, ChevronLeft, ChevronRight, Star, Check, Truck, Shield, RotateCcw, Loader2 } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { footerLinks, socialLinks } from '../../data/mockData';
import { getProductById } from '../../services/productsApi';

const ProductDetailsPage = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductById(productId);
                // Handle both response formats
                const productData = data.data || data;

                // Transform API data to match component expectations
                setProduct({
                    ...productData,
                    images: productData.images || [productData.main_image, productData.hover_image].filter(Boolean),
                    accessibilityFeatures: productData.accessibility_features || productData.accessibilityFeatures || [],
                    reviewCount: productData.review_count || productData.reviewCount || 0,
                    originalPrice: productData.original_price || productData.originalPrice,
                    careInstructions: productData.care_instructions || productData.careInstructions,
                    inStock: productData.in_stock !== undefined ? productData.in_stock : productData.stock_quantity > 0
                });
            } catch (error) {
                console.error('Error fetching product:', error);
                // Only use mock data if API truly fails
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleAddToCart = () => {
        // TODO: Integrate with cart API
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 3000);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 0,
        }).format(price);
    };

    if (loading) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hisi-primary"></div>
                </div>
                <Footer links={footerLinks} socialLinks={socialLinks} />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
                    <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
                    <Link to="/shop" className="bg-hisi-primary text-white px-8 py-3 font-semibold hover:bg-hisi-primary/90 transition-colors">
                        Back to Shop
                    </Link>
                </div>
                <Footer links={footerLinks} socialLinks={socialLinks} />
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
                {/* Breadcrumb */}
                <nav className="mb-8">
                    <ol className="flex items-center space-x-2 text-sm text-gray-500">
                        <li><Link to="/" className="hover:text-hisi-primary">Home</Link></li>
                        <li>/</li>
                        <li><Link to="/shop" className="hover:text-hisi-primary">Shop</Link></li>
                        <li>/</li>
                        <li className="text-gray-900 font-medium">{product.name}</li>
                    </ol>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                            <img
                                src={product.images?.[selectedImage] || product.images?.main || '/images/products/placeholder.jpg'}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            {product.badge && (
                                <span className="absolute top-4 left-4 bg-hisi-accent text-white px-3 py-1 text-sm font-semibold">
                                    {product.badge}
                                </span>
                            )}

                            {/* Navigation arrows */}
                            {product.images?.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : product.images.length - 1)}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 shadow-lg transition-all"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={() => setSelectedImage(prev => prev < product.images.length - 1 ? prev + 1 : 0)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 shadow-lg transition-all"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnail gallery */}
                        {product.images?.length > 1 && (
                            <div className="flex space-x-3 overflow-x-auto pb-2">
                                {product.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`flex-shrink-0 w-20 h-20 overflow-hidden border-2 transition-all ${selectedImage === index ? 'border-hisi-primary' : 'border-transparent opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>

                            {/* Rating */}
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-5 h-5 ${i < Math.floor(product.rating || 5) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-gray-600">({product.reviewCount || 0} reviews)</span>
                            </div>

                            {/* Price */}
                            <div className="flex items-center space-x-3">
                                <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                                {product.originalPrice && product.originalPrice > product.price && (
                                    <>
                                        <span className="text-xl text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                                        <span className="bg-red-100 text-red-700 px-2 py-1 text-sm font-medium">
                                            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>

                        {/* Color selection */}
                        {product.colors?.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">Color: {selectedColor?.name || 'Select a color'}</h3>
                                <div className="flex space-x-3">
                                    {product.colors.map((color) => (
                                        <button
                                            key={color.name}
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor?.name === color.name ? 'border-hisi-primary ring-2 ring-hisi-primary ring-offset-2' : 'border-gray-200'
                                                }`}
                                            style={{ backgroundColor: color.value }}
                                            title={color.name}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size selection */}
                        {product.sizes?.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-semibold text-gray-900">Size: {selectedSize || 'Select a size'}</h3>
                                    <button className="text-hisi-primary text-sm underline">Size Guide</button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-4 py-2 border-2 font-medium transition-all ${selectedSize === size
                                                ? 'border-hisi-primary bg-hisi-primary text-white'
                                                : 'border-gray-200 hover:border-hisi-primary'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3">Quantity</h3>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="w-10 h-10 border-2 border-gray-200 flex items-center justify-center hover:border-hisi-primary transition-colors"
                                >
                                    -
                                </button>
                                <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(q => q + 1)}
                                    className="w-10 h-10 border-2 border-gray-200 flex items-center justify-center hover:border-hisi-primary transition-colors"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={addedToCart}
                                className={`flex-1 py-4 px-8 font-semibold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all ${addedToCart
                                    ? 'bg-green-600 text-white'
                                    : 'bg-hisi-primary text-white hover:bg-hisi-primary/90'
                                    }`}
                            >
                                {addedToCart ? (
                                    <>
                                        <Check className="w-5 h-5" />
                                        <span>Added to Cart</span>
                                    </>
                                ) : (
                                    <>
                                        <ShoppingBag className="w-5 h-5" />
                                        <span>Add to Cart</span>
                                    </>
                                )}
                            </button>
                            <button className="w-14 h-14 border-2 border-gray-200 flex items-center justify-center hover:border-hisi-primary hover:text-hisi-primary transition-colors">
                                <Heart className="w-6 h-6" />
                            </button>
                            <button className="w-14 h-14 border-2 border-gray-200 flex items-center justify-center hover:border-hisi-primary hover:text-hisi-primary transition-colors">
                                <Share2 className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Features */}
                        <div className="border-t pt-6 space-y-4">
                            <div className="flex items-center space-x-3 text-gray-600">
                                <Truck className="w-5 h-5" />
                                <span>Free shipping on orders over KES 5,000</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-600">
                                <Shield className="w-5 h-5" />
                                <span>1-year warranty on all products</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-600">
                                <RotateCcw className="w-5 h-5" />
                                <span>30-day easy returns</span>
                            </div>
                        </div>

                        {/* Accessibility Features */}
                        {product.accessibilityFeatures?.length > 0 && (
                            <div className="border-t pt-6">
                                <h3 className="font-semibold text-gray-900 mb-4">Accessibility Features</h3>
                                <ul className="space-y-2">
                                    {product.accessibilityFeatures.map((feature, index) => (
                                        <li key={index} className="flex items-start space-x-3">
                                            <Check className="w-5 h-5 text-hisi-primary flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-600">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Materials & Care */}
                        <div className="border-t pt-6 space-y-4">
                            {product.materials && (
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Materials</h3>
                                    <p className="text-gray-600">{product.materials}</p>
                                </div>
                            )}
                            {product.careInstructions && (
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Care Instructions</h3>
                                    <p className="text-gray-600">{product.careInstructions}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer links={footerLinks} socialLinks={socialLinks} />
        </div>
    );
};

export default ProductDetailsPage;
