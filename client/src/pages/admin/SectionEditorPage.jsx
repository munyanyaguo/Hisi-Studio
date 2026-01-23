import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Upload, ChevronDown, ChevronRight, Image, Type } from 'lucide-react';
import './SectionEditorPage.css';

const SectionEditorPage = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedPage, setSelectedPage] = useState('home');
    const [sectionContent, setSectionContent] = useState({});
    const [expandedSections, setExpandedSections] = useState({});
    const [message, setMessage] = useState({ type: '', text: '' });

    const API_URL = import.meta.env.VITE_API_URL;

    const pages = {
        home: 'Home Page',
        about: 'About Page',
        blog: 'Blog Page',
        contact: 'Contact Page'
    };

    // Fetch content when page changes
    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/api/v1/admin/section-content?page_name=${selectedPage}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();

                    // API returns: { data: { grouped: { page: { section: items[] } }, items: [] } }
                    // We need to get grouped[selectedPage] which contains sections
                    const grouped = data.data?.grouped?.[selectedPage] || {};

                    setSectionContent(grouped);
                    // Auto-expand all sections
                    const expanded = {};
                    Object.keys(grouped).forEach(key => { expanded[key] = true; });
                    setExpandedSections(expanded);
                }
            } catch (error) {
                console.error('Error fetching content:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [selectedPage, API_URL]);

    const handleContentChange = (sectionName, index, value) => {
        setSectionContent(prev => {
            const updated = { ...prev };
            if (updated[sectionName] && updated[sectionName][index]) {
                updated[sectionName][index] = {
                    ...updated[sectionName][index],
                    content_value: value
                };
            }
            return updated;
        });
    };

    const handleImageUpload = async (e, sectionName, index) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${API_URL}/api/v1/admin/media/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                handleContentChange(sectionName, index, data.data.url || data.data.file_path);
                setMessage({ type: 'success', text: 'Image uploaded!' });
                setTimeout(() => setMessage({ type: '', text: '' }), 2000);
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Upload failed' });
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const items = [];

            Object.values(sectionContent).forEach(section => {
                section.forEach(item => {
                    if (item.id) {
                        items.push({ id: item.id, content_value: item.content_value });
                    }
                });
            });

            if (items.length > 0) {
                const response = await fetch(`${API_URL}/api/v1/admin/section-content/bulk`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ items })
                });

                if (response.ok) {
                    setMessage({ type: 'success', text: 'Saved successfully!' });
                }
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Save failed' });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    const toggleSection = (name) => {
        setExpandedSections(prev => ({ ...prev, [name]: !prev[name] }));
    };

    return (
        <div className="section-editor">
            <div className="section-editor-header">
                <div>
                    <h1>Section Editor</h1>
                    <p>Edit website content</p>
                </div>
                <button onClick={handleSave} disabled={saving} className="save-btn">
                    {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {message.text && (
                <div className={`message ${message.type}`}>{message.text}</div>
            )}

            <div className="page-tabs">
                {Object.entries(pages).map(([key, name]) => (
                    <button
                        key={key}
                        className={`tab ${selectedPage === key ? 'active' : ''}`}
                        onClick={() => setSelectedPage(key)}
                    >
                        {name}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="loading">
                    <RefreshCw className="w-8 h-8 animate-spin" />
                    <span>Loading...</span>
                </div>
            ) : (
                <div className="sections-container">
                    {Object.keys(sectionContent).length === 0 ? (
                        <div className="empty-state">
                            <p>No content configured for this page yet.</p>
                        </div>
                    ) : (
                        Object.entries(sectionContent).map(([sectionName, items]) => (
                            <div key={sectionName} className="section-card">
                                <button
                                    className="section-title"
                                    onClick={() => toggleSection(sectionName)}
                                >
                                    {expandedSections[sectionName] ?
                                        <ChevronDown className="w-5 h-5" /> :
                                        <ChevronRight className="w-5 h-5" />
                                    }
                                    <span>{sectionName.charAt(0).toUpperCase() + sectionName.slice(1)}</span>
                                </button>

                                {expandedSections[sectionName] && (
                                    <div className="section-content">
                                        {items.map((item, index) => (
                                            <div key={item.id} className="content-field">
                                                <label>
                                                    {item.content_type === 'image' ?
                                                        <Image className="w-4 h-4" /> :
                                                        <Type className="w-4 h-4" />
                                                    }
                                                    {item.label || item.content_key}
                                                </label>

                                                {item.content_type === 'image' ? (
                                                    <div className="image-field">
                                                        {item.content_value && (
                                                            <img
                                                                src={item.content_value.startsWith('http') ? item.content_value : `${API_URL}${item.content_value}`}
                                                                alt={item.label}
                                                                onError={(e) => { e.target.style.display = 'none'; }}
                                                            />
                                                        )}
                                                        <label className="upload-btn">
                                                            <Upload className="w-4 h-4" />
                                                            Upload Image
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => handleImageUpload(e, sectionName, index)}
                                                                hidden
                                                            />
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={item.content_value || ''}
                                                            onChange={(e) => handleContentChange(sectionName, index, e.target.value)}
                                                            placeholder="Or enter image URL"
                                                        />
                                                    </div>
                                                ) : item.content_type === 'richtext' ? (
                                                    <textarea
                                                        value={item.content_value || ''}
                                                        onChange={(e) => handleContentChange(sectionName, index, e.target.value)}
                                                        rows={4}
                                                    />
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={item.content_value || ''}
                                                        onChange={(e) => handleContentChange(sectionName, index, e.target.value)}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default SectionEditorPage;
