import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    BarChart3,
    ShoppingCart,
    Package,
    Image,
    FileText,
    Users,
    MessageSquare,
    Settings,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    Layout,
    Star
} from 'lucide-react';
import './AdminSidebar.css';

const AdminSidebar = ({ user }) => {
    const [collapsed, setCollapsed] = useState(false);

    const isSuperAdmin = user?.role === 'super_admin';

    const menuItems = [
        {
            path: '/admin/dashboard',
            icon: LayoutDashboard,
            label: 'Dashboard',
            roles: ['super_admin', 'content_manager']
        },
        {
            path: '/admin/analytics',
            icon: BarChart3,
            label: 'Analytics',
            roles: ['super_admin']
        },
        {
            path: '/admin/orders',
            icon: ShoppingCart,
            label: 'Orders',
            roles: ['super_admin']
        },
        {
            path: '/admin/products',
            icon: Package,
            label: 'Products',
            roles: ['super_admin', 'content_manager']
        },
        {
            path: '/admin/media',
            icon: Image,
            label: 'Media Library',
            roles: ['super_admin', 'content_manager']
        },
        {
            path: '/admin/content',
            icon: FileText,
            label: 'Content',
            roles: ['super_admin', 'content_manager']
        },
        {
            path: '/admin/sections',
            icon: Layout,
            label: 'Sections',
            roles: ['super_admin', 'content_manager']
        },
        {
            path: '/admin/reviews',
            icon: Star,
            label: 'Reviews',
            roles: ['super_admin', 'content_manager']
        },
        {
            path: '/admin/customers',
            icon: Users,
            label: 'Customers',
            roles: ['super_admin']
        },
        {
            path: '/admin/inquiries',
            icon: MessageSquare,
            label: 'Inquiries',
            roles: ['super_admin', 'content_manager']
        },
        {
            path: '/admin/settings',
            icon: Settings,
            label: 'Settings',
            roles: ['super_admin', 'content_manager']
        },
        {
            path: '/',
            icon: ExternalLink,
            label: 'View Website',
            roles: ['super_admin', 'content_manager']
        }
    ];

    // Filter menu items based on user role
    const visibleMenuItems = menuItems.filter(item =>
        item.roles.includes(user?.role)
    );

    return (
        <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
            {/* ... header ... */}
            <div className="sidebar-header">
                {!collapsed && (
                    <>
                        <img
                            src="/images/hisi-logo-light.png"
                            alt="Hisi Studio"
                            className="h-12 w-auto mb-1"
                        />
                        <p className="sidebar-subtitle">Admin Panel</p>
                    </>
                )}
                <button
                    className="sidebar-toggle"
                    onClick={() => setCollapsed(!collapsed)}
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            <nav className="sidebar-nav">
                {visibleMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `sidebar-link ${isActive && item.path !== '/' ? 'active' : ''}`
                            }
                            title={collapsed ? item.label : ''}
                            end={item.path === '/'}
                        >
                            <Icon size={20} className="sidebar-icon" />
                            {!collapsed && <span className="sidebar-label">{item.label}</span>}
                        </NavLink>
                    );
                })}
            </nav>
            {/* ... footer ... */}
            <div className="sidebar-footer">
                <div className="user-info">
                    <div className="user-avatar">
                        {user?.first_name?.[0] || user?.email?.[0] || 'A'}
                    </div>
                    {!collapsed && (
                        <div className="user-details">
                            <p className="user-name">
                                {user?.first_name} {user?.last_name}
                            </p>
                            <p className="user-role">
                                {user?.role === 'super_admin' ? 'Super Admin' : 'Content Manager'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default AdminSidebar;
