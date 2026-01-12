import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Clock } from 'lucide-react';
import './MessagingPage.css';

const MessagingPage = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (selectedConversation) {
            fetchMessages(selectedConversation.id);
        }
    }, [selectedConversation]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchConversations = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/admin/conversations`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                setConversations(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (conversationId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/admin/conversations/${conversationId}/messages`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                setMessages(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;

        try {
            setSending(true);
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/admin/conversations/${selectedConversation.id}/messages`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ message: newMessage })
                }
            );

            if (response.ok) {
                setNewMessage('');
                await fetchMessages(selectedConversation.id);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
        }
    };

    return (
        <div className="messaging-page">
            <div className="page-header">
                <h1>Messages</h1>
                <p className="page-subtitle">Communicate with customers</p>
            </div>

            <div className="messaging-container">
                <div className="conversations-sidebar">
                    <h2>Conversations</h2>
                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                        </div>
                    ) : conversations.length === 0 ? (
                        <div className="empty-conversations">
                            <p>No conversations yet</p>
                        </div>
                    ) : (
                        <div className="conversations-list">
                            {conversations.map((conv) => (
                                <div
                                    key={conv.id}
                                    className={`conversation-item ${selectedConversation?.id === conv.id ? 'active' : ''}`}
                                    onClick={() => setSelectedConversation(conv)}
                                >
                                    <div className="conversation-avatar">
                                        <User size={24} />
                                    </div>
                                    <div className="conversation-info">
                                        <h3>{conv.customer_name}</h3>
                                        <p className="last-message">{conv.last_message || 'No messages yet'}</p>
                                    </div>
                                    <div className="conversation-meta">
                                        <span className="time">{formatDate(conv.updated_at)}</span>
                                        {conv.unread_count > 0 && (
                                            <span className="unread-badge">{conv.unread_count}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="messages-panel">
                    {selectedConversation ? (
                        <>
                            <div className="messages-header">
                                <div className="customer-info">
                                    <div className="customer-avatar">
                                        <User size={32} />
                                    </div>
                                    <div>
                                        <h2>{selectedConversation.customer_name}</h2>
                                        <p>{selectedConversation.customer_email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="messages-body">
                                {messages.map((message, index) => {
                                    const showDate = index === 0 ||
                                        formatDate(messages[index - 1].created_at) !== formatDate(message.created_at);

                                    return (
                                        <React.Fragment key={message.id}>
                                            {showDate && (
                                                <div className="date-divider">
                                                    <span>{formatDate(message.created_at)}</span>
                                                </div>
                                            )}
                                            <div className={`message ${message.is_admin ? 'admin' : 'customer'}`}>
                                                <div className="message-content">
                                                    <p>{message.message}</p>
                                                    <span className="message-time">
                                                        <Clock size={12} />
                                                        {formatTime(message.created_at)}
                                                    </span>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            <form className="message-input-form" onSubmit={handleSendMessage}>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    disabled={sending}
                                />
                                <button type="submit" disabled={sending || !newMessage.trim()}>
                                    <Send size={20} />
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="no-conversation-selected">
                            <User size={64} />
                            <h3>Select a conversation</h3>
                            <p>Choose a conversation from the sidebar to start messaging</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessagingPage;
