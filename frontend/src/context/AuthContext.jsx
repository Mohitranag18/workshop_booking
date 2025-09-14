import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                setIsAuthenticated(true);
                setUser(decodedUser);
            } catch (error) {
                console.error('Token decode error:', error);
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            setLoading(true);
            const response = await api.post('/token/', { username, password });
            const data = response.data;

            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            
            const decodedUser = jwtDecode(data.access);
            setIsAuthenticated(true);
            setUser(decodedUser);
            navigate('/');
            return { success: true };
        } catch (error) {
            console.error('Login failed:', error);
            return { 
                success: false, 
                error: error.response?.data?.detail || 'Login failed' 
            };
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            setLoading(true);
            const response = await api.post('/register/', userData);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Registration failed:', error);
            return { 
                success: false, 
                error: error.response?.data || 'Registration failed' 
            };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsAuthenticated(false);
        setUser(null);
        navigate('/login');
    };

    const hasGroup = (groupName) => {
        return user && user.groups && user.groups.includes(groupName);
    };

    const hasPosition = (position) => {
        return user && user.position === position;
    };

    const isInstructor = () => hasGroup('instructor') || hasPosition('instructor');
    const isCoordinator = () => hasPosition('coordinator');

    return (
        <AuthContext.Provider value={{ 
            isAuthenticated, 
            user, 
            login, 
            register,
            logout, 
            hasGroup,
            hasPosition,
            isInstructor,
            isCoordinator,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
