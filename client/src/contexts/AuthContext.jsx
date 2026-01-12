import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    // Check if user is logged in on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
            } catch (error) {
                console.error('Error parsing stored user:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                const { access_token, user: userData } = data;

                // Store token and user data
                localStorage.setItem('token', access_token);
                localStorage.setItem('user', JSON.stringify(userData));

                setToken(access_token);
                setUser(userData);

                return { success: true, user: userData };
            } else {
                return {
                    success: false,
                    error: data.message || 'Login failed'
                };
            }
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: 'Network error. Please try again.'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const isAuthenticated = () => {
        return !!token && !!user;
    };

    const isAdmin = () => {
        return user && ['super_admin', 'content_manager'].includes(user.role);
    };

    const isSuperAdmin = () => {
        return user && user.role === 'super_admin';
    };

    const isCustomer = () => {
        return user && user.role === 'customer';
    };

    const register = async (userData) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (response.ok) {
                const { access_token, user: newUser } = data;

                // Store token and user data
                localStorage.setItem('token', access_token);
                localStorage.setItem('user', JSON.stringify(newUser));

                setToken(access_token);
                setUser(newUser);

                return { success: true, user: newUser };
            } else {
                return {
                    success: false,
                    error: data.message || 'Registration failed'
                };
            }
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                error: 'Network error. Please try again.'
            };
        }
    };

    const updateProfile = async (profileData) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profileData),
            });

            const data = await response.json();

            if (response.ok) {
                const updatedUser = data.user || data.data;
                updateUser(updatedUser);
                return { success: true, user: updatedUser };
            } else {
                return {
                    success: false,
                    error: data.message || 'Profile update failed'
                };
            }
        } catch (error) {
            console.error('Profile update error:', error);
            return {
                success: false,
                error: 'Network error. Please try again.'
            };
        }
    };

    const changePassword = async (oldPassword, newPassword) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, message: data.message };
            } else {
                return {
                    success: false,
                    error: data.message || 'Password change failed'
                };
            }
        } catch (error) {
            console.error('Password change error:', error);
            return {
                success: false,
                error: 'Network error. Please try again.'
            };
        }
    };

    const value = {
        user,
        token,
        loading,
        login,
        logout,
        register,
        updateUser,
        updateProfile,
        changePassword,
        isAuthenticated,
        isAdmin,
        isSuperAdmin,
        isCustomer,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
