import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { workshopTypeAPI } from '../utils/api';

const WorkshopTypeDetailPage = () => {
    const { id } = useParams();
    const { isInstructor } = useAuth();
    const [workshopType, setWorkshopType] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchWorkshopType = async () => {
            try {
                const response = await workshopTypeAPI.getWorkshopTypeDetail(id);
                console.log('Workshop type response:', response.data);
                setWorkshopType(response.data);
            } catch (error) {
                setError('Failed to fetch workshop type details');
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchWorkshopType();
        }
    }, [id]);

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

    if (!workshopType) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-gray-500 text-xl mb-4">Workshop type not found</div>
                    <Link
                        to="/workshop/types"
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                        Back to Workshop Types
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{workshopType.name}</h1>
                                <p className="text-gray-600 mt-2">Workshop Type Details</p>
                            </div>
                            <div className="flex space-x-3">
                                {isInstructor() && (
                                    <Link
                                        to={`/workshop/types/edit/${workshopType.id}`}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                    >
                                        Edit Workshop Type
                                    </Link>
                                )}
                                <Link
                                    to="/workshop/types"
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Back to List
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Basic Information */}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
                                <dl className="space-y-4">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Name</dt>
                                        <dd className="text-sm text-gray-900">{workshopType.name}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Duration</dt>
                                        <dd className="text-sm text-gray-900">
                                            {workshopType.duration} day{workshopType.duration > 1 ? 's' : ''}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Workshop Type ID</dt>
                                        <dd className="text-sm text-gray-900">{workshopType.id}</dd>
                                    </div>
                                </dl>
                            </div>

                            {/* Description */}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
                                <div className="prose max-w-none">
                                    <p className="text-sm text-gray-900 whitespace-pre-wrap">
                                        {workshopType.description || 'No description available.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Terms and Conditions */}
                        {workshopType.terms_and_conditions && (
                            <div className="mt-8">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Terms and Conditions</h2>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-900 whitespace-pre-wrap">
                                        {workshopType.terms_and_conditions}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="mt-8 flex justify-center space-x-4">
                            <Link
                                to="/workshop/propose"
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Propose This Workshop
                            </Link>
                            <Link
                                to="/workshop/types"
                                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                View All Workshop Types
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkshopTypeDetailPage;
