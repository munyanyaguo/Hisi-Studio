import React, { useState } from 'react';
import { Crop, RotateCw, ZoomIn, ZoomOut, Download, X } from 'lucide-react';
import './ImageEditor.css';

const ImageEditor = ({ image, onSave, onClose }) => {
    const [rotation, setRotation] = useState(0);
    const [scale, setScale] = useState(1);
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);

    const handleSave = () => {
        // In a production app, you would apply transformations to the image
        // using canvas API or a library like react-image-crop
        const editedImage = {
            ...image,
            transformations: {
                rotation,
                scale,
                brightness,
                contrast
            }
        };
        onSave(editedImage);
    };

    const resetTransformations = () => {
        setRotation(0);
        setScale(1);
        setBrightness(100);
        setContrast(100);
    };

    const getImageStyle = () => {
        return {
            transform: `rotate(${rotation}deg) scale(${scale})`,
            filter: `brightness(${brightness}%) contrast(${contrast}%)`
        };
    };

    return (
        <div className="image-editor-overlay">
            <div className="image-editor">
                <div className="editor-header">
                    <h2>Edit Image</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="editor-preview">
                    <img
                        src={image.url}
                        alt={image.alt_text || image.filename}
                        style={getImageStyle()}
                    />
                </div>

                <div className="editor-controls">
                    <div className="control-group">
                        <label>
                            <RotateCw size={16} />
                            Rotation
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="360"
                            value={rotation}
                            onChange={(e) => setRotation(Number(e.target.value))}
                        />
                        <span>{rotation}°</span>
                    </div>

                    <div className="control-group">
                        <label>
                            <ZoomIn size={16} />
                            Scale
                        </label>
                        <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={scale}
                            onChange={(e) => setScale(Number(e.target.value))}
                        />
                        <span>{scale.toFixed(1)}x</span>
                    </div>

                    <div className="control-group">
                        <label>Brightness</label>
                        <input
                            type="range"
                            min="0"
                            max="200"
                            value={brightness}
                            onChange={(e) => setBrightness(Number(e.target.value))}
                        />
                        <span>{brightness}%</span>
                    </div>

                    <div className="control-group">
                        <label>Contrast</label>
                        <input
                            type="range"
                            min="0"
                            max="200"
                            value={contrast}
                            onChange={(e) => setContrast(Number(e.target.value))}
                        />
                        <span>{contrast}%</span>
                    </div>
                </div>

                <div className="editor-actions">
                    <button className="btn-secondary" onClick={resetTransformations}>
                        Reset
                    </button>
                    <button className="btn-primary" onClick={handleSave}>
                        <Download size={18} />
                        Save Changes
                    </button>
                </div>

                <div className="editor-note">
                    <p>Note: Image transformations are preview only. For production, integrate with a proper image processing library.</p>
                </div>
            </div>
        </div>
    );
};

export default ImageEditor;
