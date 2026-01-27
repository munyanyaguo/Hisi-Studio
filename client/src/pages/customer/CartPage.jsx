import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, ShoppingCart, Loader2 } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { footerLinks, socialLinks } from '../../data/mockData';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

const CartPage = () => {
    const navigate = useNavigate();
    const { cart, loading, error, updateCartItem, removeFromCart, clearCart, cartSubtotal } = useCart();
    const { isAuthenticated } = useAuth();
    const [updatingItems, setUpdatingItems] = useState({});
    const [removingItems, setRemovingItems] = useState({});

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleQuantityChange = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;

        setUpdatingItems(prev => ({ ...prev, [itemId]: true }));
        await updateCartItem(itemId, newQuantity);
        setUpdatingItems(prev => ({ ...prev, [itemId]: false }));
    };

    const handleRemoveItem = async (itemId) => {
        setRemovingItems(prev => ({ ...prev, [itemId]: true }));
        await removeFromCart(itemId);
        setRemovingItems(prev => ({ ...prev, [itemId]: false }));
    };

    const handleCheckout = () => {
        if (!isAuthenticated()) {
            // Redirect to login with return URL
            navigate('/login?redirect=/checkout');
        } else {
            navigate('/checkout');
        }
    };

    const items = cart?.items || [];

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                        <Link
                            to="/shop"
                            className="flex items-center gap-2 text-hisi-primary hover:text-hisi-accent transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Continue Shopping
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-12 h-12 text-hisi-primary animate-spin mb-4" />
                            <p className="text-gray-600">Loading your cart...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-20">
                            <p className="text-red-500 mb-4">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="text-hisi-primary hover:underline"
                            >
                                Try again
                            </button>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-20">
                            <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
                            <p className="text-gray-600 mb-8">Looks like you haven't added any items yet.</p>
                            <Link
                                to="/shop"
                                className="inline-flex items-center gap-2 bg-hisi-primary text-white px-8 py-3 font-semibold hover:bg-hisi-accent transition-colors"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-4">
                                {items.map((item) => {
                                    const product = item.product || {};
                                    const itemPrice = item.price_at_addition || product.price || 0;
                                    const isUpdating = updatingItems[item.id];
                                    const isRemoving = removingItems[item.id];

                                    return (
                                        <div
                                            key={item.id}
                                            className={`bg-white p-6 shadow-sm flex gap-6 ${isRemoving ? 'opacity-50' : ''}`}
                                        >
                                            {/* Product Image */}
                                            <div className="w-24 h-24 flex-shrink-0 bg-gray-100 overflow-hidden">
                                                <img
                                                    src={product.main_image || product.images?.main || '/images/products/placeholder.jpg'}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-1 min-w-0">
                                                <Link
                                                    to={`/shop/${product.id}`}
                                                    className="text-lg font-semibold text-gray-900 hover:text-hisi-primary transition-colors"
                                                >
                                                    {product.name}
                                                </Link>
                                                <p className="text-gray-500 text-sm mt-1">
                                                    {product.category?.name || 'Adaptive Fashion'}
                                                </p>
                                                <p className="text-hisi-primary font-semibold mt-2">
                                                    {formatPrice(itemPrice)}
                                                </p>
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex flex-col items-end justify-between">
                                                <button
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    disabled={isRemoving}
                                                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                    title="Remove item"
                                                >
                                                    {isRemoving ? (
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-5 h-5" />
                                                    )}
                                                </button>

                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1 || isUpdating}
                                                        className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:border-hisi-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="w-8 text-center font-medium">
                                                        {isUpdating ? (
                                                            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                                                        ) : (
                                                            item.quantity
                                                        )}
                                                    </span>
                                                    <button
                                                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                        disabled={isUpdating}
                                                        className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:border-hisi-primary disabled:opacity-50 transition-colors"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <p className="font-semibold text-gray-900">
                                                    {formatPrice(itemPrice * item.quantity)}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Clear Cart Button */}
                                <div className="flex justify-end pt-4">
                                    <button
                                        onClick={clearCart}
                                        className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                                    >
                                        Clear Cart
                                    </button>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white p-6 shadow-sm sticky top-24">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between text-gray-600">
                                            <span>Subtotal ({items.length} items)</span>
                                            <span>{formatPrice(cartSubtotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>Shipping</span>
                                            <span className="text-green-600">Calculated at checkout</span>
                                        </div>
                                        <div className="border-t pt-4 flex justify-between text-lg font-bold text-gray-900">
                                            <span>Total</span>
                                            <span>{formatPrice(cartSubtotal)}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleCheckout}
                                        className="w-full bg-hisi-primary text-white py-4 font-semibold uppercase tracking-wider hover:bg-hisi-accent transition-colors"
                                    >
                                        Proceed to Checkout
                                    </button>

                                    {!isAuthenticated() && (
                                        <p className="text-sm text-gray-500 text-center mt-4">
                                            You'll need to <Link to="/login?redirect=/cart" className="text-hisi-primary hover:underline">sign in</Link> to checkout
                                        </p>
                                    )}

                                    {/* Trust Badges */}
                                    <div className="mt-6 pt-6 border-t">
                                        <p className="text-sm text-gray-500 text-center mb-3">Secure Checkout</p>
                                        <div className="flex justify-center gap-4 text-gray-400">
                                            <span className="text-xs">M-Pesa</span>
                                            <span className="text-xs">Visa</span>
                                            <span className="text-xs">Mastercard</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer links={footerLinks} socialLinks={socialLinks} />
        </>
    );
};

export default CartPage;
