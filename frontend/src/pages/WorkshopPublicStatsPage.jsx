import React, { useState, useEffect } from 'react';
import { workshopAPI } from '../utils/api';

const WorkshopPublicStatsPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await workshopAPI.getPublicWorkshopStats();
                console.log('Public stats response:', response.data);
                setStats(response.data);
            } catch (error) {
                setError('Failed to fetch statistics');
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Workshop Statistics</h1>
                    <p className="text-gray-600">Public statistics about workshops and their distribution</p>
                </div>

                {stats && (
                    <div className="space-y-8">
                        {/* Overview Stats */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

                        {/* Workshops List */}
                        {stats.workshops && stats.workshops.length > 0 && (
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Workshops</h2>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Workshop Type
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Duration
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Location
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {stats.workshops.map((workshop) => (
                                                <tr key={workshop.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {workshop.workshop_type?.name || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(workshop.date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {workshop.workshop_type?.duration || 'N/A'} day(s)
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {workshop.coordinator?.profile?.location || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            workshop.status === 1 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                            {workshop.status === 1 ? 'Accepted' : 'Pending'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* States Distribution */}
                        {stats.ws_states && stats.ws_states.length > 0 && (
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Workshops by State</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {stats.ws_states.map((state, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <span className="text-sm font-medium text-gray-900">{state}</span>
                                            <span className="text-sm text-gray-500">{stats.ws_count[index] || 0}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Workshop Types Distribution */}
                        {stats.ws_type && stats.ws_type.length > 0 && (
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Workshops by Type</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {stats.ws_type.map((type, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <span className="text-sm font-medium text-gray-900">{type}</span>
                                            <span className="text-sm text-gray-500">{stats.ws_type_count[index] || 0}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {(!stats || (!stats.workshops || stats.workshops.length === 0)) && (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-lg">No workshop statistics available</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkshopPublicStatsPage;
