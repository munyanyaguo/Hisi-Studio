import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Menu, X, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './AdminHeader.css';

const AdminHeader = ({ user }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const profileRef = useRef(null);
    const notificationRef = useRef(null);

    useEffect(() => {
        // Fetch notifications
        fetchNotifications();
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/notifications?limit=5`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setNotifications(data.data.notifications);
                setUnreadCount(data.data.unread_count);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/notifications/${notificationId}/read`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Update local state
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'new_order':
                return '🛒';
            case 'low_stock':
                return '📦';
            case 'new_inquiry':
                return '💬';
            case 'new_message':
                return '✉️';
            default:
                return '🔔';
        }
    };

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    const getUserInitials = () => {
        if (!user) return 'A';
        const first = user.first_name?.[0] || '';
        const last = user.last_name?.[0] || '';
        return (first + last).toUpperCase() || user.email?.[0]?.toUpperCase() || 'A';
    };

    const getUserDisplayName = () => {
        if (!user) return 'Admin';
        if (user.first_name && user.last_name) {
            return `${user.first_name} ${user.last_name}`;
        }
        return user.first_name || user.email || 'Admin';
    };

    const getRoleBadge = () => {
        if (!user) return '';
        return user.role === 'super_admin' ? 'Super Admin' : 'Content Manager';
    };

    return (
        <header className="admin-header">
            <div className="header-left">
                <button
                    className="mobile-menu-toggle"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <div className="search-box">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="search-input"
                    />
                </div>
            </div>

            <div className="header-right">
                {/* Notifications */}
                <div className="notification-container" ref={notificationRef}>
                    <button
                        className="notification-button"
                        onClick={() => setShowNotifications(!showNotifications)}
                        aria-label="Notifications"
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="notification-badge">{unreadCount}</span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="notification-dropdown">
                            <div className="notification-header">
                                <h3>Notifications</h3>
                                <span className="notification-count">{unreadCount} new</span>
                            </div>

                            <div className="notification-list">
                                {notifications.length === 0 ? (
                                    <div className="no-notifications">
                                        <p>No notifications</p>
                                    </div>
                                ) : (
                                    notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
                                            onClick={() => !notification.is_read && markAsRead(notification.id)}
                                        >
                                            <div className="notification-icon">
                                                {getNotificationIcon(notification.type)}
                                            </div>
                                            <div className="notification-content">
                                                <h4>{notification.title}</h4>
                                                <p>{notification.message}</p>
                                                <span className="notification-time">
                                                    {formatTimeAgo(notification.created_at)}
                                                </span>
                                            </div>
                                            {!notification.is_read && (
                                                <div className="unread-indicator"></div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="notification-footer">
                                <a href="/admin/notifications">View all notifications</a>
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile Dropdown */}
                <div className="profile-container" ref={profileRef}>
                    <button
                        className="profile-button"
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        aria-label="Profile menu"
                    >
                        <div className="profile-avatar">
                            {getUserInitials()}
                        </div>
                        <div className="profile-info">
                            <span className="profile-name">{getUserDisplayName()}</span>
                            <span className="profile-role">{getRoleBadge()}</span>
                        </div>
                        <ChevronDown size={16} className={`chevron ${showProfileMenu ? 'open' : ''}`} />
                    </button>

                    {showProfileMenu && (
                        <div className="profile-dropdown">
                            <div className="profile-dropdown-header">
                                <div className="profile-avatar large">
                                    {getUserInitials()}
                                </div>
                                <div className="profile-header-info">
                                    <span className="profile-header-name">{getUserDisplayName()}</span>
                                    <span className="profile-header-email">{user?.email}</span>
                                </div>
                            </div>

                            <div className="profile-dropdown-menu">
                                <button
                                    className="profile-menu-item"
                                    onClick={() => {
                                        setShowProfileMenu(false);
                                        navigate('/admin/profile');
                                    }}
                                >
                                    <User size={18} />
                                    <span>My Profile</span>
                                </button>

                                <button
                                    className="profile-menu-item"
                                    onClick={() => {
                                        setShowProfileMenu(false);
                                        navigate('/admin/settings');
                                    }}
                                >
                                    <Settings size={18} />
                                    <span>Settings</span>
                                </button>

                                <div className="profile-menu-divider"></div>

                                <button
                                    className="profile-menu-item logout"
                                    onClick={handleLogout}
                                >
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
