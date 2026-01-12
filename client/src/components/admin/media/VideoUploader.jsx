import React, { useState, useRef } from 'react';
import { Upload, Video, X, Play, Pause } from 'lucide-react';
import './VideoUploader.css';

const VideoUploader = ({ onUpload, onClose }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [uploading, setUploading] = useState(false);
    const videoRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('video/')) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreview(url);
        } else {
            alert('Please select a valid video file');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const token = localStorage.getItem('token');
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
                onUpload(data.data);
                onClose();
            } else {
                alert('Upload failed');
            }
        } catch (error) {
            console.error('Error uploading video:', error);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className="video-uploader-overlay">
            <div className="video-uploader">
                <div className="uploader-header">
                    <h2>Upload Video</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {!preview ? (
                    <div
                        className="upload-zone"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Video size={64} />
                        <h3>Click to select video</h3>
                        <p>Supports MP4, WebM, MOV</p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="video/*"
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                        />
                    </div>
                ) : (
                    <div className="video-preview-section">
                        <div className="video-preview">
                            <video
                                ref={videoRef}
                                src={preview}
                                onEnded={() => setIsPlaying(false)}
                            />
                            <button className="play-btn" onClick={togglePlay}>
                                {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                            </button>
                        </div>

                        <div className="video-info">
                            <div className="info-row">
                                <span>Filename:</span>
                                <span>{selectedFile.name}</span>
                            </div>
                            <div className="info-row">
                                <span>Size:</span>
                                <span>{formatFileSize(selectedFile.size)}</span>
                            </div>
                            <div className="info-row">
                                <span>Type:</span>
                                <span>{selectedFile.type}</span>
                            </div>
                        </div>

                        <button
                            className="change-btn"
                            onClick={() => {
                                setSelectedFile(null);
                                setPreview(null);
                                setIsPlaying(false);
                            }}
                        >
                            Choose Different Video
                        </button>
                    </div>
                )}

                {preview && (
                    <div className="uploader-actions">
                        <button className="btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            className="btn-primary"
                            onClick={handleUpload}
                            disabled={uploading}
                        >
                            <Upload size={18} />
                            {uploading ? 'Uploading...' : 'Upload Video'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoUploader;
