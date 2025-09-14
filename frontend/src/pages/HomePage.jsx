import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { workshopTypeAPI, workshopAPI } from '../utils/api';

const HomePage = () => {
    const { isAuthenticated, user, isInstructor, isCoordinator } = useAuth();
    const [workshopTypes, setWorkshopTypes] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [workshopTypesResponse, statsResponse] = await Promise.all([
                    workshopTypeAPI.getWorkshopTypes(),
                    workshopAPI.getPublicWorkshopStats()
                ]);
                
                setWorkshopTypes(workshopTypesResponse.data.slice(0, 6)); // Show only first 6
                setStats(statsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">
                            Workshop Booking Portal
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-indigo-100">
                            Connect coordinators with instructors for educational workshops
                        </p>
                        {!isAuthenticated && (
                            <div className="space-x-4">
                                <Link
                                    to="/register"
                                    className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200"
                                >
                                    Get Started
                                </Link>
                                <Link
                                    to="/login"
                                    className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition duration-200"
                                >
                                    Login
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            {stats && (
                <div className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                            Workshop Statistics
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-indigo-600 mb-2">
                                    {stats.workshops?.length || 0}
                                </div>
                                <div className="text-gray-600">Upcoming Workshops</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-indigo-600 mb-2">
                                    {stats.ws_states?.length || 0}
                                </div>
                                <div className="text-gray-600">States Covered</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-indigo-600 mb-2">
                                    {stats.ws_type?.length || 0}
                                </div>
                                <div className="text-gray-600">Workshop Types</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Workshop Types Section */}
            <div className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                        Available Workshop Types
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {workshopTypes.map((workshopType) => (
                            <div key={workshopType.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {workshopType.name}
                                </h3>
                                <p className="text-gray-600 mb-4 line-clamp-3">
                                    {workshopType.description}
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-indigo-600 font-medium">
                                        {workshopType.duration} day{workshopType.duration > 1 ? 's' : ''}
                                    </span>
                                    <Link
                                        to={`/workshop/types/${workshopType.id}`}
                                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                                    >
                                        Learn More →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-8">
                        <Link
                            to="/workshop/types"
                            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200"
                        >
                            View All Workshop Types
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                        How It Works
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">For Coordinators</h3>
                            <p className="text-gray-600">
                                Register and propose workshops based on your institution's needs. 
                                Browse available instructors and workshop types.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">For Instructors</h3>
                            <p className="text-gray-600">
                                Create workshop types, manage your availability, and accept workshop requests 
                                from coordinators across the country.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Statistics & Analytics</h3>
                            <p className="text-gray-600">
                                Track workshop statistics, view geographical distribution, 
                                and analyze workshop types and trends.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            {!isAuthenticated && (
                <div className="bg-indigo-600 text-white py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold mb-4">
                            Ready to Get Started?
                        </h2>
                        <p className="text-xl mb-8 text-indigo-100">
                            Join our community of educators and institutions
                        </p>
                        <div className="space-x-4">
                            <Link
                                to="/register"
                                className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200"
                            >
                                Register Now
                            </Link>
                            <Link
                                to="/statistics/public"
                                className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition duration-200"
                            >
                                View Statistics
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;
