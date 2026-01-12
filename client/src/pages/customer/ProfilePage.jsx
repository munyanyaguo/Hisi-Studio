import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ProfileInfo from '../../components/profile/ProfileInfo';
import AccountSettings from '../../components/profile/AccountSettings';
import './ProfilePage.css';

const ProfilePage = () => {
    const { user, loading, isAuthenticated } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');

    if (loading) {
        return (
            <div className="profile-loading">
                <div className="loading-spinner"></div>
                <p>Loading profile...</p>
            </div>
        );
    }

    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-header">
                    <div className="profile-avatar">
                        <span>{user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}</span>
                    </div>
                    <div className="profile-header-info">
                        <h1>{user?.first_name} {user?.last_name}</h1>
                        <p>{user?.email}</p>
                    </div>
                </div>

                <div className="profile-tabs">
                    <button
                        className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        Profile Information
                    </button>
                    <button
                        className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        Order History
                    </button>
                    <button
                        className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        Account Settings
                    </button>
                </div>

                <div className="profile-content">
                    {activeTab === 'profile' && <ProfileInfo />}

                    {activeTab === 'orders' && (
                        <div className="orders-placeholder">
                            <h3>Order History</h3>
                            <p>You haven't placed any orders yet.</p>
                            <a href="/shop" className="shop-button">Start Shopping</a>
                        </div>
                    )}

                    {activeTab === 'settings' && <AccountSettings />}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
