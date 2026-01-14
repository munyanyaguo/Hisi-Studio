import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Upload, Image as ImageIcon, X } from 'lucide-react';
import './ProductEditor.css';

const ProductEditor = () => {
    const { id } = useParams(); // If id exists, it's edit mode
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(isEditMode);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState({ main: false, hover: false });
    const [dragOver, setDragOver] = useState({ main: false, hover: false });

    const mainImageRef = useRef(null);
    const hoverImageRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        sku: '',
        price: '',
        original_price: '',
        stock_quantity: 0,
        description: '',
        short_description: '',
        category_id: '',
        brand: '',
        gender: 'unisex',
        main_image: '',
        hover_image: '',
        images: [],
        badge: '',
        is_featured: false,
        is_active: true,
        accessibility_features: {}
    });

    useEffect(() => {
        fetchCategories();
        if (isEditMode) {
            fetchProduct();
        }
    }, [id]);

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

    const fetchProduct = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/products/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                const product = data.product;
                setFormData({
                    name: product.name || '',
                    slug: product.slug || '',
                    sku: product.sku || '',
                    price: product.price || '',
                    original_price: product.original_price || '',
                    stock_quantity: product.stock_quantity || 0,
                    description: product.description || '',
                    short_description: product.short_description || '',
                    category_id: product.category_id || '',
                    brand: product.brand || '',
                    gender: product.gender || 'unisex',
                    main_image: product.main_image || '',
                    hover_image: product.hover_image || '',
                    images: product.images || [],
                    badge: product.badge || '',
                    is_featured: product.is_featured || false,
                    is_active: product.is_active !== undefined ? product.is_active : true,
                    accessibility_features: product.accessibility_features || {}
                });
            } else {
                setError('Failed to load product');
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            setError('Error loading product');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Auto-generate slug from name if creating new product and slug is untouched
        if (name === 'name' && !isEditMode && !formData.slug) {
            const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            setFormData(prev => ({ ...prev, slug: slug }));
        }
    };

    // File upload handler
    const handleFileUpload = useCallback(async (file, imageType) => {
        if (!file || !file.type.startsWith('image/')) {
            setError('Please select a valid image file');
            return;
        }

        setUploading(prev => ({ ...prev, [imageType]: true }));
        setError('');

        try {
            const token = localStorage.getItem('token');
            const formDataUpload = new FormData();
            formDataUpload.append('file', file);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/media`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataUpload
            });

            if (response.ok) {
                const data = await response.json();
                const imageUrl = data.data?.url || data.url || data.file_url;

                if (imageUrl) {
                    setFormData(prev => ({
                        ...prev,
                        [imageType === 'main' ? 'main_image' : 'hover_image']: imageUrl
                    }));
                } else {
                    setError('Upload succeeded but no URL returned');
                }
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to upload image');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            setError('Error uploading image');
        } finally {
            setUploading(prev => ({ ...prev, [imageType]: false }));
        }
    }, []);

    // Handle file input change
    const handleFileChange = (e, imageType) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(file, imageType);
        }
    };

    // Handle drag and drop
    const handleDragOver = (e, imageType) => {
        e.preventDefault();
        setDragOver(prev => ({ ...prev, [imageType]: true }));
    };

    const handleDragLeave = (e, imageType) => {
        e.preventDefault();
        setDragOver(prev => ({ ...prev, [imageType]: false }));
    };

    const handleDrop = (e, imageType) => {
        e.preventDefault();
        setDragOver(prev => ({ ...prev, [imageType]: false }));

        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleFileUpload(file, imageType);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const url = isEditMode
                ? `${import.meta.env.VITE_API_URL}/api/v1/products/${id}`
                : `${import.meta.env.VITE_API_URL}/api/v1/products`;

            const method = isEditMode ? 'PUT' : 'POST';

            // Clean data
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                stock_quantity: parseInt(formData.stock_quantity) || 0,
                original_price: formData.original_price ? parseFloat(formData.original_price) : null
            };

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                navigate('/admin/products');
            } else {
                setError(data.error || 'Failed to save product');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            setError('Error saving product');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading product...</p>
            </div>
        );
    }

    // Image Upload Zone Component
    const ImageUploadZone = ({ imageType, label, currentImage }) => (
        <div className="form-group">
            <label>{label}</label>
            <div
                className={`image-upload-zone ${dragOver[imageType] ? 'drag-over' : ''} ${uploading[imageType] ? 'uploading' : ''}`}
                onDragOver={(e) => handleDragOver(e, imageType)}
                onDragLeave={(e) => handleDragLeave(e, imageType)}
                onDrop={(e) => handleDrop(e, imageType)}
                onClick={() => imageType === 'main' ? mainImageRef.current?.click() : hoverImageRef.current?.click()}
            >
                {uploading[imageType] ? (
                    <div className="upload-loading">
                        <div className="spinner-small"></div>
                        <span>Uploading...</span>
                    </div>
                ) : currentImage ? (
                    <div className="upload-preview">
                        <img src={currentImage} alt={label} onError={(e) => e.target.style.display = 'none'} />
                        <button
                            type="button"
                            className="remove-image"
                            onClick={(e) => {
                                e.stopPropagation();
                                setFormData(prev => ({
                                    ...prev,
                                    [imageType === 'main' ? 'main_image' : 'hover_image']: ''
                                }));
                            }}
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <div className="upload-placeholder">
                        <Upload size={32} />
                        <span>Drag & drop an image here</span>
                        <span className="upload-hint">or click to browse</span>
                    </div>
                )}
            </div>
            <input
                type="file"
                ref={imageType === 'main' ? mainImageRef : hoverImageRef}
                accept="image/*"
                onChange={(e) => handleFileChange(e, imageType)}
                style={{ display: 'none' }}
            />
            <div className="url-input-wrapper">
                <span className="or-divider">or enter URL:</span>
                <input
                    type="text"
                    name={imageType === 'main' ? 'main_image' : 'hover_image'}
                    value={currentImage}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="https://..."
                />
            </div>
        </div>
    );

    return (
        <div className="product-editor">
            <div className="editor-header">
                <div>
                    <Link to="/admin/products" className="btn-back">
                        <ArrowLeft size={16} />
                        Back to Products
                    </Link>
                    <h1>{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
                </div>
            </div>

            {error && (
                <div className="message error" style={{ marginBottom: '1rem' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="editor-form">
                <div className="main-content">
                    {/* Basic Information */}
                    <div className="form-section">
                        <h3>Basic Information</h3>
                        <div className="form-group">
                            <label htmlFor="name">Product Name *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="form-textarea"
                            />
                        </div>
                    </div>

                    {/* Media - With Drag & Drop */}
                    <div className="form-section">
                        <h3>Media</h3>
                        <ImageUploadZone
                            imageType="main"
                            label="Main Image *"
                            currentImage={formData.main_image}
                        />
                        <ImageUploadZone
                            imageType="hover"
                            label="Hover Image (Optional)"
                            currentImage={formData.hover_image}
                        />
                    </div>

                    {/* Pricing & Inventory */}
                    <div className="form-section">
                        <h3>Pricing & Inventory</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="price">Price (KES) *</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="original_price">Original Price (for Sale)</label>
                                <input
                                    type="number"
                                    id="original_price"
                                    name="original_price"
                                    value={formData.original_price}
                                    onChange={handleChange}
                                    className="form-input"
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="sku">SKU *</label>
                                <input
                                    type="text"
                                    id="sku"
                                    name="sku"
                                    value={formData.sku}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="stock_quantity">Stock Quantity</label>
                                <input
                                    type="number"
                                    id="stock_quantity"
                                    name="stock_quantity"
                                    value={formData.stock_quantity}
                                    onChange={handleChange}
                                    className="form-input"
                                    min="0"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="sidebar-content">
                    {/* Organization */}
                    <div className="form-section">
                        <h3>Organization</h3>
                        <div className="form-group">
                            <label htmlFor="category_id">Category</label>
                            <select
                                id="category_id"
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="brand">Brand</label>
                            <input
                                type="text"
                                id="brand"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="gender">Gender</label>
                            <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="unisex">Unisex</option>
                                <option value="men">Men</option>
                                <option value="women">Women</option>
                                <option value="kids">Kids</option>
                            </select>
                        </div>
                    </div>

                    {/* Settings */}
                    <div className="form-section">
                        <h3>Settings</h3>
                        <div className="checkbox-group">
                            <input
                                type="checkbox"
                                id="is_active"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleChange}
                            />
                            <label htmlFor="is_active">Active (Visible)</label>
                        </div>
                        <div className="checkbox-group">
                            <input
                                type="checkbox"
                                id="is_featured"
                                name="is_featured"
                                checked={formData.is_featured}
                                onChange={handleChange}
                            />
                            <label htmlFor="is_featured">Featured Product</label>
                        </div>
                        <div className="form-group">
                            <label htmlFor="slug">URL Slug *</label>
                            <input
                                type="text"
                                id="slug"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                            <small className="helper-text">Unique ID for the URL</small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="badge">Badge Label</label>
                            <input
                                type="text"
                                id="badge"
                                name="badge"
                                value={formData.badge}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="e.g. New, Bestseller"
                            />
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/admin/products')} className="btn-cancel" disabled={saving}>
                        Cancel
                    </button>
                    <button type="submit" className="btn-save" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductEditor;
