import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { workshopAPI } from '../utils/api';

const WorkshopStatusInstructorPage = () => {
    const { user } = useAuth();
    const [workshops, setWorkshops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchWorkshops = async () => {
            try {
                const response = await workshopAPI.getWorkshops();
                // Filter workshops for current user as instructor or pending workshops
                const instructorWorkshops = response.data.filter(ws => 
                    (ws.instructor && ws.instructor.id === user?.user_id) || 
                    (ws.status === 0) // Pending workshops that can be accepted
                );
                setWorkshops(instructorWorkshops);
            } catch (error) {
                setError('Failed to fetch workshops');
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchWorkshops();
        }
    }, [user]);

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

    const handleAcceptWorkshop = async (workshopId) => {
        try {
            await workshopAPI.acceptWorkshop(workshopId);
            // Refresh the workshops list
            window.location.reload();
        } catch (error) {
            console.error('Error accepting workshop:', error);
            alert('Failed to accept workshop');
        }
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

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Instructor Dashboard</h1>
                    <p className="text-gray-600">Manage your workshops and view pending requests</p>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    {workshops.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {workshops.map((workshop) => (
                                <li key={workshop.id} className="px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-medium text-gray-900">
                                                    {workshop.workshop_type?.name || 'Unknown Workshop Type'}
                                                </h3>
                                                {getStatusBadge(workshop.status)}
                                            </div>
                                            <div className="mt-2 text-sm text-gray-500">
                                                <p><strong>Date:</strong> {new Date(workshop.date).toLocaleDateString()}</p>
                                                <p><strong>Duration:</strong> {workshop.workshop_type?.duration || 'N/A'} day(s)</p>
                                                <p><strong>Coordinator:</strong> {workshop.coordinator?.first_name} {workshop.coordinator?.last_name}</p>
                                                <p><strong>Institute:</strong> {workshop.coordinator?.profile?.institute || 'N/A'}</p>
                                                <p><strong>Location:</strong> {workshop.coordinator?.profile?.location || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="ml-4 flex-shrink-0 flex space-x-2">
                                            {workshop.status === 0 && (
                                                <button
                                                    onClick={() => handleAcceptWorkshop(workshop.id)}
                                                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                                                >
                                                    Accept
                                                </button>
                                            )}
                                            <Link
                                                to={`/workshop/details/${workshop.id}`}
                                                className="text-indigo-600 hover:text-indigo-900 font-medium"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-gray-500 text-lg">No workshops found</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorkshopStatusInstructorPage;
