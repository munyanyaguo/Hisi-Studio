import React, { useState, useEffect } from 'react';
import { Layout, Image, Type, Save, ChevronDown, ChevronRight, Plus, Trash2, RefreshCw } from 'lucide-react';
import './SectionEditorPage.css';

const SectionEditorPage = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [pages, setPages] = useState({});
    const [selectedPage, setSelectedPage] = useState('home');
    const [selectedSection, setSelectedSection] = useState('hero');
    const [sectionContent, setSectionContent] = useState({});
    const [expandedSections, setExpandedSections] = useState({});
    const [message, setMessage] = useState({ type: '', text: '' });

    const API_URL = import.meta.env.VITE_API_URL;

    // Fetch available pages
    useEffect(() => {
        const fetchPages = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/api/v1/admin/section-content/pages`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setPages(data.data);
                } else {
                    // Fallback pages
                    setPages({
                        home: { name: 'Home Page', sections: ['hero', 'about', 'mission', 'features', 'collection'] },
                        about: { name: 'About Page', sections: ['hero', 'story', 'team', 'values'] },
                        collections: { name: 'Collections Page', sections: ['hero', 'featured'] },
                        contact: { name: 'Contact Page', sections: ['hero', 'info'] }
                    });
                }
            } catch (error) {
                console.error('Error fetching pages:', error);
            }
        };

        fetchPages();
    }, [API_URL]);

    // Fetch section content
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
                    setSectionContent(data.data?.grouped?.[selectedPage] || {});
                } else {
                    // Initialize with default structure if no content exists
                    initializeDefaultContent();
                }
            } catch (error) {
                console.error('Error fetching content:', error);
                initializeDefaultContent();
            } finally {
                setLoading(false);
            }
        };

        if (selectedPage) {
            fetchContent();
        }
    }, [selectedPage, API_URL]);

    const initializeDefaultContent = () => {
        const defaults = {
            home: {
                hero: [
                    { id: 'temp-1', content_key: 'title', content_value: '2 THUKU 0 COLLECTION', content_type: 'text', label: 'Hero Title' },
                    { id: 'temp-2', content_key: 'image_url', content_value: '/images/hero/slide-1.jpg', content_type: 'image', label: 'Hero Image' }
                ],
                about: [
                    { id: 'temp-3', content_key: 'title', content_value: 'Fashion That Feels Right', content_type: 'text', label: 'Section Title' },
                    { id: 'temp-4', content_key: 'description', content_value: 'At Hisi Studio, we believe that everyone deserves to feel confident...', content_type: 'richtext', label: 'Description' },
                    { id: 'temp-5', content_key: 'image_url', content_value: '/images/about/mission.jpg', content_type: 'image', label: 'Section Image' }
                ],
                mission: [
                    { id: 'temp-6', content_key: 'title', content_value: 'Our Mission', content_type: 'text', label: 'Mission Title' },
                    { id: 'temp-7', content_key: 'description', content_value: 'To create adaptive fashion that combines cutting-edge design...', content_type: 'richtext', label: 'Mission Statement' }
                ]
            }
        };

        setSectionContent(defaults[selectedPage] || {});
    };

    const handleContentChange = (sectionName, index, field, value) => {
        setSectionContent(prev => {
            const updated = { ...prev };
            if (updated[sectionName] && updated[sectionName][index]) {
                updated[sectionName][index] = {
                    ...updated[sectionName][index],
                    [field]: value
                };
            }
            return updated;
        });
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const token = localStorage.getItem('token');
            const items = [];

            // Collect all items to save
            Object.values(sectionContent).forEach(section => {
                section.forEach(item => {
                    if (item.id && !item.id.startsWith('temp-')) {
                        items.push({
                            id: item.id,
                            content_value: item.content_value
                        });
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
                    setMessage({ type: 'success', text: 'Changes saved successfully!' });
                } else {
                    throw new Error('Failed to save');
                }
            } else {
                // Create new items
                for (const [sectionName, items] of Object.entries(sectionContent)) {
                    for (const item of items) {
                        if (item.id?.startsWith('temp-')) {
                            await fetch(`${API_URL}/api/v1/admin/section-content`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify({
                                    page_name: selectedPage,
                                    section_name: sectionName,
                                    content_key: item.content_key,
                                    content_value: item.content_value,
                                    content_type: item.content_type,
                                    label: item.label
                                })
                            });
                        }
                    }
                }
                setMessage({ type: 'success', text: 'Content created successfully!' });
            }
        } catch (error) {
            console.error('Error saving:', error);
            setMessage({ type: 'error', text: 'Failed to save changes. Please try again.' });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    const toggleSection = (sectionName) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionName]: !prev[sectionName]
        }));
    };

    const getSectionIcon = (type) => {
        switch (type) {
            case 'image': return <Image className="w-4 h-4" />;
            case 'text':
            case 'richtext': return <Type className="w-4 h-4" />;
            default: return <Layout className="w-4 h-4" />;
        }
    };

    return (
        <div className="section-editor-page">
            <div className="section-editor-header">
                <div>
                    <h1>Section Editor</h1>
                    <p>Edit images and text for website sections</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="save-button"
                >
                    {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
            </div>

            {message.text && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}

            <div className="section-editor-content">
                {/* Page Selector */}
                <div className="page-selector">
                    <label>Select Page</label>
                    <select
                        value={selectedPage}
                        onChange={(e) => setSelectedPage(e.target.value)}
                    >
                        {Object.entries(pages).map(([key, page]) => (
                            <option key={key} value={key}>{page.name}</option>
                        ))}
                    </select>
                </div>

                {loading ? (
                    <div className="loading">
                        <RefreshCw className="w-8 h-8 animate-spin" />
                        <span>Loading content...</span>
                    </div>
                ) : (
                    <div className="sections-list">
                        {Object.entries(sectionContent).length === 0 ? (
                            <div className="empty-state">
                                <Layout className="w-12 h-12" />
                                <h3>No content configured</h3>
                                <p>Content for this page hasn't been configured yet. Changes will be saved when you edit and save.</p>
                            </div>
                        ) : (
                            Object.entries(sectionContent).map(([sectionName, items]) => (
                                <div key={sectionName} className="section-group">
                                    <button
                                        className="section-header"
                                        onClick={() => toggleSection(sectionName)}
                                    >
                                        {expandedSections[sectionName] ? (
                                            <ChevronDown className="w-5 h-5" />
                                        ) : (
                                            <ChevronRight className="w-5 h-5" />
                                        )}
                                        <span className="section-name">
                                            {sectionName.charAt(0).toUpperCase() + sectionName.slice(1).replace('_', ' ')}
                                        </span>
                                        <span className="item-count">{items.length} items</span>
                                    </button>

                                    {expandedSections[sectionName] && (
                                        <div className="section-items">
                                            {items.map((item, index) => (
                                                <div key={item.id || index} className="content-item">
                                                    <div className="item-header">
                                                        {getSectionIcon(item.content_type)}
                                                        <span>{item.label || item.content_key}</span>
                                                        <span className="content-type">{item.content_type}</span>
                                                    </div>

                                                    <div className="item-editor">
                                                        {item.content_type === 'image' ? (
                                                            <div className="image-editor">
                                                                <div className="image-preview">
                                                                    {item.content_value && (
                                                                        <img
                                                                            src={item.content_value}
                                                                            alt={item.label}
                                                                            onError={(e) => {
                                                                                e.target.src = '/images/placeholder.jpg';
                                                                            }}
                                                                        />
                                                                    )}
                                                                </div>
                                                                <input
                                                                    type="text"
                                                                    value={item.content_value || ''}
                                                                    onChange={(e) => handleContentChange(sectionName, index, 'content_value', e.target.value)}
                                                                    placeholder="Enter image URL or path"
                                                                />
                                                                <p className="help-text">
                                                                    Use Media Library to upload images, then paste the URL here
                                                                </p>
                                                            </div>
                                                        ) : item.content_type === 'richtext' ? (
                                                            <textarea
                                                                value={item.content_value || ''}
                                                                onChange={(e) => handleContentChange(sectionName, index, 'content_value', e.target.value)}
                                                                rows={4}
                                                                placeholder={`Enter ${item.label || item.content_key}...`}
                                                            />
                                                        ) : (
                                                            <input
                                                                type="text"
                                                                value={item.content_value || ''}
                                                                onChange={(e) => handleContentChange(sectionName, index, 'content_value', e.target.value)}
                                                                placeholder={`Enter ${item.label || item.content_key}...`}
                                                            />
                                                        )}
                                                    </div>
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
        </div>
    );
};

export default SectionEditorPage;
