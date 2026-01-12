import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, ShoppingBag, Calendar } from 'lucide-react';
import './CustomerDetailPage.css';

const CustomerDetailPage = () => {
    const { customerId } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCustomerDetails();
    }, [customerId]);

    const fetchCustomerDetails = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            // Fetch customer details
            const customerResponse = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/admin/customers/${customerId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (customerResponse.ok) {
                const customerData = await customerResponse.json();
                setCustomer(customerData.data);
            }

            // Fetch customer orders
            const ordersResponse = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/orders?user_id=${customerId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (ordersResponse.ok) {
                const ordersData = await ordersResponse.json();
                setOrders(ordersData.data.orders || []);
            }
        } catch (error) {
            console.error('Error fetching customer:', error);
        } finally {
            setLoading(false);
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
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading customer details...</p>
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="error-container">
                <h2>Customer not found</h2>
                <button onClick={() => navigate('/admin/customers')} className="btn-secondary">
                    Back to Customers
                </button>
            </div>
        );
    }

    const totalSpent = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

    return (
        <div className="customer-detail-page">
            <button className="back-button" onClick={() => navigate('/admin/customers')}>
                <ArrowLeft size={20} />
                Back to Customers
            </button>

            <div className="customer-header">
                <div className="customer-avatar-large">
                    {customer.first_name?.[0] || customer.email?.[0] || 'C'}
                </div>
                <div>
                    <h1>{customer.first_name} {customer.last_name}</h1>
                    <p className="customer-email">{customer.email}</p>
                    <span className={`status-badge ${customer.is_active ? 'active' : 'inactive'}`}>
                        {customer.is_active ? 'Active' : 'Inactive'}
                    </span>
                </div>
            </div>

            <div className="customer-content">
                <div className="customer-main">
                    <div className="section-card">
                        <h2>Contact Information</h2>
                        <div className="info-grid">
                            <div className="info-item">
                                <Mail size={18} />
                                <div>
                                    <label>Email</label>
                                    <p>{customer.email}</p>
                                </div>
                            </div>
                            {customer.phone && (
                                <div className="info-item">
                                    <Phone size={18} />
                                    <div>
                                        <label>Phone</label>
                                        <p>{customer.phone}</p>
                                    </div>
                                </div>
                            )}
                            <div className="info-item">
                                <Calendar size={18} />
                                <div>
                                    <label>Member Since</label>
                                    <p>{formatDate(customer.created_at)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="section-card">
                        <h2>Order History</h2>
                        {orders.length === 0 ? (
                            <p className="no-data">No orders yet</p>
                        ) : (
                            <div className="orders-list">
                                {orders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="order-item"
                                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                                    >
                                        <div>
                                            <h4>Order #{order.id.slice(0, 8)}</h4>
                                            <p className="order-date">{formatDate(order.created_at)}</p>
                                        </div>
                                        <div className="order-amount">
                                            {formatCurrency(order.total_amount)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="customer-sidebar">
                    <div className="section-card">
                        <h2>Statistics</h2>
                        <div className="stats-grid">
                            <div className="stat-item">
                                <ShoppingBag size={24} className="stat-icon" />
                                <div>
                                    <h3>{orders.length}</h3>
                                    <p>Total Orders</p>
                                </div>
                            </div>
                            <div className="stat-item">
                                <span className="stat-icon">💰</span>
                                <div>
                                    <h3>{formatCurrency(totalSpent)}</h3>
                                    <p>Total Spent</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {customer.addresses && customer.addresses.length > 0 && (
                        <div className="section-card">
                            <h2>Addresses</h2>
                            {customer.addresses.map((address, index) => (
                                <div key={index} className="address-item">
                                    <MapPin size={16} />
                                    <div>
                                        <p>{address.street}</p>
                                        <p>{address.city}, {address.state} {address.postal_code}</p>
                                        <p>{address.country}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerDetailPage;
