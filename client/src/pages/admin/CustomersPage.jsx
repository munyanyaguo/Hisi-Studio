import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Mail, Phone, ShoppingBag, Eye } from 'lucide-react';
import './CustomersPage.css';

const CustomersPage = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/admin/customers`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                setCustomers(data.data.customers || []);
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCustomers = customers.filter(customer =>
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${customer.first_name} ${customer.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="customers-page">
            <div className="page-header">
                <div>
                    <h1>Customer Management</h1>
                    <p className="page-subtitle">View and manage customer accounts</p>
                </div>
            </div>

            <div className="filters-section">
                <div className="search-box">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search customers by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading customers...</p>
                </div>
            ) : filteredCustomers.length === 0 ? (
                <div className="empty-state">
                    <Users size={64} className="empty-icon" />
                    <h3>No customers found</h3>
                    <p>No customers match your search criteria.</p>
                </div>
            ) : (
                <div className="customers-grid">
                    {filteredCustomers.map((customer) => (
                        <div key={customer.id} className="customer-card">
                            <div className="customer-avatar">
                                {customer.first_name?.[0] || customer.email?.[0] || 'C'}
                            </div>
                            <div className="customer-info">
                                <h3>{customer.first_name} {customer.last_name}</h3>
                                <div className="customer-details">
                                    <div className="detail-row">
                                        <Mail size={14} />
                                        <span>{customer.email}</span>
                                    </div>
                                    {customer.phone && (
                                        <div className="detail-row">
                                            <Phone size={14} />
                                            <span>{customer.phone}</span>
                                        </div>
                                    )}
                                    <div className="detail-row">
                                        <ShoppingBag size={14} />
                                        <span>{customer.order_count || 0} orders</span>
                                    </div>
                                </div>
                                <div className="customer-meta">
                                    <span className="join-date">
                                        Joined {formatDate(customer.created_at)}
                                    </span>
                                    <span className={`status-badge ${customer.is_active ? 'active' : 'inactive'}`}>
                                        {customer.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                            <button
                                className="view-btn"
                                onClick={() => navigate(`/admin/customers/${customer.id}`)}
                                title="View profile"
                            >
                                <Eye size={18} />
                                View Profile
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomersPage;
