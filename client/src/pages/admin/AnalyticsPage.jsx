import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, ShoppingBag, DollarSign, Download } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DateRangePicker from '../../components/admin/dashboard/DateRangePicker';
import './AnalyticsPage.css';

const AnalyticsPage = () => {
    const [period, setPeriod] = useState('month');
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState({
        salesData: [],
        customerData: [],
        productData: [],
        categoryData: [],
        summary: {}
    });

    useEffect(() => {
        fetchAnalytics();
    }, [period]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/admin/analytics?period=${period}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                setAnalytics(data.data);
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async (type) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/admin/analytics/export?period=${period}&format=${type}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `analytics-${period}.${type}`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        } catch (error) {
            console.error('Error exporting analytics:', error);
        }
    };

    const COLORS = ['#667eea', '#764ba2', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 0
        }).format(value);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading analytics...</p>
            </div>
        );
    }

    return (
        <div className="analytics-page">
            <div className="page-header">
                <div>
                    <h1>Analytics & Reports</h1>
                    <p className="page-subtitle">Comprehensive business insights and metrics</p>
                </div>
                <div className="header-actions">
                    <DateRangePicker value={period} onChange={setPeriod} />
                    <div className="export-dropdown">
                        <button className="btn-secondary">
                            <Download size={18} />
                            Export
                        </button>
                        <div className="export-menu">
                            <button onClick={() => handleExport('csv')}>Export as CSV</button>
                            <button onClick={() => handleExport('pdf')}>Export as PDF</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="summary-grid">
                <div className="summary-card">
                    <div className="summary-icon revenue">
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <h3>Total Revenue</h3>
                        <p className="summary-value">{formatCurrency(analytics.summary.totalRevenue || 0)}</p>
                        <span className="summary-change positive">+{analytics.summary.revenueGrowth || 0}%</span>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-icon orders">
                        <ShoppingBag size={24} />
                    </div>
                    <div>
                        <h3>Total Orders</h3>
                        <p className="summary-value">{analytics.summary.totalOrders || 0}</p>
                        <span className="summary-change positive">+{analytics.summary.ordersGrowth || 0}%</span>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-icon customers">
                        <Users size={24} />
                    </div>
                    <div>
                        <h3>New Customers</h3>
                        <p className="summary-value">{analytics.summary.newCustomers || 0}</p>
                        <span className="summary-change positive">+{analytics.summary.customersGrowth || 0}%</span>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-icon average">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <h3>Average Order Value</h3>
                        <p className="summary-value">{formatCurrency(analytics.summary.avgOrderValue || 0)}</p>
                        <span className="summary-change positive">+{analytics.summary.aovGrowth || 0}%</span>
                    </div>
                </div>
            </div>

            {/* Sales Chart */}
            <div className="chart-section">
                <div className="chart-header">
                    <h2>Sales Trend</h2>
                    <p>Revenue and orders over time</p>
                </div>
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={analytics.salesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="date" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip
                            contentStyle={{
                                background: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#667eea"
                            strokeWidth={3}
                            dot={{ fill: '#667eea', r: 4 }}
                            activeDot={{ r: 6 }}
                            name="Revenue (KES)"
                        />
                        <Line
                            type="monotone"
                            dataKey="orders"
                            stroke="#10b981"
                            strokeWidth={3}
                            dot={{ fill: '#10b981', r: 4 }}
                            activeDot={{ r: 6 }}
                            name="Orders"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="charts-row">
                {/* Customer Analytics */}
                <div className="chart-section half">
                    <div className="chart-header">
                        <h2>Customer Growth</h2>
                        <p>New vs returning customers</p>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analytics.customerData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="date" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                                contentStyle={{
                                    background: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px'
                                }}
                            />
                            <Legend />
                            <Bar dataKey="new" fill="#667eea" name="New Customers" radius={[8, 8, 0, 0]} />
                            <Bar dataKey="returning" fill="#764ba2" name="Returning" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Product Performance */}
                <div className="chart-section half">
                    <div className="chart-header">
                        <h2>Top Products</h2>
                        <p>Best selling products by revenue</p>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={analytics.productData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {analytics.productData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => formatCurrency(value)} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Product Performance Table */}
            <div className="chart-section">
                <div className="chart-header">
                    <h2>Product Performance Details</h2>
                    <p>Detailed metrics for top products</p>
                </div>
                <div className="performance-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Units Sold</th>
                                <th>Revenue</th>
                                <th>Avg Price</th>
                                <th>Growth</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analytics.productData.map((product, index) => (
                                <tr key={index}>
                                    <td className="product-name">{product.name}</td>
                                    <td>{product.units || 0}</td>
                                    <td className="revenue">{formatCurrency(product.value)}</td>
                                    <td>{formatCurrency(product.avgPrice || 0)}</td>
                                    <td>
                                        <span className={`growth ${product.growth >= 0 ? 'positive' : 'negative'}`}>
                                            {product.growth >= 0 ? '+' : ''}{product.growth || 0}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
