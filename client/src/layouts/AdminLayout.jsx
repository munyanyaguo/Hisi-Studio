import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import KeyboardShortcutsModal from '../components/admin/KeyboardShortcutsModal';
import { useAuth } from '../contexts/AuthContext';
import './AdminLayout.css';

const AdminLayout = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [showShortcuts, setShowShortcuts] = useState(false);
    const [shortcutsEnabled, setShortcutsEnabled] = useState(true);

    // Fetch settings to check if shortcuts are enabled
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/settings`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    const settings = data.data.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
                    // Check explicitly for 'false' string or boolean
                    if (settings.keyboardShortcuts === 'false' || settings.keyboardShortcuts === false) {
                        setShortcutsEnabled(false);
                    }
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
            }
        };

        if (user) {
            fetchSettings();
        }
    }, [user]);

    // Handle Global Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ignore if shortcuts disabled or user IS typing in an input/textarea/contenteditable
            if (!shortcutsEnabled) return;
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) || e.target.isContentEditable) {
                return;
            }

            // Ignore if modifiers are pressed (Ctrl, Alt, Meta) to avoid conflicting with browser shortcuts
            if (e.ctrlKey || e.altKey || e.metaKey) return;

            switch (e.key.toLowerCase()) {
                case 'd':
                    navigate('/admin/dashboard');
                    break;
                case 'o':
                    navigate('/admin/orders');
                    break;
                case 'm':
                    navigate('/admin/media');
                    break;
                case 'c':
                    navigate('/admin/content');
                    break;
                case 'p': // Added 'p' for Products based on user request context (though not in original list, it's standard)
                    navigate('/admin/products');
                    break;
                case 'i':
                    navigate('/admin/inquiries');
                    break;
                case 's':
                    navigate('/admin/settings');
                    break;
                case '?':
                    setShowShortcuts(prev => !prev);
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [navigate, shortcutsEnabled]);

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Redirect if not admin
    if (!user || (user.role !== 'super_admin' && user.role !== 'content_manager')) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="admin-layout">
            <AdminSidebar user={user} />
            <div className="admin-main">
                <AdminHeader user={user} />
                <main className="admin-content">
                    <Outlet />
                </main>
            </div>

            <KeyboardShortcutsModal
                isOpen={showShortcuts}
                onClose={() => setShowShortcuts(false)}
            />
        </div>
    );
};

export default AdminLayout;
