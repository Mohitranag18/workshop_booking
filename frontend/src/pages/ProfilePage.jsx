import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { profileAPI } from '../utils/api';

const ProfilePage = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            
            try {
                // Try to get profile by user ID
                const response = await profileAPI.getProfile(user.user_id);
                console.log('Profile response:', response.data);
                setProfile(response.data);
            } catch (error) {
                console.error('Error fetching profile:', error);
                // If profile doesn't exist, create a basic one from user data
                setProfile({
                    user: user,
                    title: 'Mr',
                    institute: 'Not specified',
                    department: 'Not specified',
                    phone_number: 'Not specified',
                    position: user.position || 'Not specified',
                    location: 'Not specified',
                    state: 'Not specified',
                    how_did_you_hear_about_us: 'Not specified'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-600 text-xl mb-4">{error}</div>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                        <p className="text-gray-600">View and manage your profile information</p>
                    </div>

                    {profile && (
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Personal Information */}
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
                                    <dl className="space-y-3">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Name</dt>
                                            <dd className="text-sm text-gray-900">
                                                {profile.user?.first_name} {profile.user?.last_name}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Email</dt>
                                            <dd className="text-sm text-gray-900">{profile.user?.email}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Username</dt>
                                            <dd className="text-sm text-gray-900">{profile.user?.username}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Title</dt>
                                            <dd className="text-sm text-gray-900">{profile.title || 'Not specified'}</dd>
                                        </div>
                                    </dl>
                                </div>

                                {/* Professional Information */}
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h2>
                                    <dl className="space-y-3">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Position</dt>
                                            <dd className="text-sm text-gray-900">{profile.position || 'Not specified'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Institute</dt>
                                            <dd className="text-sm text-gray-900">{profile.institute || 'Not specified'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Department</dt>
                                            <dd className="text-sm text-gray-900">{profile.department || 'Not specified'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                                            <dd className="text-sm text-gray-900">{profile.phone_number || 'Not specified'}</dd>
                                        </div>
                                    </dl>
                                </div>

                                {/* Location Information */}
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Location Information</h2>
                                    <dl className="space-y-3">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Location</dt>
                                            <dd className="text-sm text-gray-900">{profile.location || 'Not specified'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">State</dt>
                                            <dd className="text-sm text-gray-900">{profile.state || 'Not specified'}</dd>
                                        </div>
                                    </dl>
                                </div>

                                {/* Additional Information */}
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
                                    <dl className="space-y-3">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">How did you hear about us?</dt>
                                            <dd className="text-sm text-gray-900">{profile.how_did_you_hear_about_us || 'Not specified'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">User Groups</dt>
                                            <dd className="text-sm text-gray-900">
                                                {profile.user?.groups && profile.user.groups.length > 0 
                                                    ? profile.user.groups.join(', ') 
                                                    : 'No groups assigned'
                                                }
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-8 flex justify-end space-x-4">
                                <Link
                                    to="/profile/edit"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    Edit Profile
                                </Link>
                                <Link
                                    to="/change-password"
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Change Password
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
