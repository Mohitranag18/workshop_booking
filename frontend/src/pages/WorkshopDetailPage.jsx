import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { workshopAPI } from '../utils/api';

const WorkshopDetailPage = () => {
    const { id } = useParams();
    const { user, isInstructor, isCoordinator } = useAuth();
    const navigate = useNavigate();
    const [workshop, setWorkshop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchWorkshop = async () => {
            try {
                const response = await workshopAPI.getWorkshopDetail(id);
                console.log('Workshop detail response:', response.data);
                setWorkshop(response.data);
            } catch (error) {
                setError('Failed to fetch workshop details');
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchWorkshop();
        }
    }, [id]);

    const handleAcceptWorkshop = async () => {
        if (!isInstructor()) return;
        
        try {
            await workshopAPI.acceptWorkshop(id);
            // Refresh the workshop data
            const response = await workshopAPI.getWorkshopDetail(id);
            setWorkshop(response.data);
        } catch (error) {
            console.error('Error accepting workshop:', error);
            alert('Failed to accept workshop');
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            0: { text: 'Pending', class: 'bg-yellow-100 text-yellow-800' },
            1: { text: 'Accepted', class: 'bg-green-100 text-green-800' },
            2: { text: 'Deleted', class: 'bg-red-100 text-red-800' }
        };
        const statusInfo = statusMap[status] || { text: 'Unknown', class: 'bg-gray-100 text-gray-800' };
        
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.class}`}>
                {statusInfo.text}
            </span>
        );
    };

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

    if (!workshop) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-gray-500 text-xl mb-4">Workshop not found</div>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                        Go Home
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
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{workshop.workshop_type?.name || 'Unknown Workshop'}</h1>
                                <p className="text-gray-600 mt-2">Workshop Details</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                {getStatusBadge(workshop.status)}
                                <button
                                    onClick={() => navigate(-1)}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Back
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Workshop Information */}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Workshop Information</h2>
                                <dl className="space-y-4">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Workshop Type</dt>
                                        <dd className="text-sm text-gray-900">{workshop.workshop_type?.name || 'N/A'}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Date</dt>
                                        <dd className="text-sm text-gray-900">
                                            {new Date(workshop.date).toLocaleDateString()}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Duration</dt>
                                        <dd className="text-sm text-gray-900">
                                            {workshop.workshop_type?.duration || 'N/A'} day(s)
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                                        <dd className="text-sm text-gray-900">
                                            {workshop.status === 0 ? 'Pending' : workshop.status === 1 ? 'Accepted' : 'Deleted'}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Terms Accepted</dt>
                                        <dd className="text-sm text-gray-900">
                                            {workshop.tnc_accepted ? 'Yes' : 'No'}
                                        </dd>
                                    </div>
                                </dl>
                            </div>

                            {/* People Information */}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">People</h2>
                                <dl className="space-y-4">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Coordinator</dt>
                                        <dd className="text-sm text-gray-900">
                                            {workshop.coordinator ? 
                                                `${workshop.coordinator.first_name} ${workshop.coordinator.last_name}` : 
                                                'N/A'
                                            }
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Coordinator Email</dt>
                                        <dd className="text-sm text-gray-900">{workshop.coordinator?.email || 'N/A'}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Instructor</dt>
                                        <dd className="text-sm text-gray-900">
                                            {workshop.instructor ? 
                                                `${workshop.instructor.first_name} ${workshop.instructor.last_name}` : 
                                                'Not assigned'
                                            }
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Instructor Email</dt>
                                        <dd className="text-sm text-gray-900">{workshop.instructor?.email || 'N/A'}</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>

                        {/* Workshop Description */}
                        {workshop.workshop_type?.description && (
                            <div className="mt-8">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
                                <div className="prose max-w-none">
                                    <p className="text-sm text-gray-900 whitespace-pre-wrap">
                                        {workshop.workshop_type.description}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Terms and Conditions */}
                        {workshop.workshop_type?.terms_and_conditions && (
                            <div className="mt-8">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Terms and Conditions</h2>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-900 whitespace-pre-wrap">
                                        {workshop.workshop_type.terms_and_conditions}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="mt-8 flex justify-center space-x-4">
                            {isInstructor() && workshop.status === 0 && (
                                <button
                                    onClick={handleAcceptWorkshop}
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                                >
                                    Accept Workshop
                                </button>
                            )}
                            
                            {isCoordinator() && workshop.coordinator?.id === user?.user_id && (
                                <Link
                                    to="/workshop/propose"
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    Propose Another Workshop
                                </Link>
                            )}
                            
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

export default WorkshopDetailPage;
