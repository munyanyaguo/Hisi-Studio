import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import MetricCard from '../../components/admin/dashboard/MetricCard';
import DateRangePicker from '../../components/admin/dashboard/DateRangePicker';
import {
    DollarSign,
    ShoppingCart,
    Users,
    Package,
    MessageSquare,
    AlertTriangle
} from 'lucide-react';
import './DashboardPage.css';

const DashboardPage = () => {
    const { user } = useAuth();
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('today');

    const isSuperAdmin = user?.role === 'super_admin';

    useEffect(() => {
        fetchDashboardData();
    }, [period]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/admin/dashboard/overview?period=${period}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                setMetrics(data.data.metrics);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined) return 'N/A';
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES'
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div>
                    <h1>Dashboard Overview</h1>
                    <p className="dashboard-subtitle">
                        Welcome back, {user?.first_name || 'Admin'}!
                    </p>
                </div>

                <DateRangePicker
                    value={period}
                    onChange={setPeriod}
                />
            </div>

            <div className="metrics-grid">
                {isSuperAdmin && (
                    <>
                        <MetricCard
                            title="Total Revenue"
                            value={formatCurrency(metrics?.total_revenue)}
                            icon={DollarSign}
                            trend={null}
                            color="green"
                        />

                        <MetricCard
                            title="Total Orders"
                            value={metrics?.total_orders || 0}
                            icon={ShoppingCart}
                            trend={null}
                            color="blue"
                        />

                        <MetricCard
                            title="New Customers"
                            value={metrics?.new_customers || 0}
                            icon={Users}
                            trend={null}
                            color="purple"
                        />

                        <MetricCard
                            title="Pending Orders"
                            value={metrics?.pending_orders || 0}
                            icon={Package}
                            trend={null}
                            color="orange"
                        />
                    </>
                )}

                <MetricCard
                    title="New Inquiries"
                    value={metrics?.new_inquiries || 0}
                    icon={MessageSquare}
                    trend={null}
                    color="indigo"
                />

                <MetricCard
                    title="Total Products"
                    value={metrics?.total_products || 0}
                    icon={Package}
                    trend={null}
                    color="teal"
                />

                {(isSuperAdmin || user?.permissions?.includes('manage_products')) && (
                    <MetricCard
                        title="Low Stock Items"
                        value={metrics?.low_stock_count || 0}
                        icon={AlertTriangle}
                        trend={null}
                        color="red"
                    />
                )}
            </div>

            {!isSuperAdmin && (
                <div className="info-banner">
                    <p>
                        <strong>Content Manager View:</strong> You have access to content management,
                        media library, and inquiry management. Financial data and customer information
                        are restricted to Super Admins.
                    </p>
                </div>
            )}

            <div className="dashboard-sections">
                {isSuperAdmin && (
                    <div className="dashboard-section">
                        <h2>Recent Activity</h2>
                        <p className="coming-soon">Charts and analytics coming soon...</p>
                    </div>
                )}

                <div className="dashboard-section">
                    <h2>Quick Actions</h2>
                    <div className="quick-actions">
                        <a href="/admin/content" className="quick-action-card">
                            <span className="action-icon">📝</span>
                            <span>Create Blog Post</span>
                        </a>
                        <a href="/admin/media" className="quick-action-card">
                            <span className="action-icon">🖼️</span>
                            <span>Upload Media</span>
                        </a>
                        <a href="/admin/inquiries" className="quick-action-card">
                            <span className="action-icon">💬</span>
                            <span>View Inquiries</span>
                        </a>
                        {isSuperAdmin && (
                            <a href="/admin/orders" className="quick-action-card">
                                <span className="action-icon">📦</span>
                                <span>Manage Orders</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
