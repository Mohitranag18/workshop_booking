import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const WorkshopTypeForm = ({ initialData = {}, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: initialData.name || '',
        description: initialData.description || '',
        duration: initialData.duration || 1,
        terms_and_conditions: initialData.terms_and_conditions || '',
    });

    useEffect(() => {
        setFormData({
            name: initialData.name || '',
            description: initialData.description || '',
            duration: initialData.duration || 1,
            terms_and_conditions: initialData.terms_and_conditions || '',
        });
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" id="description" name="description" value={formData.description} onChange={handleChange} rows="5" required></textarea>
            </div>
            <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (days)</label>
                <input type="number" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" id="duration" name="duration" value={formData.duration} onChange={handleChange} min="1" required />
            </div>
            <div>
                <label htmlFor="terms_and_conditions" className="block text-sm font-medium text-gray-700">Terms and Conditions</label>
                <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" id="terms_and_conditions" name="terms_and_conditions" value={formData.terms_and_conditions} onChange={handleChange} rows="10" required></textarea>
            </div>
            <div className="flex justify-end space-x-3">
                <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Save</button>
                <button type="button" className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={onCancel}>Cancel</button>
            </div>
        </form>
    );
};

export default WorkshopTypeForm; 