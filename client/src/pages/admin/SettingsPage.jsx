import React, { useState, useEffect } from 'react';
import { Bell, Mail, Settings as SettingsIcon, Type, Keyboard, Eye } from 'lucide-react';
import './SettingsPage.css';

const SettingsPage = () => {
    const [settings, setSettings] = useState({
        fontSize: 'medium',
        emailNotifications: true,
        pushNotifications: true,
        orderNotifications: true,
        inquiryNotifications: true,
        lowStockAlerts: true,
        highContrast: false,
        keyboardShortcuts: true
    });

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/admin/settings`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                if (data.data) {
                    setSettings({ ...settings, ...data.data });
                }
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    };

    const saveSettings = async () => {
        try {
            setSaving(true);
            const token = localStorage.getItem('token');

            await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/admin/settings`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(settings)
                }
            );

            // Apply font size immediately
            document.documentElement.style.fontSize =
                settings.fontSize === 'small' ? '14px' :
                    settings.fontSize === 'large' ? '18px' : '16px';

            // Apply high contrast
            if (settings.highContrast) {
                document.body.classList.add('high-contrast');
            } else {
                document.body.classList.remove('high-contrast');
            }

            alert('Settings saved successfully!');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (key, value) => {
        setSettings({ ...settings, [key]: value });
    };

    return (
        <div className="settings-page">
            <div className="page-header">
                <div>
                    <h1>Settings</h1>
                    <p className="page-subtitle">Configure your admin preferences</p>
                </div>
                <button
                    className="btn-primary"
                    onClick={saveSettings}
                    disabled={saving}
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="settings-sections">
                {/* Accessibility Settings */}
                <div className="settings-section">
                    <div className="section-header">
                        <Eye size={24} className="section-icon" />
                        <div>
                            <h2>Accessibility</h2>
                            <p>Customize display and interaction preferences</p>
                        </div>
                    </div>

                    <div className="settings-group">
                        <div className="setting-item">
                            <div className="setting-info">
                                <Type size={18} />
                                <div>
                                    <h3>Font Size</h3>
                                    <p>Adjust text size for better readability</p>
                                </div>
                            </div>
                            <select
                                value={settings.fontSize}
                                onChange={(e) => handleChange('fontSize', e.target.value)}
                                className="setting-select"
                            >
                                <option value="small">Small</option>
                                <option value="medium">Medium</option>
                                <option value="large">Large</option>
                            </select>
                        </div>

                        <div className="setting-item">
                            <div className="setting-info">
                                <Eye size={18} />
                                <div>
                                    <h3>High Contrast Mode</h3>
                                    <p>Increase contrast for better visibility</p>
                                </div>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={settings.highContrast}
                                    onChange={(e) => handleChange('highContrast', e.target.checked)}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>

                        <div className="setting-item">
                            <div className="setting-info">
                                <Keyboard size={18} />
                                <div>
                                    <h3>Keyboard Shortcuts</h3>
                                    <p>Enable keyboard navigation shortcuts</p>
                                </div>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={settings.keyboardShortcuts}
                                    onChange={(e) => handleChange('keyboardShortcuts', e.target.checked)}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="settings-section">
                    <div className="section-header">
                        <Bell size={24} className="section-icon" />
                        <div>
                            <h2>Notifications</h2>
                            <p>Manage how you receive notifications</p>
                        </div>
                    </div>

                    <div className="settings-group">
                        <div className="setting-item">
                            <div className="setting-info">
                                <Mail size={18} />
                                <div>
                                    <h3>Email Notifications</h3>
                                    <p>Receive notifications via email</p>
                                </div>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={settings.emailNotifications}
                                    onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>

                        <div className="setting-item">
                            <div className="setting-info">
                                <Bell size={18} />
                                <div>
                                    <h3>Push Notifications</h3>
                                    <p>Receive in-app push notifications</p>
                                </div>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={settings.pushNotifications}
                                    onChange={(e) => handleChange('pushNotifications', e.target.checked)}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>

                        <div className="setting-item">
                            <div className="setting-info">
                                <SettingsIcon size={18} />
                                <div>
                                    <h3>Order Notifications</h3>
                                    <p>Get notified about new orders</p>
                                </div>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={settings.orderNotifications}
                                    onChange={(e) => handleChange('orderNotifications', e.target.checked)}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>

                        <div className="setting-item">
                            <div className="setting-info">
                                <SettingsIcon size={18} />
                                <div>
                                    <h3>Inquiry Notifications</h3>
                                    <p>Get notified about new customer inquiries</p>
                                </div>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={settings.inquiryNotifications}
                                    onChange={(e) => handleChange('inquiryNotifications', e.target.checked)}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>

                        <div className="setting-item">
                            <div className="setting-info">
                                <SettingsIcon size={18} />
                                <div>
                                    <h3>Low Stock Alerts</h3>
                                    <p>Get notified when products are low in stock</p>
                                </div>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={settings.lowStockAlerts}
                                    onChange={(e) => handleChange('lowStockAlerts', e.target.checked)}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Keyboard Shortcuts Reference */}
                {settings.keyboardShortcuts && (
                    <div className="settings-section">
                        <div className="section-header">
                            <Keyboard size={24} className="section-icon" />
                            <div>
                                <h2>Keyboard Shortcuts</h2>
                                <p>Quick reference for keyboard navigation</p>
                            </div>
                        </div>

                        <div className="shortcuts-grid">
                            <div className="shortcut-item">
                                <kbd>D</kbd>
                                <span>Dashboard</span>
                            </div>
                            <div className="shortcut-item">
                                <kbd>O</kbd>
                                <span>Orders</span>
                            </div>
                            <div className="shortcut-item">
                                <kbd>M</kbd>
                                <span>Media</span>
                            </div>
                            <div className="shortcut-item">
                                <kbd>C</kbd>
                                <span>Content</span>
                            </div>
                            <div className="shortcut-item">
                                <kbd>I</kbd>
                                <span>Inquiries</span>
                            </div>
                            <div className="shortcut-item">
                                <kbd>S</kbd>
                                <span>Settings</span>
                            </div>
                            <div className="shortcut-item">
                                <kbd>?</kbd>
                                <span>Show shortcuts</span>
                            </div>
                            <div className="shortcut-item">
                                <kbd>Esc</kbd>
                                <span>Close modal</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingsPage;
