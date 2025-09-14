import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { department_choices, position_choices, source, states, title_choices } from '../utils/constants';

const ProfileForm = ({ profileData, onSave, onCancel }) => {
    const [formData, setFormData] = useState(profileData);

    useEffect(() => {
        setFormData(profileData);
    }, [profileData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" id="title" name="title" value={formData.title} onChange={handleChange}>
                    {title_choices.map(choice => (
                        <option key={choice[0]} value={choice[0]}>{choice[1]}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="institute" className="block text-sm font-medium text-gray-700">Institute</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" id="institute" name="institute" value={formData.institute} onChange={handleChange} required />
            </div>
            <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" id="department" name="department" value={formData.department} onChange={handleChange} required>
                    {department_choices.map(choice => (
                        <option key={choice[0]} value={choice[0]}>{choice[1]}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleChange} maxLength="10" pattern="^.{10}$" title="Phone number must be 10 digits" required />
            </div>
            <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700">Position</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" id="position" name="position" value={formData.position} onChange={handleChange}>
                    {position_choices.map(choice => (
                        <option key={choice[0]} value={choice[0]}>{choice[1]}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="how_did_you_hear_about_us" className="block text-sm font-medium text-gray-700">How did you hear about us?</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" id="how_did_you_hear_about_us" name="how_did_you_hear_about_us" value={formData.how_did_you_hear_about_us} onChange={handleChange}>
                    {source.map(choice => (
                        <option key={choice[0]} value={choice[0]}>{choice[1]}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location (Place/City)</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" id="location" name="location" value={formData.location} onChange={handleChange} />
            </div>
            <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" id="state" name="state" value={formData.state} onChange={handleChange} required>
                    {states.map(choice => (
                        <option key={choice[0]} value={choice[0]}>{choice[1]}</option>
                    ))}
                </select>
            </div>
            <div className="flex justify-end space-x-3">
                <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Save</button>
                <button type="button" className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={onCancel}>Cancel</button>
            </div>
        </form>
    );
};

export default ProfileForm; 