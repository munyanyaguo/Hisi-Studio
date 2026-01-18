import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Eye, ArrowLeft, Image as ImageIcon, Star, Upload, X } from 'lucide-react';
import './BlogPostEditor.css';

const BlogPostEditor = () => {
    const navigate = useNavigate();
    const { postId } = useParams();
    const fileInputRef = useRef(null);
    const [post, setPost] = useState({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        featured_image: '',
        category: '',
        is_featured: false,
        read_time: '',
        is_published: false,
        tags: []
    });
    const [categories, setCategories] = useState([]);
    const [saving, setSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/v1/blog/categories`
                );
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data.data || []);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (postId) {
            fetchPost();
        }
    }, [postId]);

    const fetchPost = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/admin/blog/${postId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                setPost(data.data);
            } else {
                alert('Failed to load post');
                navigate('/admin/content');
            }
        } catch (error) {
            console.error('Error fetching post:', error);
            alert('Failed to load post');
            navigate('/admin/content');
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    const handleTitleChange = (e) => {
        const title = e.target.value;
        setPost({
            ...post,
            title,
            slug: generateSlug(title)
        });
    };

    const handleImageUpload = async (file) => {
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert('Please upload an image file (JPEG, PNG, GIF, or WebP)');
            return;
        }

        setUploading(true);
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/admin/media/upload`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                }
            );

            if (response.ok) {
                const data = await response.json();
                setPost({ ...post, featured_image: data.data.url || data.data.file_path });
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to upload image');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleImageUpload(file);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        handleImageUpload(file);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const token = localStorage.getItem('token');
            const url = postId
                ? `${import.meta.env.VITE_API_URL}/api/v1/admin/blog/${postId}`
                : `${import.meta.env.VITE_API_URL}/api/v1/admin/blog`;

            const response = await fetch(url, {
                method: postId ? 'PUT' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(post)
            });

            if (response.ok) {
                navigate('/admin/content');
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to save post');
            }
        } catch (error) {
            console.error('Error saving post:', error);
            alert('Failed to save post');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;

        try {
            setDeleting(true);
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/admin/blog/${postId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                navigate('/admin/content');
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to delete post');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete post');
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="blog-post-editor">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading post...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="blog-post-editor">
            <div className="editor-header">
                <div className="header-left">
                    <button className="back-button" onClick={() => navigate('/admin/content')}>
                        <ArrowLeft size={20} />
                        Back to Content
                    </button>
                    <h1 className="editor-title">{postId ? 'Edit Post' : 'Create New Post'}</h1>
                </div>
                <div className="editor-actions">
                    {postId && (
                        <button
                            className="btn-danger"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting ? 'Deleting...' : 'Delete'}
                        </button>
                    )}
                    <button
                        className="btn-secondary"
                        onClick={() => setShowPreview(!showPreview)}
                    >
                        <Eye size={18} />
                        {showPreview ? 'Edit' : 'Preview'}
                    </button>
                    <button
                        className="btn-primary"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        <Save size={18} />
                        {saving ? 'Saving...' : (postId ? 'Update Post' : 'Publish Post')}
                    </button>
                </div>
            </div>

            {!showPreview ? (
                <div className="editor-content">
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            value={post.title}
                            onChange={handleTitleChange}
                            placeholder="Enter post title..."
                            className="title-input"
                        />
                    </div>

                    <div className="form-group">
                        <label>Slug <span className="slug-hint">(auto-generated from title)</span></label>
                        <input
                            type="text"
                            value={post.slug}
                            readOnly
                            className="slug-input readonly"
                        />
                    </div>

                    <div className="form-group">
                        <label>Excerpt</label>
                        <textarea
                            value={post.excerpt}
                            onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
                            placeholder="Brief description of the post..."
                            rows={3}
                            className="excerpt-input"
                        />
                    </div>

                    <div className="form-group">
                        <label>Featured Image</label>

                        {/* Image Preview */}
                        {post.featured_image && (
                            <div className="image-preview">
                                <img
                                    src={post.featured_image}
                                    alt="Featured preview"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                                <button
                                    className="remove-image-btn"
                                    onClick={() => setPost({ ...post, featured_image: '' })}
                                    title="Remove image"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}

                        {/* Drag and Drop Zone */}
                        <div
                            className={`image-upload-zone ${isDragging ? 'dragging' : ''} ${uploading ? 'uploading' : ''}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                accept="image/jpeg,image/png,image/gif,image/webp"
                                style={{ display: 'none' }}
                            />
                            {uploading ? (
                                <div className="upload-loading">
                                    <div className="spinner"></div>
                                    <span>Uploading...</span>
                                </div>
                            ) : (
                                <>
                                    <Upload size={32} />
                                    <p className="upload-text">
                                        <strong>Click to upload</strong> or drag and drop
                                    </p>
                                    <p className="upload-hint">PNG, JPG, GIF or WebP (max 5MB)</p>
                                </>
                            )}
                        </div>

                        {/* URL Input */}
                        <div className="image-url-section">
                            <span className="or-divider">or enter URL</span>
                            <input
                                type="text"
                                value={post.featured_image || ''}
                                onChange={(e) => setPost({ ...post, featured_image: e.target.value })}
                                placeholder="https://example.com/image.jpg"
                                className="image-input"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Content (HTML supported)</label>
                        <textarea
                            value={post.content || ''}
                            onChange={(e) => setPost({ ...post, content: e.target.value })}
                            placeholder="Enter your blog post content here. You can use HTML tags like <h2>, <p>, <ul>, <li>, <strong>, etc."
                            rows={15}
                            className="content-textarea"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Category</label>
                            <select
                                value={post.category || ''}
                                onChange={(e) => setPost({ ...post, category: e.target.value })}
                                className="category-select"
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.slug}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Read Time</label>
                            <input
                                type="text"
                                value={post.read_time || ''}
                                onChange={(e) => setPost({ ...post, read_time: e.target.value })}
                                placeholder="5 min read"
                                className="read-time-input"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Status</label>
                            <select
                                value={post.is_published ? 'published' : 'draft'}
                                onChange={(e) => setPost({ ...post, is_published: e.target.value === 'published' })}
                                className="status-select"
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </div>

                        <div className="form-group checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={post.is_featured || false}
                                    onChange={(e) => setPost({ ...post, is_featured: e.target.checked })}
                                />
                                <Star size={18} />
                                <span>Featured Post</span>
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Tags (comma separated)</label>
                        <input
                            type="text"
                            value={post.tags?.join(', ') || ''}
                            onChange={(e) => setPost({
                                ...post,
                                tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                            })}
                            placeholder="fashion, style, trends"
                            className="tags-input"
                        />
                    </div>
                </div>
            ) : (
                <div className="preview-content">
                    <div className="preview-header">
                        <h1>{post.title || 'Untitled Post'}</h1>
                        {post.excerpt && <p className="preview-excerpt">{post.excerpt}</p>}
                    </div>
                    {post.featured_image && (
                        <img
                            src={post.featured_image}
                            alt={post.title}
                            className="preview-image"
                        />
                    )}
                    <div
                        className="preview-body"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                    {post.tags && post.tags.length > 0 && (
                        <div className="preview-tags">
                            {post.tags.map((tag, index) => (
                                <span key={index} className="tag">{tag}</span>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BlogPostEditor;
