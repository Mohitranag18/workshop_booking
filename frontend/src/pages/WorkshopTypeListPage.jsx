import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { workshopTypeAPI } from '../utils/api';

const WorkshopTypeListPage = () => {
    const { isAuthenticated, isInstructor } = useAuth();
    const [workshopTypes, setWorkshopTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchWorkshopTypes = async () => {
            try {
                const response = await workshopTypeAPI.getWorkshopTypes();
                setWorkshopTypes(response.data);
            } catch (error) {
                setError('Failed to fetch workshop types');
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWorkshopTypes();
    }, []);

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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Workshop Types</h1>
                    <p className="text-gray-600">Browse available workshop types and their details</p>
                </div>

                {isInstructor() && (
                    <div className="mb-6">
                        <Link
                            to="/workshop/types/add"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add New Workshop Type
                        </Link>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {workshopTypes.map((workshopType) => (
                        <div key={workshopType.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {workshopType.name}
                            </h3>
                            <p className="text-gray-600 mb-4 line-clamp-3">
                                {workshopType.description}
                            </p>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm text-indigo-600 font-medium">
                                    {workshopType.duration} day{workshopType.duration > 1 ? 's' : ''}
                                </span>
                                <span className="text-sm text-gray-500">
                                    ID: {workshopType.id}
                                </span>
                            </div>
                            <div className="flex space-x-2">
                                <Link
                                    to={`/workshop/types/${workshopType.id}`}
                                    className="flex-1 text-center px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 border border-indigo-600 rounded-md hover:bg-indigo-50"
                                >
                                    View Details
                                </Link>
                                {isInstructor() && (
                                    <Link
                                        to={`/workshop/types/edit/${workshopType.id}`}
                                        className="flex-1 text-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
                                    >
                                        Edit
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {workshopTypes.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-lg">No workshop types available</div>
                        {isInstructor() && (
                            <Link
                                to="/workshop/types/add"
                                className="mt-4 inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700"
                            >
                                Create First Workshop Type
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkshopTypeListPage;
