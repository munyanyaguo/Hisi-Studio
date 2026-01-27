import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Plus, CreditCard, Loader2, AlertCircle, Check } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { footerLinks, socialLinks } from '../../data/mockData';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { getAddresses, createAddress } from '../../services/addressApi';
import { createOrder } from '../../services/orderApi';
import { initializePayment } from '../../services/paymentApi';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cart, cartSubtotal, validateCart, refreshCart } = useCart();
    const { token, isAuthenticated, user } = useAuth();

    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [orderNotes, setOrderNotes] = useState('');

    const [newAddress, setNewAddress] = useState({
        full_name: '',
        phone: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'Kenya',
        address_type: 'shipping',
        is_default: false,
    });

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login?redirect=/checkout');
        }
    }, [isAuthenticated, navigate]);

    // Redirect if cart is empty
    useEffect(() => {
        if (!loading && (!cart?.items || cart.items.length === 0)) {
            navigate('/cart');
        }
    }, [cart, loading, navigate]);

    // Fetch addresses
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                setLoading(true);
                const data = await getAddresses(token);
                const addressList = data.data || data.addresses || [];
                setAddresses(addressList);

                // Select default address if available
                const defaultAddr = addressList.find(a => a.is_default);
                if (defaultAddr) {
                    setSelectedAddress(defaultAddr.id);
                } else if (addressList.length > 0) {
                    setSelectedAddress(addressList[0].id);
                }
            } catch (err) {
                console.error('Error fetching addresses:', err);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchAddresses();
        }
    }, [token]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleAddressChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewAddress(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            setProcessing(true);
            setError(null);

            const data = await createAddress(newAddress, token);
            const createdAddress = data.data || data.address;

            setAddresses(prev => [...prev, createdAddress]);
            setSelectedAddress(createdAddress.id);
            setShowAddressForm(false);
            setNewAddress({
                full_name: '',
                phone: '',
                address_line1: '',
                address_line2: '',
                city: '',
                state: '',
                postal_code: '',
                country: 'Kenya',
                address_type: 'shipping',
                is_default: false,
            });
        } catch (err) {
            setError(err.message || 'Failed to add address');
        } finally {
            setProcessing(false);
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            setError('Please select a shipping address');
            return;
        }

        try {
            setProcessing(true);
            setError(null);

            // Validate cart first
            const validation = await validateCart();
            if (!validation.valid) {
                setError(validation.errors?.join(', ') || 'Cart validation failed');
                return;
            }

            // Create order
            const orderData = {
                shipping_address_id: selectedAddress,
                notes: orderNotes || undefined,
            };

            const orderResponse = await createOrder(orderData, token);
            const order = orderResponse.data || orderResponse.order;

            if (!order || !order.id) {
                throw new Error('Failed to create order');
            }

            // Initialize payment
            const redirectUrl = `${window.location.origin}/payment/callback`;
            const paymentResponse = await initializePayment(order.id, redirectUrl, token);
            const paymentData = paymentResponse.data || paymentResponse;

            if (paymentData.payment_link) {
                // Refresh cart (it should be cleared after order creation)
                await refreshCart();
                // Redirect to Flutterwave payment page
                window.location.href = paymentData.payment_link;
            } else {
                throw new Error('Failed to initialize payment');
            }
        } catch (err) {
            console.error('Checkout error:', err);
            setError(err.message || 'Failed to process order');
        } finally {
            setProcessing(false);
        }
    };

    const items = cart?.items || [];
    const shippingCost = 0; // Free shipping for now
    const total = cartSubtotal + shippingCost;

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gray-50 mt-20 flex items-center justify-center">
                    <Loader2 className="w-12 h-12 text-hisi-primary animate-spin" />
                </div>
                <Footer links={footerLinks} socialLinks={socialLinks} />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                        <Link
                            to="/cart"
                            className="flex items-center gap-2 text-hisi-primary hover:text-hisi-accent transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Cart
                        </Link>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Shipping */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Shipping Address */}
                            <div className="bg-white p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <MapPin className="w-5 h-5" />
                                        Shipping Address
                                    </h2>
                                    <button
                                        onClick={() => setShowAddressForm(!showAddressForm)}
                                        className="flex items-center gap-1 text-hisi-primary hover:text-hisi-accent text-sm font-medium"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add New Address
                                    </button>
                                </div>

                                {/* Address Form */}
                                {showAddressForm && (
                                    <form onSubmit={handleAddAddress} className="mb-6 p-4 bg-gray-50 space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Full Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="full_name"
                                                    value={newAddress.full_name}
                                                    onChange={handleAddressChange}
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-hisi-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Phone Number *
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={newAddress.phone}
                                                    onChange={handleAddressChange}
                                                    required
                                                    placeholder="e.g., 0712345678"
                                                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-hisi-primary"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Address Line 1 *
                                            </label>
                                            <input
                                                type="text"
                                                name="address_line1"
                                                value={newAddress.address_line1}
                                                onChange={handleAddressChange}
                                                required
                                                placeholder="Street address, P.O. box"
                                                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-hisi-primary"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Address Line 2
                                            </label>
                                            <input
                                                type="text"
                                                name="address_line2"
                                                value={newAddress.address_line2}
                                                onChange={handleAddressChange}
                                                placeholder="Apartment, suite, unit, building, floor, etc."
                                                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-hisi-primary"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    City *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={newAddress.city}
                                                    onChange={handleAddressChange}
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-hisi-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    County/State
                                                </label>
                                                <input
                                                    type="text"
                                                    name="state"
                                                    value={newAddress.state}
                                                    onChange={handleAddressChange}
                                                    placeholder="e.g., Nairobi"
                                                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-hisi-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Postal Code
                                                </label>
                                                <input
                                                    type="text"
                                                    name="postal_code"
                                                    value={newAddress.postal_code}
                                                    onChange={handleAddressChange}
                                                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-hisi-primary"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="is_default"
                                                name="is_default"
                                                checked={newAddress.is_default}
                                                onChange={handleAddressChange}
                                                className="w-4 h-4 text-hisi-primary focus:ring-hisi-primary"
                                            />
                                            <label htmlFor="is_default" className="text-sm text-gray-700">
                                                Set as default address
                                            </label>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="bg-hisi-primary text-white px-6 py-2 font-medium hover:bg-hisi-accent disabled:opacity-50 transition-colors"
                                            >
                                                {processing ? 'Saving...' : 'Save Address'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowAddressForm(false)}
                                                className="border border-gray-300 px-6 py-2 font-medium hover:bg-gray-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {/* Existing Addresses */}
                                {addresses.length > 0 ? (
                                    <div className="space-y-3">
                                        {addresses.map((address) => (
                                            <label
                                                key={address.id}
                                                className={`block p-4 border-2 cursor-pointer transition-all ${
                                                    selectedAddress === address.id
                                                        ? 'border-hisi-primary bg-hisi-primary/5'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <input
                                                        type="radio"
                                                        name="address"
                                                        value={address.id}
                                                        checked={selectedAddress === address.id}
                                                        onChange={() => setSelectedAddress(address.id)}
                                                        className="mt-1 w-4 h-4 text-hisi-primary focus:ring-hisi-primary"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-gray-900">
                                                            {address.full_name}
                                                            {address.is_default && (
                                                                <span className="ml-2 text-xs bg-hisi-primary text-white px-2 py-0.5">
                                                                    Default
                                                                </span>
                                                            )}
                                                        </p>
                                                        <p className="text-gray-600 text-sm mt-1">
                                                            {address.address_line1}
                                                            {address.address_line2 && `, ${address.address_line2}`}
                                                        </p>
                                                        <p className="text-gray-600 text-sm">
                                                            {address.city}, {address.state} {address.postal_code}
                                                        </p>
                                                        <p className="text-gray-600 text-sm">{address.country}</p>
                                                        {address.phone && (
                                                            <p className="text-gray-600 text-sm mt-1">
                                                                Phone: {address.phone}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {selectedAddress === address.id && (
                                                        <Check className="w-5 h-5 text-hisi-primary" />
                                                    )}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">
                                        No saved addresses. Please add a shipping address.
                                    </p>
                                )}
                            </div>

                            {/* Order Notes */}
                            <div className="bg-white p-6 shadow-sm">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Notes (Optional)</h2>
                                <textarea
                                    value={orderNotes}
                                    onChange={(e) => setOrderNotes(e.target.value)}
                                    placeholder="Add any special instructions for your order..."
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-hisi-primary resize-none"
                                />
                            </div>
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 shadow-sm sticky top-24">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                                {/* Items */}
                                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                                    {items.map((item) => {
                                        const product = item.product || {};
                                        const itemPrice = item.price_at_addition || product.price || 0;

                                        return (
                                            <div key={item.id} className="flex gap-3">
                                                <div className="w-16 h-16 bg-gray-100 flex-shrink-0 overflow-hidden">
                                                    <img
                                                        src={product.main_image || '/images/products/placeholder.jpg'}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-900 text-sm truncate">
                                                        {product.name}
                                                    </p>
                                                    <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                                                    <p className="text-hisi-primary font-medium text-sm">
                                                        {formatPrice(itemPrice * item.quantity)}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Totals */}
                                <div className="border-t pt-4 space-y-3">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>{formatPrice(cartSubtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                    <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                                        <span>Total</span>
                                        <span>{formatPrice(total)}</span>
                                    </div>
                                </div>

                                {/* Payment Info */}
                                <div className="mt-6 p-4 bg-gray-50">
                                    <div className="flex items-center gap-2 text-gray-700 mb-2">
                                        <CreditCard className="w-5 h-5" />
                                        <span className="font-medium">Payment Method</span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        You'll be redirected to Flutterwave to complete payment via M-Pesa, Card, or Bank Transfer.
                                    </p>
                                </div>

                                {/* Place Order Button */}
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={processing || !selectedAddress}
                                    className="w-full mt-6 bg-hisi-primary text-white py-4 font-semibold uppercase tracking-wider hover:bg-hisi-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="w-5 h-5" />
                                            Pay {formatPrice(total)}
                                        </>
                                    )}
                                </button>

                                <p className="text-xs text-gray-500 text-center mt-4">
                                    By placing your order, you agree to our Terms of Service and Privacy Policy.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer links={footerLinks} socialLinks={socialLinks} />
        </>
    );
};

export default CheckoutPage;
