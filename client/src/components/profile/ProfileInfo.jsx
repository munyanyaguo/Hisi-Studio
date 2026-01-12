import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const ProfileInfo = () => {
    const { user, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
        phone: user?.phone || ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setMessage({ type: '', text: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        const result = await updateProfile(formData);

        if (result.success) {
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setIsEditing(false);
        } else {
            setMessage({ type: 'error', text: result.error || 'Failed to update profile' });
        }
        setLoading(false);
    };

    const handleCancel = () => {
        setFormData({
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            email: user?.email || '',
            phone: user?.phone || ''
        });
        setIsEditing(false);
        setMessage({ type: '', text: '' });
    };

    return (
        <div className="profile-info">
            <div className="profile-info-header">
                <h3>Personal Information</h3>
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="edit-button">
                        Edit Profile
                    </button>
                )}
            </div>

            {message.text && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}

            {isEditing ? (
                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="first_name">First Name</label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="last_name">Last Name</label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={handleCancel} className="cancel-button" disabled={loading}>
                            Cancel
                        </button>
                        <button type="submit" className="save-button" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="profile-display">
                    <div className="info-row">
                        <div className="info-item">
                            <label>First Name</label>
                            <p>{user?.first_name || 'Not provided'}</p>
                        </div>
                        <div className="info-item">
                            <label>Last Name</label>
                            <p>{user?.last_name || 'Not provided'}</p>
                        </div>
                    </div>

                    <div className="info-item">
                        <label>Email Address</label>
                        <p>{user?.email || 'Not provided'}</p>
                    </div>

                    <div className="info-item">
                        <label>Phone Number</label>
                        <p>{user?.phone || 'Not provided'}</p>
                    </div>

                    <div className="info-item">
                        <label>Account Created</label>
                        <p>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileInfo;
