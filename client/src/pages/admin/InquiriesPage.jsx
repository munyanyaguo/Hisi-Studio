import React, { useState, useEffect } from 'react';
import { MessageSquare, Mail, Phone, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import './InquiriesPage.css';

const InquiriesPage = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, new, responded, closed
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [response, setResponse] = useState('');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchInquiries();
    }, [filter]);

    const fetchInquiries = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const params = new URLSearchParams({
                ...(filter !== 'all' && { status: filter })
            });

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/cms/contact-messages?${params}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (res.ok) {
                const data = await res.json();
                setInquiries(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching inquiries:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRespond = async (inquiryId) => {
        if (!response.trim()) return;

        try {
            setSending(true);
            const token = localStorage.getItem('token');

            await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/admin/inquiries/${inquiryId}/respond`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ response: response })
                }
            );

            setResponse('');
            setSelectedInquiry(null);
            await fetchInquiries();
        } catch (error) {
            console.error('Error sending response:', error);
        } finally {
            setSending(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'new':
                return <AlertCircle size={18} className="status-icon new" />;
            case 'responded':
                return <CheckCircle size={18} className="status-icon responded" />;
            case 'closed':
                return <CheckCircle size={18} className="status-icon closed" />;
            default:
                return <Clock size={18} className="status-icon" />;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="inquiries-page">
            <div className="page-header">
                <div>
                    <h1>Customer Inquiries</h1>
                    <p className="page-subtitle">Manage customer inquiries and messages</p>
                </div>
            </div>

            <div className="filter-tabs-container">
                <div className="filter-tabs">
                    <button
                        className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    <button
                        className={`filter-tab ${filter === 'new' ? 'active' : ''}`}
                        onClick={() => setFilter('new')}
                    >
                        New
                    </button>
                    <button
                        className={`filter-tab ${filter === 'responded' ? 'active' : ''}`}
                        onClick={() => setFilter('responded')}
                    >
                        Responded
                    </button>
                    <button
                        className={`filter-tab ${filter === 'closed' ? 'active' : ''}`}
                        onClick={() => setFilter('closed')}
                    >
                        Closed
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading inquiries...</p>
                </div>
            ) : inquiries.length === 0 ? (
                <div className="empty-state">
                    <MessageSquare size={64} className="empty-icon" />
                    <h3>No inquiries found</h3>
                    <p>No inquiries match your filter criteria.</p>
                </div>
            ) : (
                <div className="inquiries-grid">
                    {inquiries.map((inquiry) => (
                        <div key={inquiry.id} className="inquiry-card">
                            <div className="inquiry-header">
                                <div>
                                    <h3>{inquiry.name}</h3>
                                    <span className="inquiry-category">{inquiry.category || 'General'}</span>
                                </div>
                                {getStatusIcon(inquiry.status)}
                            </div>

                            <div className="inquiry-content">
                                <p className="inquiry-message">{inquiry.message}</p>
                            </div>

                            <div className="inquiry-meta">
                                <div className="meta-item">
                                    <Mail size={14} />
                                    <span>{inquiry.email}</span>
                                </div>
                                {inquiry.phone && (
                                    <div className="meta-item">
                                        <Phone size={14} />
                                        <span>{inquiry.phone}</span>
                                    </div>
                                )}
                                <div className="meta-item">
                                    <Calendar size={14} />
                                    <span>{formatDate(inquiry.created_at)}</span>
                                </div>
                            </div>

                            {inquiry.status === 'new' && (
                                <button
                                    className="respond-btn"
                                    onClick={() => setSelectedInquiry(inquiry)}
                                >
                                    Respond
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {selectedInquiry && (
                <div className="modal-overlay" onClick={() => setSelectedInquiry(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Respond to {selectedInquiry.name}</h2>
                        <div className="inquiry-details">
                            <p><strong>Email:</strong> {selectedInquiry.email}</p>
                            <p><strong>Message:</strong></p>
                            <p className="original-message">{selectedInquiry.message}</p>
                        </div>
                        <textarea
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                            placeholder="Type your response here..."
                            rows={6}
                            className="response-textarea"
                        />
                        <div className="modal-actions">
                            <button
                                className="btn-secondary"
                                onClick={() => setSelectedInquiry(null)}
                                disabled={sending}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-primary"
                                onClick={() => handleRespond(selectedInquiry.id)}
                                disabled={sending || !response.trim()}
                            >
                                {sending ? 'Sending...' : 'Send Response'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InquiriesPage;
