import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Download, Eye, Package } from 'lucide-react';
import './OrdersPage.css';

const OrdersPage = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: 'all',
        search: '',
        dateFrom: '',
        dateTo: ''
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0
    });

    useEffect(() => {
        fetchOrders();
    }, [filters, pagination.page]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const params = new URLSearchParams({
                page: pagination.page,
                limit: pagination.limit,
                ...(filters.status !== 'all' && { status: filters.status }),
                ...(filters.search && { search: filters.search }),
                ...(filters.dateFrom && { date_from: filters.dateFrom }),
                ...(filters.dateTo && { date_to: filters.dateTo })
            });

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/orders?${params}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                setOrders(data.data.orders || []);
                setPagination(prev => ({
                    ...prev,
                    total: data.data.total || 0
                }));
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { label: 'Pending', className: 'status-pending' },
            processing: { label: 'Processing', className: 'status-processing' },
            shipped: { label: 'Shipped', className: 'status-shipped' },
            delivered: { label: 'Delivered', className: 'status-delivered' },
            cancelled: { label: 'Cancelled', className: 'status-cancelled' }
        };

        const config = statusConfig[status] || statusConfig.pending;
        return <span className={`status-badge ${config.className}`}>{config.label}</span>;
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
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleExport = () => {
        // TODO: Implement export functionality
        console.log('Export orders');
    };

    return (
        <div className="orders-page">
            <div className="page-header">
                <div>
                    <h1>Orders Management</h1>
                    <p className="page-subtitle">View and manage all customer orders</p>
                </div>
                <button className="btn-primary" onClick={handleExport}>
                    <Download size={18} />
                    Export Orders
                </button>
            </div>

            <div className="filters-section">
                <div className="search-box">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by order ID, customer name, or email..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        className="search-input"
                    />
                </div>

                <div className="filter-group">
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="filter-select"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>

                    <input
                        type="date"
                        value={filters.dateFrom}
                        onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                        className="filter-input"
                        placeholder="From date"
                    />

                    <input
                        type="date"
                        value={filters.dateTo}
                        onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                        className="filter-input"
                        placeholder="To date"
                    />
                </div>
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading orders...</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="empty-state">
                    <Package size={64} className="empty-icon" />
                    <h3>No orders found</h3>
                    <p>There are no orders matching your filters.</p>
                </div>
            ) : (
                <>
                    <div className="orders-table-container">
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Date</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="order-id">#{order.id.slice(0, 8)}</td>
                                        <td>
                                            <div className="customer-info">
                                                <span className="customer-name">
                                                    {order.user?.first_name} {order.user?.last_name}
                                                </span>
                                                <span className="customer-email">{order.user?.email}</span>
                                            </div>
                                        </td>
                                        <td>{formatDate(order.created_at)}</td>
                                        <td>{order.items?.length || 0} items</td>
                                        <td className="order-total">{formatCurrency(order.total_amount)}</td>
                                        <td>{getStatusBadge(order.status)}</td>
                                        <td>
                                            <button
                                                className="btn-icon"
                                                onClick={() => navigate(`/admin/orders/${order.id}`)}
                                                title="View details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination">
                        <button
                            className="pagination-btn"
                            disabled={pagination.page === 1}
                            onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                        >
                            Previous
                        </button>
                        <span className="pagination-info">
                            Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
                        </span>
                        <button
                            className="pagination-btn"
                            disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                            onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default OrdersPage;
