import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Save, Eye, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import './BlogPostEditor.css';

const BlogPostEditor = () => {
    const navigate = useNavigate();
    const { postId } = useParams();
    const [post, setPost] = useState({
        title: '',
        content: '',
        excerpt: '',
        featured_image: '',
        status: 'draft',
        tags: []
    });
    const [saving, setSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        if (postId) {
            fetchPost();
        }
    }, [postId]);

    const fetchPost = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/admin/content/posts/${postId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                setPost(data.data);
            }
        } catch (error) {
            console.error('Error fetching post:', error);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const token = localStorage.getItem('token');
            const url = postId
                ? `${import.meta.env.VITE_API_URL}/api/v1/admin/content/posts/${postId}`
                : `${import.meta.env.VITE_API_URL}/api/v1/admin/content/posts`;

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
                alert('Failed to save post');
            }
        } catch (error) {
            console.error('Error saving post:', error);
            alert('Failed to save post');
        } finally {
            setSaving(false);
        }
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            [{ 'align': [] }],
            ['clean']
        ]
    };

    return (
        <div className="blog-post-editor">
            <div className="editor-header">
                <button className="back-button" onClick={() => navigate('/admin/content')}>
                    <ArrowLeft size={20} />
                    Back to Content
                </button>
                <div className="editor-actions">
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
                        {saving ? 'Saving...' : 'Save Post'}
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
                            onChange={(e) => setPost({ ...post, title: e.target.value })}
                            placeholder="Enter post title..."
                            className="title-input"
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
                        <label>Featured Image URL</label>
                        <div className="image-input-group">
                            <input
                                type="text"
                                value={post.featured_image}
                                onChange={(e) => setPost({ ...post, featured_image: e.target.value })}
                                placeholder="https://example.com/image.jpg"
                                className="image-input"
                            />
                            <button className="btn-secondary">
                                <ImageIcon size={18} />
                                Browse
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Content</label>
                        <ReactQuill
                            theme="snow"
                            value={post.content}
                            onChange={(content) => setPost({ ...post, content })}
                            modules={modules}
                            className="quill-editor"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Status</label>
                            <select
                                value={post.status}
                                onChange={(e) => setPost({ ...post, status: e.target.value })}
                                className="status-select"
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
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
