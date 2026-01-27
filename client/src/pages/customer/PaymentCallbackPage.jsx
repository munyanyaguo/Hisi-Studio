import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Package, ArrowRight } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { footerLinks, socialLinks } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { verifyPayment } from '../../services/paymentApi';

const PaymentCallbackPage = () => {
    const [searchParams] = useSearchParams();
    const { token } = useAuth();

    const [status, setStatus] = useState('verifying'); // verifying, success, failed
    const [paymentData, setPaymentData] = useState(null);
    const [error, setError] = useState(null);

    // Get transaction reference from URL
    const txRef = searchParams.get('tx_ref') || searchParams.get('transaction_id');
    const flwStatus = searchParams.get('status');

    useEffect(() => {
        const verifyTransaction = async () => {
            if (!txRef) {
                setStatus('failed');
                setError('No transaction reference found');
                return;
            }

            // If Flutterwave already indicates failure
            if (flwStatus === 'cancelled' || flwStatus === 'failed') {
                setStatus('failed');
                setError('Payment was cancelled or failed');
                return;
            }

            try {
                const response = await verifyPayment(txRef, token);
                const data = response.data || response;

                if (data.status === 'successful' || response.status === 'success') {
                    setStatus('success');
                    setPaymentData(data);
                } else {
                    setStatus('failed');
                    setError(data.message || 'Payment verification failed');
                }
            } catch (err) {
                console.error('Payment verification error:', err);
                setStatus('failed');
                setError(err.message || 'Failed to verify payment');
            }
        };

        verifyTransaction();
    }, [txRef, flwStatus, token]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 mt-20">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    {/* Verifying State */}
                    {status === 'verifying' && (
                        <div className="bg-white p-12 shadow-sm text-center">
                            <Loader2 className="w-16 h-16 text-hisi-primary animate-spin mx-auto mb-6" />
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">
                                Verifying Your Payment
                            </h1>
                            <p className="text-gray-600">
                                Please wait while we confirm your payment...
                            </p>
                        </div>
                    )}

                    {/* Success State */}
                    {status === 'success' && (
                        <div className="bg-white p-12 shadow-sm text-center">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-12 h-12 text-green-600" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                Payment Successful!
                            </h1>
                            <p className="text-gray-600 mb-8">
                                Thank you for your order. We've received your payment and will process your order shortly.
                            </p>

                            {paymentData && (
                                <div className="bg-gray-50 p-6 text-left mb-8">
                                    <h3 className="font-semibold text-gray-900 mb-4">Payment Details</h3>
                                    <div className="space-y-2 text-sm">
                                        {paymentData.order_number && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Order Number:</span>
                                                <span className="font-medium">{paymentData.order_number}</span>
                                            </div>
                                        )}
                                        {paymentData.transaction_id && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Transaction ID:</span>
                                                <span className="font-medium">{paymentData.transaction_id}</span>
                                            </div>
                                        )}
                                        {paymentData.amount && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Amount Paid:</span>
                                                <span className="font-medium text-green-600">
                                                    {formatPrice(paymentData.amount)}
                                                </span>
                                            </div>
                                        )}
                                        {paymentData.payment_method && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Payment Method:</span>
                                                <span className="font-medium capitalize">
                                                    {paymentData.payment_method.replace('_', ' ')}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    to="/orders"
                                    className="inline-flex items-center justify-center gap-2 bg-hisi-primary text-white px-8 py-3 font-semibold hover:bg-hisi-accent transition-colors"
                                >
                                    <Package className="w-5 h-5" />
                                    View My Orders
                                </Link>
                                <Link
                                    to="/shop"
                                    className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 px-8 py-3 font-semibold hover:border-hisi-primary transition-colors"
                                >
                                    Continue Shopping
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Failed State */}
                    {status === 'failed' && (
                        <div className="bg-white p-12 shadow-sm text-center">
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <XCircle className="w-12 h-12 text-red-600" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                Payment Failed
                            </h1>
                            <p className="text-gray-600 mb-2">
                                We couldn't process your payment.
                            </p>
                            {error && (
                                <p className="text-red-600 mb-8">{error}</p>
                            )}

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    to="/cart"
                                    className="inline-flex items-center justify-center gap-2 bg-hisi-primary text-white px-8 py-3 font-semibold hover:bg-hisi-accent transition-colors"
                                >
                                    Try Again
                                </Link>
                                <Link
                                    to="/contact"
                                    className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 px-8 py-3 font-semibold hover:border-hisi-primary transition-colors"
                                >
                                    Contact Support
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Help Section */}
                    <div className="mt-8 text-center text-sm text-gray-500">
                        <p>
                            Need help? Contact us at{' '}
                            <a href="mailto:support@hisistudio.com" className="text-hisi-primary hover:underline">
                                support@hisistudio.com
                            </a>
                        </p>
                    </div>
                </div>
            </div>
            <Footer links={footerLinks} socialLinks={socialLinks} />
        </>
    );
};

export default PaymentCallbackPage;
