import React, { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Video, Search, Trash2, Edit2 } from 'lucide-react';
import ImageEditor from '../../components/admin/media/ImageEditor';
import VideoUploader from '../../components/admin/media/VideoUploader';
import './MediaPage.css';

const MediaPage = () => {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [filter, setFilter] = useState('all'); // all, image, video
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [editingImage, setEditingImage] = useState(null);
    const [showVideoUploader, setShowVideoUploader] = useState(false);

    useEffect(() => {
        fetchMedia();
    }, [filter]);

    const fetchMedia = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const params = new URLSearchParams({
                ...(filter !== 'all' && { type: filter })
            });

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/admin/media?${params}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                setMedia(data.data.media || []);
            }
        } catch (error) {
            console.error('Error fetching media:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (event) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        try {
            setUploading(true);
            const token = localStorage.getItem('token');

            for (const file of files) {
                const formData = new FormData();
                formData.append('file', file);

                await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/media/upload`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });
            }

            await fetchMedia();
        } catch (error) {
            console.error('Error uploading files:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (mediaId) => {
        if (!confirm('Are you sure you want to delete this media file?')) return;

        try {
            const token = localStorage.getItem('token');
            await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/media/${mediaId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            await fetchMedia();
        } catch (error) {
            console.error('Error deleting media:', error);
        }
    };

    const filteredMedia = media.filter(item =>
        item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.alt_text?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatFileSize = (bytes) => {
        if (!bytes) return 'N/A';
        const kb = bytes / 1024;
        if (kb < 1024) return `${kb.toFixed(1)} KB`;
        return `${(kb / 1024).toFixed(1)} MB`;
    };

    return (
        <div className="media-page">
            <div className="page-header">
                <div>
                    <h1>Media Library</h1>
                    <p className="page-subtitle">Upload and manage your media files</p>
                </div>
            </div>

            <div className="media-toolbar">
                <div className="upload-section">
                    <label htmlFor="file-upload" className="upload-button">
                        <Upload size={18} />
                        {uploading ? 'Uploading...' : 'Upload Files'}
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        style={{ display: 'none' }}
                    />
                </div>

                <div className="upload-section">
                    <button
                        className="upload-button video-btn"
                        onClick={() => setShowVideoUploader(true)}
                    >
                        <Video size={18} />
                        Upload Video
                    </button>
                </div>

                <div className="media-filters">
                    <div className="search-box">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search media..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <div className="filter-tabs">
                        <button
                            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => setFilter('all')}
                        >
                            All
                        </button>
                        <button
                            className={`filter-tab ${filter === 'image' ? 'active' : ''}`}
                            onClick={() => setFilter('image')}
                        >
                            Images
                        </button>
                        <button
                            className={`filter-tab ${filter === 'video' ? 'active' : ''}`}
                            onClick={() => setFilter('video')}
                        >
                            Videos
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading media...</p>
                </div>
            ) : filteredMedia.length === 0 ? (
                <div className="empty-state">
                    <ImageIcon size={64} className="empty-icon" />
                    <h3>No media files</h3>
                    <p>Upload your first image or video to get started</p>
                </div>
            ) : (
                <div className="media-grid">
                    {filteredMedia.map((item) => (
                        <div key={item.id} className="media-card">
                            <div className="media-preview">
                                {item.file_type === 'image' ? (
                                    <img src={item.url} alt={item.alt_text || item.filename} />
                                ) : (
                                    <div className="video-placeholder">
                                        <Video size={48} />
                                    </div>
                                )}
                            </div>

                            <div className="media-info">
                                <h3 className="media-filename">{item.filename}</h3>
                                <div className="media-meta">
                                    <span className="media-type">{item.file_type}</span>
                                    <span className="media-size">{formatFileSize(item.file_size)}</span>
                                </div>
                            </div>

                            <div className="media-actions">
                                {item.file_type === 'image' && (
                                    <button
                                        className="action-btn"
                                        onClick={() => setEditingImage(item)}
                                        title="Edit image"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                )}
                                <button
                                    className="action-btn"
                                    onClick={() => setSelectedFile(item)}
                                    title="View details"
                                >
                                    <ImageIcon size={16} />
                                </button>
                                <button
                                    className="action-btn delete"
                                    onClick={() => handleDelete(item.id)}
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedFile && (
                <div className="modal-overlay" onClick={() => setSelectedFile(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Media Details</h2>
                        <div className="modal-preview">
                            {selectedFile.file_type === 'image' ? (
                                <img src={selectedFile.url} alt={selectedFile.alt_text} />
                            ) : (
                                <div className="video-placeholder">
                                    <Video size={64} />
                                </div>
                            )}
                        </div>
                        <div className="modal-info">
                            <div className="info-row">
                                <label>Filename:</label>
                                <span>{selectedFile.filename}</span>
                            </div>
                            <div className="info-row">
                                <label>Type:</label>
                                <span>{selectedFile.file_type}</span>
                            </div>
                            <div className="info-row">
                                <label>Size:</label>
                                <span>{formatFileSize(selectedFile.file_size)}</span>
                            </div>
                            <div className="info-row">
                                <label>URL:</label>
                                <a href={selectedFile.url} target="_blank" rel="noopener noreferrer">
                                    View File
                                </a>
                            </div>
                        </div>
                        <button className="btn-close" onClick={() => setSelectedFile(null)}>
                            Close
                        </button>
                    </div>
                </div>
            )}

            {editingImage && (
                <ImageEditor
                    image={editingImage}
                    onSave={(edited) => {
                        console.log('Image edited:', edited);
                        setEditingImage(null);
                        // In production, save the edited image
                    }}
                    onClose={() => setEditingImage(null)}
                />
            )}

            {showVideoUploader && (
                <VideoUploader
                    onUpload={(video) => {
                        console.log('Video uploaded:', video);
                        fetchMedia();
                    }}
                    onClose={() => setShowVideoUploader(false)}
                />
            )}
        </div>
    );
};

export default MediaPage;
