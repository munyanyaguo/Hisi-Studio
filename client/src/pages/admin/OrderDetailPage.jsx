import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import ShippingTracker from '../../components/admin/orders/ShippingTracker';
import './OrderDetailPage.css';

const OrderDetailPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/orders/${orderId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                setOrder(data.data);
            }
        } catch (error) {
            console.error('Error fetching order:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (newStatus) => {
        try {
            setUpdating(true);
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/admin/orders/${orderId}/status`,
                {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ status: newStatus })
                }
            );

            if (response.ok) {
                await fetchOrderDetails();
            }
        } catch (error) {
            console.error('Error updating order:', error);
        } finally {
            setUpdating(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading order details...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="error-container">
                <h2>Order not found</h2>
                <button onClick={() => navigate('/admin/orders')} className="btn-secondary">
                    Back to Orders
                </button>
            </div>
        );
    }

    return (
        <div className="order-detail-page">
            <button className="back-button" onClick={() => navigate('/admin/orders')}>
                <ArrowLeft size={20} />
                Back to Orders
            </button>

            <div className="order-header">
                <div>
                    <h1>Order #{order.id.slice(0, 8)}</h1>
                    <p className="order-date">Placed on {formatDate(order.created_at)}</p>
                </div>
                <div className="order-status-section">
                    <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(e.target.value)}
                        disabled={updating}
                        className="status-select"
                    >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="order-content">
                <div className="order-main">
                    <div className="section-card">
                        <h2>Order Items</h2>
                        <div className="items-list">
                            {order.items?.map((item, index) => (
                                <div key={index} className="order-item">
                                    <div className="item-image">
                                        <Package size={40} />
                                    </div>
                                    <div className="item-details">
                                        <h3>{item.product_name}</h3>
                                        <p className="item-meta">
                                            Quantity: {item.quantity} × {formatCurrency(item.price)}
                                        </p>
                                    </div>
                                    <div className="item-total">
                                        {formatCurrency(item.quantity * item.price)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="order-summary">
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>{formatCurrency(order.subtotal || order.total_amount)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span>{formatCurrency(order.shipping_cost || 0)}</span>
                            </div>
                            <div className="summary-row total">
                                <span>Total</span>
                                <span>{formatCurrency(order.total_amount)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="order-sidebar">
                    <div className="section-card">
                        <h2>Customer Information</h2>
                        <div className="info-group">
                            <label>Name</label>
                            <p>{order.user?.first_name} {order.user?.last_name}</p>
                        </div>
                        <div className="info-group">
                            <label>Email</label>
                            <p>{order.user?.email}</p>
                        </div>
                        <div className="info-group">
                            <label>Phone</label>
                            <p>{order.user?.phone || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="section-card">
                        <h2>Shipping Address</h2>
                        <div className="address-block">
                            <p>{order.shipping_address?.street}</p>
                            <p>{order.shipping_address?.city}, {order.shipping_address?.state}</p>
                            <p>{order.shipping_address?.postal_code}</p>
                            <p>{order.shipping_address?.country}</p>
                        </div>
                    </div>

                    <div className="section-card">
                        <ShippingTracker order={order} />
                    </div>

                    <div className="section-card">
                        <h2>Payment Information</h2>
                        <div className="info-group">
                            <label>Method</label>
                            <p>{order.payment_method || 'N/A'}</p>
                        </div>
                        <div className="info-group">
                            <label>Status</label>
                            <p className={`payment-status ${order.payment_status}`}>
                                {order.payment_status || 'Pending'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;
