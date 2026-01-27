import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ChevronRight, Loader2, ShoppingBag, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { footerLinks, socialLinks } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { getOrders } from '../../services/orderApi';

const OrdersPage = () => {
    const navigate = useNavigate();
    const { token, isAuthenticated } = useAuth();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login?redirect=/orders');
        }
    }, [isAuthenticated, navigate]);

    // Fetch orders
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const data = await getOrders({}, token);
                setOrders(data.data?.orders || data.orders || []);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError(err.message || 'Failed to load orders');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchOrders();
        }
    }, [token]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-KE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'confirmed':
            case 'processing':
                return <Package className="w-5 h-5 text-blue-500" />;
            case 'shipped':
                return <Truck className="w-5 h-5 text-purple-500" />;
            case 'delivered':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'cancelled':
            case 'refunded':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Package className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmed':
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'shipped':
                return 'bg-purple-100 text-purple-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
            case 'refunded':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 mt-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                        <Link
                            to="/shop"
                            className="text-hisi-primary hover:text-hisi-accent transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-12 h-12 text-hisi-primary animate-spin mb-4" />
                            <p className="text-gray-600">Loading your orders...</p>
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
                    ) : orders.length === 0 ? (
                        <div className="text-center py-20 bg-white shadow-sm">
                            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">No orders yet</h2>
                            <p className="text-gray-600 mb-8">
                                You haven't placed any orders yet. Start shopping to see your orders here.
                            </p>
                            <Link
                                to="/shop"
                                className="inline-flex items-center gap-2 bg-hisi-primary text-white px-8 py-3 font-semibold hover:bg-hisi-accent transition-colors"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div key={order.id} className="bg-white shadow-sm overflow-hidden">
                                    {/* Order Header */}
                                    <div className="p-6 border-b border-gray-100">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    {getStatusIcon(order.status)}
                                                    <span className="font-semibold text-gray-900">
                                                        Order {order.order_number}
                                                    </span>
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Placed on {formatDate(order.created_at)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-gray-900">
                                                    {formatPrice(order.total)}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {order.items?.length || 0} item(s)
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Items Preview */}
                                    <div className="p-6">
                                        <div className="flex flex-wrap gap-4 mb-4">
                                            {(order.items || []).slice(0, 3).map((item) => (
                                                <div key={item.id} className="flex items-center gap-3">
                                                    <div className="w-16 h-16 bg-gray-100 overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={item.product_image || '/images/products/placeholder.jpg'}
                                                            alt={item.product_name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-medium text-gray-900 text-sm truncate max-w-[150px]">
                                                            {item.product_name}
                                                        </p>
                                                        <p className="text-gray-500 text-sm">
                                                            Qty: {item.quantity}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                            {(order.items?.length || 0) > 3 && (
                                                <div className="flex items-center text-gray-500 text-sm">
                                                    +{order.items.length - 3} more
                                                </div>
                                            )}
                                        </div>

                                        {/* Tracking Info */}
                                        {order.tracking_number && (
                                            <p className="text-sm text-gray-600 mb-4">
                                                Tracking: <span className="font-medium">{order.tracking_number}</span>
                                            </p>
                                        )}

                                        {/* View Order Link */}
                                        <Link
                                            to={`/orders/${order.id}`}
                                            className="inline-flex items-center gap-1 text-hisi-primary hover:text-hisi-accent font-medium text-sm transition-colors"
                                        >
                                            View Order Details
                                            <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer links={footerLinks} socialLinks={socialLinks} />
        </>
    );
};

export default OrdersPage;
