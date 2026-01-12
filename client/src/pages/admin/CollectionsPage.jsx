import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';
import './CollectionsPage.css';

const CollectionsPage = () => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCollection, setEditingCollection] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        image_url: ''
    });

    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/admin/collections`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                setCollections(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching collections:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            const url = editingCollection
                ? `${import.meta.env.VITE_API_URL}/api/v1/admin/collections/${editingCollection.id}`
                : `${import.meta.env.VITE_API_URL}/api/v1/admin/collections`;

            const response = await fetch(url, {
                method: editingCollection ? 'PUT' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                await fetchCollections();
                closeModal();
            } else {
                alert('Failed to save collection');
            }
        } catch (error) {
            console.error('Error saving collection:', error);
            alert('Failed to save collection');
        }
    };

    const handleDelete = async (collectionId) => {
        if (!confirm('Are you sure you want to delete this collection?')) return;

        try {
            const token = localStorage.getItem('token');
            await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/admin/collections/${collectionId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            await fetchCollections();
        } catch (error) {
            console.error('Error deleting collection:', error);
        }
    };

    const openModal = (collection = null) => {
        if (collection) {
            setEditingCollection(collection);
            setFormData({
                name: collection.name,
                slug: collection.slug,
                description: collection.description || '',
                image_url: collection.image_url || ''
            });
        } else {
            setEditingCollection(null);
            setFormData({
                name: '',
                slug: '',
                description: '',
                image_url: ''
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingCollection(null);
        setFormData({
            name: '',
            slug: '',
            description: '',
            image_url: ''
        });
    };

    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    return (
        <div className="collections-page">
            <div className="page-header">
                <div>
                    <h1>Product Collections</h1>
                    <p className="page-subtitle">Organize products into collections</p>
                </div>
                <button className="btn-primary" onClick={() => openModal()}>
                    <Plus size={18} />
                    New Collection
                </button>
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading collections...</p>
                </div>
            ) : collections.length === 0 ? (
                <div className="empty-state">
                    <Package size={64} className="empty-icon" />
                    <h3>No collections yet</h3>
                    <p>Create your first collection to organize products</p>
                    <button className="btn-primary" onClick={() => openModal()}>
                        <Plus size={18} />
                        Create Collection
                    </button>
                </div>
            ) : (
                <div className="collections-grid">
                    {collections.map((collection) => (
                        <div key={collection.id} className="collection-card">
                            <div className="collection-image">
                                {collection.image_url ? (
                                    <img src={collection.image_url} alt={collection.name} />
                                ) : (
                                    <div className="image-placeholder">
                                        <Package size={48} />
                                    </div>
                                )}
                            </div>
                            <div className="collection-info">
                                <h3>{collection.name}</h3>
                                {collection.description && (
                                    <p className="collection-description">{collection.description}</p>
                                )}
                                <div className="collection-meta">
                                    <span className="product-count">
                                        {collection.product_count || 0} products
                                    </span>
                                    <span className="collection-slug">/{collection.slug}</span>
                                </div>
                            </div>
                            <div className="collection-actions">
                                <button
                                    className="action-btn"
                                    onClick={() => openModal(collection)}
                                    title="Edit"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    className="action-btn delete"
                                    onClick={() => handleDelete(collection.id)}
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{editingCollection ? 'Edit Collection' : 'New Collection'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Collection Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => {
                                        const name = e.target.value;
                                        setFormData({
                                            ...formData,
                                            name,
                                            slug: generateSlug(name)
                                        });
                                    }}
                                    required
                                    placeholder="e.g., Summer Collection"
                                />
                            </div>

                            <div className="form-group">
                                <label>Slug *</label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    required
                                    placeholder="summer-collection"
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    placeholder="Brief description of the collection..."
                                />
                            </div>

                            <div className="form-group">
                                <label>Image URL</label>
                                <input
                                    type="text"
                                    value={formData.image_url}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    {editingCollection ? 'Update' : 'Create'} Collection
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CollectionsPage;
