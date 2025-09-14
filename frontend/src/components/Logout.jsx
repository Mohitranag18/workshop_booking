import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Logout = () => {
    const { logout } = useAuth();

    useEffect(() => {
        logout();
    }, [logout]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Logging out...</p>
            </div>
        </div>
    );
};

export default Logout;
