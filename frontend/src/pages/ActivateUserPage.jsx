import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';

const ActivateUserPage = () => {
    const { uidb64, token } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const activateUser = async () => {
            if (uidb64 && token) {
                try {
                    const response = await authAPI.activate(uidb64, token);
                    setMessage(response.data.message);
                    setTimeout(() => navigate('/login'), 3000);
                } catch (error) {
                    setMessage(error.response?.data?.message || 'Activation failed');
                } finally {
                    setLoading(false);
                }
            } else {
                setMessage('Invalid activation link');
                setLoading(false);
            }
        };

        activateUser();
    }, [uidb64, token, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Account Activation
                    </h2>
                    <div className="mt-8">
                        <div className={`px-4 py-3 rounded-md ${
                            message.includes('successfully') 
                                ? 'bg-green-100 border border-green-400 text-green-700' 
                                : 'bg-red-100 border border-red-400 text-red-700'
                        }`}>
                            {message}
                        </div>
                        {message.includes('successfully') && (
                            <p className="mt-4 text-sm text-gray-600">
                                Redirecting to login page...
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivateUserPage;
