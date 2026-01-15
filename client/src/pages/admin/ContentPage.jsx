import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye, FileText } from 'lucide-react';
import './ContentPage.css';

const ContentPage = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/blog`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                // Handle paginated response structure: { data: { items: [...], pagination: {...} } }
                const items = data.data?.items || data.items || data.data || [];
                // Ensure we always have an array
                setPosts(Array.isArray(items) ? items : []);
            } else {
                setPosts([]);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (postId) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            const token = localStorage.getItem('token');
            await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/blog/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            await fetchPosts();
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No date';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return 'Invalid date';
        }
    };

    return (
        <div className="content-page">
            <div className="page-header">
                <div>
                    <h1>Content Management</h1>
                    <p className="page-subtitle">Manage blog posts and articles</p>
                </div>
                <button
                    className="btn-primary"
                    onClick={() => navigate('/admin/content/new')}
                >
                    <Plus size={18} />
                    New Post
                </button>
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading content...</p>
                </div>
            ) : posts.length === 0 ? (
                <div className="empty-state">
                    <FileText size={64} className="empty-icon" />
                    <h3>No blog posts yet</h3>
                    <p>Create your first blog post to get started</p>
                    <button className="btn-primary" onClick={() => navigate('/admin/content/new')}>
                        <Plus size={18} />
                        Create Post
                    </button>
                </div>
            ) : (
                <div className="posts-grid">
                    {posts.map((post) => (
                        <div key={post.id} className="post-card">
                            {post.featured_image && (
                                <div className="post-image">
                                    <img src={post.featured_image} alt={post.title} />
                                </div>
                            )}
                            <div className="post-content">
                                <h3>{post.title}</h3>
                                <p className="post-excerpt">{post.excerpt || 'No excerpt available'}</p>
                                <div className="post-meta">
                                    <span className="post-date">{formatDate(post.created_at)}</span>
                                    <span className={`post-status ${post.is_published ? 'published' : 'draft'}`}>
                                        {post.is_published ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                            </div>
                            <div className="post-actions">
                                <button
                                    className="action-btn"
                                    onClick={() => navigate(`/admin/content/edit/${post.id}`)}
                                    title="Edit"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    className="action-btn"
                                    onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                                    title="Preview"
                                >
                                    <Eye size={16} />
                                </button>
                                <button
                                    className="action-btn delete"
                                    onClick={() => handleDelete(post.id)}
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ContentPage;
