import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, Edit, Trash2, Package, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './ProductsPage.css';

const ProductsPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);

    const [filters, setFilters] = useState({
        search: '',
        category: 'all',
        sortBy: 'created_at',
        sortOrder: 'desc'
    });

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [filters, pagination.page]);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/products/categories`);
            if (response.ok) {
                const data = await response.json();
                setCategories(data.categories || []);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const params = new URLSearchParams({
                page: pagination.page,
                per_page: pagination.limit,
                sort_by: filters.sortBy,
                sort_order: filters.sortOrder,
                ...(filters.search && { search: filters.search }),
                ...(filters.category !== 'all' && { category: filters.category })
            });

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/products?${params}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                setProducts(data.products || []);
                setPagination(prev => ({
                    ...prev,
                    total: data.pagination.total_items,
                    pages: data.pagination.total_pages
                }));
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchProducts();
            } else {
                alert('Failed to delete product');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Error deleting product');
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES'
        }).format(amount);
    };

    return (
        <div className="products-page">
            <div className="page-header">
                <div>
                    <h1>Products Management</h1>
                    <p className="page-subtitle">View and manage store products</p>
                </div>
                <Link to="/admin/products/new" className="btn-primary">
                    <Plus size={18} />
                    Add Product
                </Link>
            </div>

            <div className="filters-section">
                <div className="search-box">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        className="search-input"
                    />
                </div>

                <div className="filter-group">
                    <select
                        value={filters.category}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                        className="filter-select"
                    >
                        <option value="all">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.slug}>{cat.name}</option>
                        ))}
                    </select>

                    <select
                        value={filters.sortBy}
                        onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                        className="filter-select"
                    >
                        <option value="created_at">Date Created</option>
                        <option value="price">Price</option>
                        <option value="name">Name</option>
                    </select>

                    <select
                        value={filters.sortOrder}
                        onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value })}
                        className="filter-select"
                    >
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading products...</p>
                </div>
            ) : products.length === 0 ? (
                <div className="empty-state">
                    <Package size={64} className="empty-icon" />
                    <h3>No products found</h3>
                    <p>Get started by adding your first product.</p>
                </div>
            ) : (
                <>
                    <div className="products-table-container">
                        <table className="products-table">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Product Name</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td className="product-image-cell">
                                            {product.main_image ? (
                                                <img src={product.main_image} alt={product.name} />
                                            ) : (
                                                <div className="product-image-placeholder">
                                                    <ImageIcon size={20} />
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <div className="product-name">{product.name}</div>
                                            <div className="product-category">SKU: {product.sku}</div>
                                        </td>
                                        <td>{product.category?.name || 'Uncategorized'}</td>
                                        <td className="product-price">{formatCurrency(product.price)}</td>
                                        <td>
                                            <span className={
                                                product.stock_quantity === 0 ? 'stock-out' :
                                                    product.stock_quantity < 10 ? 'stock-low' : ''
                                            }>
                                                {product.stock_quantity}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${product.is_active ? 'status-active' : 'status-inactive'}`}>
                                                {product.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="actions-cell">
                                                <button
                                                    className="btn-icon"
                                                    onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                                                    title="Edit product"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    className="btn-icon delete"
                                                    onClick={() => handleDelete(product.id)}
                                                    title="Delete product"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
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
                            Page {pagination.page} of {pagination.pages}
                        </span>
                        <button
                            className="pagination-btn"
                            disabled={pagination.page >= pagination.pages}
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

export default ProductsPage;
