import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';

const ChangePasswordPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        old_password: '',
        new_password1: '',
        new_password2: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Validate passwords match
        if (formData.new_password1 !== formData.new_password2) {
            setError('New passwords do not match');
            setLoading(false);
            return;
        }

        // Validate password length
        if (formData.new_password1.length < 8) {
            setError('New password must be at least 8 characters long');
            setLoading(false);
            return;
        }

        try {
            await authAPI.changePassword(formData);
            setSuccess('Password changed successfully!');
            setFormData({
                old_password: '',
                new_password1: '',
                new_password2: ''
            });
            setTimeout(() => {
                navigate('/profile');
            }, 2000);
        } catch (error) {
            console.error('Error:', error);
            setError(error.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-600 text-xl mb-4">Please log in to change your password</div>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Change Password</h1>
                        <p className="text-gray-600">Update your account password</p>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="old_password" className="block text-sm font-medium text-gray-700 mb-2">
                                Current Password *
                            </label>
                            <input
                                type="password"
                                id="old_password"
                                name="old_password"
                                required
                                value={formData.old_password}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter your current password"
                            />
                        </div>

                        <div>
                            <label htmlFor="new_password1" className="block text-sm font-medium text-gray-700 mb-2">
                                New Password *
                            </label>
                            <input
                                type="password"
                                id="new_password1"
                                name="new_password1"
                                required
                                minLength="8"
                                value={formData.new_password1}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter your new password"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Password must be at least 8 characters long
                            </p>
                        </div>

                        <div>
                            <label htmlFor="new_password2" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm New Password *
                            </label>
                            <input
                                type="password"
                                id="new_password2"
                                name="new_password2"
                                required
                                minLength="8"
                                value={formData.new_password2}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Confirm your new password"
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => navigate('/profile')}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {loading ? 'Changing...' : 'Change Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordPage;
