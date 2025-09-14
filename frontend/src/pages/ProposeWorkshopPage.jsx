import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { workshopAPI, workshopTypeAPI } from '../utils/api';

const ProposeWorkshopPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [workshopTypes, setWorkshopTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        workshop_type_id: '',
        date: '',
        tnc_accepted: false
    });

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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const response = await workshopAPI.createWorkshop(formData);
            setSuccess('Workshop proposed successfully!');
            setTimeout(() => {
                navigate('/workshop/status');
            }, 2000);
        } catch (error) {
            console.error('Error:', error);
            setError(error.response?.data?.message || 'Failed to propose workshop');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Propose a Workshop</h1>
                        <p className="text-gray-600">Submit a workshop proposal for instructor review</p>
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
                            <label htmlFor="workshop_type_id" className="block text-sm font-medium text-gray-700 mb-2">
                                Workshop Type *
                            </label>
                            <select
                                id="workshop_type_id"
                                name="workshop_type_id"
                                required
                                value={formData.workshop_type_id}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">Select a workshop type</option>
                                {workshopTypes.map((wt) => (
                                    <option key={wt.id} value={wt.id}>
                                        {wt.name} ({wt.duration} day{wt.duration > 1 ? 's' : ''})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                                Preferred Date *
                            </label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                required
                                min={new Date().toISOString().split('T')[0]}
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="tnc_accepted"
                                    name="tnc_accepted"
                                    type="checkbox"
                                    required
                                    checked={formData.tnc_accepted}
                                    onChange={handleChange}
                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="tnc_accepted" className="font-medium text-gray-700">
                                    I accept the terms and conditions *
                                </label>
                                <p className="text-gray-500">
                                    By checking this box, you agree to the workshop terms and conditions.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => navigate('/workshop/status')}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {submitting ? 'Submitting...' : 'Propose Workshop'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProposeWorkshopPage;
