import React, { useState, useEffect } from 'react';
import {
    Plus, Edit2, Trash2, Eye, Save, X, Star, Newspaper,
    FileText, Calendar, MapPin, Mic, Handshake, Download, Mail, AlertCircle
} from 'lucide-react';
import {
    adminGetMediaCoverage, adminCreateMediaCoverage, adminUpdateMediaCoverage, adminDeleteMediaCoverage,
    adminGetPressReleases, adminCreatePressRelease, adminUpdatePressRelease, adminDeletePressRelease,
    adminGetExhibitions, adminCreateExhibition, adminUpdateExhibition, adminDeleteExhibition,
    adminGetSpeakingEngagements, adminCreateSpeakingEngagement, adminUpdateSpeakingEngagement, adminDeleteSpeakingEngagement,
    adminGetCollaborations, adminCreateCollaboration, adminUpdateCollaboration, adminDeleteCollaboration,
    adminGetPressHero, adminUpdatePressHero,
    adminGetPressContact, adminUpdatePressContact,
    adminGetMediaKit, adminUpdateMediaKitConfig, adminCreateMediaKitItem, adminDeleteMediaKitItem
} from '../../services/pressApi';
import './PressManagementPage.css';

const PressManagementPage = () => {
    const [activeTab, setActiveTab] = useState('media-coverage');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Data states
    const [mediaCoverage, setMediaCoverage] = useState([]);
    const [pressReleases, setPressReleases] = useState([]);
    const [exhibitions, setExhibitions] = useState([]);
    const [speakingEngagements, setSpeakingEngagements] = useState([]);
    const [collaborations, setCollaborations] = useState([]);
    const [hero, setHero] = useState(null);
    const [contact, setContact] = useState(null);
    const [mediaKit, setMediaKit] = useState({ config: null, items: [] });

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({});

    const tabs = [
        { id: 'media-coverage', label: 'Media Coverage', icon: Newspaper },
        { id: 'press-releases', label: 'Press Releases', icon: FileText },
        { id: 'exhibitions', label: 'Exhibitions', icon: MapPin },
        { id: 'speaking', label: 'Speaking', icon: Mic },
        { id: 'collaborations', label: 'Collaborations', icon: Handshake },
        { id: 'hero-contact', label: 'Hero & Contact', icon: Mail },
        { id: 'media-kit', label: 'Media Kit', icon: Download }
    ];

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            switch (activeTab) {
                case 'media-coverage':
                    setMediaCoverage(await adminGetMediaCoverage());
                    break;
                case 'press-releases':
                    setPressReleases(await adminGetPressReleases());
                    break;
                case 'exhibitions':
                    setExhibitions(await adminGetExhibitions());
                    break;
                case 'speaking':
                    setSpeakingEngagements(await adminGetSpeakingEngagements());
                    break;
                case 'collaborations':
                    setCollaborations(await adminGetCollaborations());
                    break;
                case 'hero-contact':
                    setHero(await adminGetPressHero());
                    setContact(await adminGetPressContact());
                    break;
                case 'media-kit':
                    setMediaKit(await adminGetMediaKit());
                    break;
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (message, isError = false) => {
        if (isError) {
            setError(message);
            setSuccess(null);
        } else {
            setSuccess(message);
            setError(null);
        }
        setTimeout(() => {
            setError(null);
            setSuccess(null);
        }, 3000);
    };

    const openModal = (type, item = null) => {
        setModalType(type);
        setEditingItem(item);
        if (item) {
            setFormData({ ...item });
        } else {
            // Default form data for new items
            const defaults = {
                'media-coverage': { title: '', outlet: '', date: '', category: '', description: '', image: '', link: '', is_featured: false },
                'press-release': { title: '', date: '', excerpt: '', content: '', link: '' },
                'exhibition': { title: '', location: '', date: '', description: '', image: '', gallery: [] },
                'speaking': { title: '', event: '', location: '', date: '', description: '', type: 'Keynote' },
                'collaboration': { title: '', partner: '', description: '', image: '', year: new Date().getFullYear().toString() },
                'media-kit-item': { name: '', type: 'PDF', size: '', url: '' }
            };
            setFormData(defaults[type] || {});
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingItem(null);
        setFormData({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            switch (modalType) {
                case 'media-coverage':
                    if (editingItem) {
                        await adminUpdateMediaCoverage(editingItem.id, formData);
                    } else {
                        await adminCreateMediaCoverage(formData);
                    }
                    break;
                case 'press-release':
                    if (editingItem) {
                        await adminUpdatePressRelease(editingItem.id, formData);
                    } else {
                        await adminCreatePressRelease(formData);
                    }
                    break;
                case 'exhibition':
                    if (editingItem) {
                        await adminUpdateExhibition(editingItem.id, formData);
                    } else {
                        await adminCreateExhibition(formData);
                    }
                    break;
                case 'speaking':
                    if (editingItem) {
                        await adminUpdateSpeakingEngagement(editingItem.id, formData);
                    } else {
                        await adminCreateSpeakingEngagement(formData);
                    }
                    break;
                case 'collaboration':
                    if (editingItem) {
                        await adminUpdateCollaboration(editingItem.id, formData);
                    } else {
                        await adminCreateCollaboration(formData);
                    }
                    break;
                case 'media-kit-item':
                    await adminCreateMediaKitItem(formData);
                    break;
            }
            showNotification(editingItem ? 'Item updated successfully!' : 'Item created successfully!');
            closeModal();
            fetchData();
        } catch (err) {
            showNotification(err.message, true);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (type, id) => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        try {
            switch (type) {
                case 'media-coverage':
                    await adminDeleteMediaCoverage(id);
                    break;
                case 'press-release':
                    await adminDeletePressRelease(id);
                    break;
                case 'exhibition':
                    await adminDeleteExhibition(id);
                    break;
                case 'speaking':
                    await adminDeleteSpeakingEngagement(id);
                    break;
                case 'collaboration':
                    await adminDeleteCollaboration(id);
                    break;
                case 'media-kit-item':
                    await adminDeleteMediaKitItem(id);
                    break;
            }
            showNotification('Item deleted successfully!');
            fetchData();
        } catch (err) {
            showNotification(err.message, true);
        }
    };

    const handleHeroSave = async () => {
        setSaving(true);
        try {
            await adminUpdatePressHero(hero);
            showNotification('Hero section updated!');
        } catch (err) {
            showNotification(err.message, true);
        } finally {
            setSaving(false);
        }
    };

    const handleContactSave = async () => {
        setSaving(true);
        try {
            await adminUpdatePressContact(contact);
            showNotification('Contact info updated!');
        } catch (err) {
            showNotification(err.message, true);
        } finally {
            setSaving(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No date';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    const renderTabContent = () => {
        if (loading) {
            return (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading...</p>
                </div>
            );
        }

        switch (activeTab) {
            case 'media-coverage':
                return renderMediaCoverage();
            case 'press-releases':
                return renderPressReleases();
            case 'exhibitions':
                return renderExhibitions();
            case 'speaking':
                return renderSpeakingEngagements();
            case 'collaborations':
                return renderCollaborations();
            case 'hero-contact':
                return renderHeroContact();
            case 'media-kit':
                return renderMediaKit();
            default:
                return null;
        }
    };

    const renderMediaCoverage = () => (
        <div className="content-section">
            <div className="section-header">
                <h2>Media Coverage</h2>
                <button className="btn-primary" onClick={() => openModal('media-coverage')}>
                    <Plus size={18} /> Add Coverage
                </button>
            </div>
            <div className="items-grid">
                {mediaCoverage.map(item => (
                    <div key={item.id} className="item-card">
                        {item.image && <img src={item.image} alt={item.title} className="item-image" />}
                        <div className="item-content">
                            <div className="item-meta">
                                <span className="outlet">{item.outlet}</span>
                                {item.featured && <Star size={14} className="featured-icon" />}
                            </div>
                            <h3>{item.title}</h3>
                            <p className="item-date">{formatDate(item.date)}</p>
                            <span className="category-badge">{item.category}</span>
                        </div>
                        <div className="item-actions">
                            <button onClick={() => openModal('media-coverage', item)} title="Edit"><Edit2 size={16} /></button>
                            <button onClick={() => handleDelete('media-coverage', item.id)} className="delete" title="Delete"><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderPressReleases = () => (
        <div className="content-section">
            <div className="section-header">
                <h2>Press Releases</h2>
                <button className="btn-primary" onClick={() => openModal('press-release')}>
                    <Plus size={18} /> Add Release
                </button>
            </div>
            <div className="items-list">
                {pressReleases.map(item => (
                    <div key={item.id} className="list-item">
                        <div className="list-item-content">
                            <h3>{item.title}</h3>
                            <p className="item-excerpt">{item.excerpt}</p>
                            <span className="item-date">{formatDate(item.date)}</span>
                        </div>
                        <div className="item-actions">
                            <button onClick={() => openModal('press-release', item)} title="Edit"><Edit2 size={16} /></button>
                            <button onClick={() => handleDelete('press-release', item.id)} className="delete" title="Delete"><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderExhibitions = () => (
        <div className="content-section">
            <div className="section-header">
                <h2>Exhibitions</h2>
                <button className="btn-primary" onClick={() => openModal('exhibition')}>
                    <Plus size={18} /> Add Exhibition
                </button>
            </div>
            <div className="items-grid">
                {exhibitions.map(item => (
                    <div key={item.id} className="item-card">
                        {item.image && <img src={item.image} alt={item.title} className="item-image" />}
                        <div className="item-content">
                            <h3>{item.title}</h3>
                            <p className="item-location"><MapPin size={14} /> {item.location}</p>
                            <p className="item-date">{formatDate(item.date)}</p>
                        </div>
                        <div className="item-actions">
                            <button onClick={() => openModal('exhibition', item)} title="Edit"><Edit2 size={16} /></button>
                            <button onClick={() => handleDelete('exhibition', item.id)} className="delete" title="Delete"><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderSpeakingEngagements = () => (
        <div className="content-section">
            <div className="section-header">
                <h2>Speaking Engagements</h2>
                <button className="btn-primary" onClick={() => openModal('speaking')}>
                    <Plus size={18} /> Add Engagement
                </button>
            </div>
            <div className="items-list">
                {speakingEngagements.map(item => (
                    <div key={item.id} className="list-item">
                        <div className="list-item-content">
                            <span className="type-badge">{item.type}</span>
                            <h3>{item.title}</h3>
                            <p className="item-event">{item.event}</p>
                            <div className="item-meta-row">
                                <span><MapPin size={14} /> {item.location}</span>
                                <span><Calendar size={14} /> {formatDate(item.date)}</span>
                            </div>
                        </div>
                        <div className="item-actions">
                            <button onClick={() => openModal('speaking', item)} title="Edit"><Edit2 size={16} /></button>
                            <button onClick={() => handleDelete('speaking', item.id)} className="delete" title="Delete"><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderCollaborations = () => (
        <div className="content-section">
            <div className="section-header">
                <h2>Collaborations</h2>
                <button className="btn-primary" onClick={() => openModal('collaboration')}>
                    <Plus size={18} /> Add Collaboration
                </button>
            </div>
            <div className="items-grid">
                {collaborations.map(item => (
                    <div key={item.id} className="item-card">
                        {item.image && <img src={item.image} alt={item.title} className="item-image" />}
                        <div className="item-content">
                            <span className="year-badge">{item.year}</span>
                            <h3>{item.title}</h3>
                            <p className="item-partner">{item.partner}</p>
                        </div>
                        <div className="item-actions">
                            <button onClick={() => openModal('collaboration', item)} title="Edit"><Edit2 size={16} /></button>
                            <button onClick={() => handleDelete('collaboration', item.id)} className="delete" title="Delete"><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderHeroContact = () => (
        <div className="content-section">
            {/* Hero Section */}
            <div className="form-section">
                <h2>Hero Section</h2>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            value={hero?.title || ''}
                            onChange={(e) => setHero({ ...hero, title: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Subtitle</label>
                        <input
                            type="text"
                            value={hero?.subtitle || ''}
                            onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                        />
                    </div>
                    <div className="form-group full-width">
                        <label>Description</label>
                        <textarea
                            value={hero?.description || ''}
                            onChange={(e) => setHero({ ...hero, description: e.target.value })}
                            rows={3}
                        />
                    </div>
                    <div className="form-group full-width">
                        <label>Image URL</label>
                        <input
                            type="text"
                            value={hero?.image || ''}
                            onChange={(e) => setHero({ ...hero, image: e.target.value })}
                        />
                    </div>
                </div>
                <button className="btn-primary" onClick={handleHeroSave} disabled={saving}>
                    <Save size={18} /> {saving ? 'Saving...' : 'Save Hero'}
                </button>
            </div>

            {/* Contact Section */}
            <div className="form-section">
                <h2>Press Contact</h2>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            value={contact?.title || ''}
                            onChange={(e) => setContact({ ...contact, title: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={contact?.email || ''}
                            onChange={(e) => setContact({ ...contact, email: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input
                            type="text"
                            value={contact?.phone || ''}
                            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                        />
                    </div>
                    <div className="form-group full-width">
                        <label>Description</label>
                        <textarea
                            value={contact?.description || ''}
                            onChange={(e) => setContact({ ...contact, description: e.target.value })}
                            rows={3}
                        />
                    </div>
                </div>
                <button className="btn-primary" onClick={handleContactSave} disabled={saving}>
                    <Save size={18} /> {saving ? 'Saving...' : 'Save Contact'}
                </button>
            </div>
        </div>
    );

    const renderMediaKit = () => (
        <div className="content-section">
            <div className="section-header">
                <h2>Media Kit Items</h2>
                <button className="btn-primary" onClick={() => openModal('media-kit-item')}>
                    <Plus size={18} /> Add Item
                </button>
            </div>
            <div className="items-list">
                {mediaKit?.items?.map(item => (
                    <div key={item.id} className="list-item">
                        <div className="list-item-content">
                            <Download size={20} className="item-icon" />
                            <div>
                                <h3>{item.name}</h3>
                                <span className="item-meta">{item.type} • {item.size}</span>
                            </div>
                        </div>
                        <div className="item-actions">
                            <button onClick={() => handleDelete('media-kit-item', item.id)} className="delete" title="Delete"><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderModal = () => {
        if (!showModal) return null;

        const getModalTitle = () => {
            const prefix = editingItem ? 'Edit' : 'Add';
            const labels = {
                'media-coverage': 'Media Coverage',
                'press-release': 'Press Release',
                'exhibition': 'Exhibition',
                'speaking': 'Speaking Engagement',
                'collaboration': 'Collaboration',
                'media-kit-item': 'Media Kit Item'
            };
            return `${prefix} ${labels[modalType]}`;
        };

        return (
            <div className="modal-overlay" onClick={closeModal}>
                <div className="modal" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>{getModalTitle()}</h2>
                        <button className="close-btn" onClick={closeModal}><X size={20} /></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {modalType === 'media-coverage' && (
                                <>
                                    <div className="form-group">
                                        <label>Title *</label>
                                        <input type="text" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Outlet *</label>
                                            <input type="text" value={formData.outlet || ''} onChange={e => setFormData({ ...formData, outlet: e.target.value })} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Date *</label>
                                            <input type="date" value={formData.date || ''} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Category *</label>
                                        <input type="text" value={formData.category || ''} onChange={e => setFormData({ ...formData, category: e.target.value })} required placeholder="e.g., Feature Article, Interview" />
                                    </div>
                                    <div className="form-group">
                                        <label>Description</label>
                                        <textarea value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Image URL</label>
                                            <input type="text" value={formData.image || ''} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                                        </div>
                                        <div className="form-group">
                                            <label>Link</label>
                                            <input type="text" value={formData.link || ''} onChange={e => setFormData({ ...formData, link: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="form-group checkbox">
                                        <label>
                                            <input type="checkbox" checked={formData.is_featured || false} onChange={e => setFormData({ ...formData, is_featured: e.target.checked })} />
                                            Featured
                                        </label>
                                    </div>
                                </>
                            )}

                            {modalType === 'press-release' && (
                                <>
                                    <div className="form-group">
                                        <label>Title *</label>
                                        <input type="text" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Date *</label>
                                        <input type="date" value={formData.date || ''} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Excerpt</label>
                                        <textarea value={formData.excerpt || ''} onChange={e => setFormData({ ...formData, excerpt: e.target.value })} rows={3} />
                                    </div>
                                    <div className="form-group">
                                        <label>Link</label>
                                        <input type="text" value={formData.link || ''} onChange={e => setFormData({ ...formData, link: e.target.value })} />
                                    </div>
                                </>
                            )}

                            {modalType === 'exhibition' && (
                                <>
                                    <div className="form-group">
                                        <label>Title *</label>
                                        <input type="text" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Location *</label>
                                            <input type="text" value={formData.location || ''} onChange={e => setFormData({ ...formData, location: e.target.value })} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Date *</label>
                                            <input type="date" value={formData.date || ''} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Description</label>
                                        <textarea value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} />
                                    </div>
                                    <div className="form-group">
                                        <label>Image URL</label>
                                        <input type="text" value={formData.image || ''} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                                    </div>
                                </>
                            )}

                            {modalType === 'speaking' && (
                                <>
                                    <div className="form-group">
                                        <label>Title *</label>
                                        <input type="text" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Event *</label>
                                            <input type="text" value={formData.event || ''} onChange={e => setFormData({ ...formData, event: e.target.value })} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Type *</label>
                                            <select value={formData.type || 'Keynote'} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                                <option value="Keynote">Keynote</option>
                                                <option value="Panel">Panel</option>
                                                <option value="Workshop">Workshop</option>
                                                <option value="TEDx">TEDx</option>
                                                <option value="Fireside Chat">Fireside Chat</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Location *</label>
                                            <input type="text" value={formData.location || ''} onChange={e => setFormData({ ...formData, location: e.target.value })} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Date *</label>
                                            <input type="date" value={formData.date || ''} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Description</label>
                                        <textarea value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} />
                                    </div>
                                </>
                            )}

                            {modalType === 'collaboration' && (
                                <>
                                    <div className="form-group">
                                        <label>Title *</label>
                                        <input type="text" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Partner *</label>
                                            <input type="text" value={formData.partner || ''} onChange={e => setFormData({ ...formData, partner: e.target.value })} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Year *</label>
                                            <input type="text" value={formData.year || ''} onChange={e => setFormData({ ...formData, year: e.target.value })} required maxLength={4} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Description</label>
                                        <textarea value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} />
                                    </div>
                                    <div className="form-group">
                                        <label>Image URL</label>
                                        <input type="text" value={formData.image || ''} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                                    </div>
                                </>
                            )}

                            {modalType === 'media-kit-item' && (
                                <>
                                    <div className="form-group">
                                        <label>Name *</label>
                                        <input type="text" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Type</label>
                                            <select value={formData.type || 'PDF'} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                                <option value="PDF">PDF</option>
                                                <option value="ZIP">ZIP</option>
                                                <option value="PNG">PNG</option>
                                                <option value="SVG">SVG</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Size</label>
                                            <input type="text" value={formData.size || ''} onChange={e => setFormData({ ...formData, size: e.target.value })} placeholder="e.g., 2.5 MB" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>URL</label>
                                        <input type="text" value={formData.url || ''} onChange={e => setFormData({ ...formData, url: e.target.value })} />
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                            <button type="submit" className="btn-primary" disabled={saving}>
                                {saving ? 'Saving...' : (editingItem ? 'Update' : 'Create')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <div className="press-management-page">
            <div className="page-header">
                <div>
                    <h1>Press Management</h1>
                    <p className="page-subtitle">Manage press page content, media coverage, and events</p>
                </div>
            </div>

            {/* Notifications */}
            {error && (
                <div className="notification error">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}
            {success && (
                <div className="notification success">
                    {success}
                </div>
            )}

            {/* Tabs */}
            <div className="tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <tab.icon size={18} />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="tab-content">
                {renderTabContent()}
            </div>

            {/* Modal */}
            {renderModal()}
        </div>
    );
};

export default PressManagementPage;
