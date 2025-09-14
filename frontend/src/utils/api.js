import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
                    refresh: refreshToken,
                });
                localStorage.setItem('access_token', response.data.access);
                return api(originalRequest);
            } catch (refreshError) {
                console.error('Refresh token failed:', refreshError);
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    register: (data) => api.post('/register/', data),
    activateUser: (uidb64, token) => api.get(`/activate_user/${uidb64}/${token}/`),
    changePassword: (data) => api.post('/change-password/', data),
};

export const workshopTypeAPI = {
    getWorkshopTypes: () => api.get('/workshop-types/'),
    getWorkshopTypeDetail: (id) => api.get(`/workshop-types/${id}/`),
    addWorkshopType: (data) => api.post('/workshop-types/', data),
    editWorkshopType: (id, data) => api.put(`/workshop-types/${id}/`, data),
    deleteWorkshopType: (id) => api.delete(`/workshop-types/${id}/`),
};

export const workshopAPI = {
    getWorkshops: () => api.get('/workshops/'),
    getWorkshopDetail: (id) => api.get(`/workshops/${id}/`),
    createWorkshop: (data) => api.post('/workshops/', data),
    editWorkshop: (id, data) => api.put(`/workshops/${id}/`, data),
    deleteWorkshop: (id) => api.delete(`/workshops/${id}/`),
    acceptWorkshop: (id) => api.post(`/workshops/${id}/accept/`),
    changeWorkshopDate: (id, data) => api.post(`/workshops/${id}/change-date/`, data),
    deleteAttachmentFile: (id) => api.delete(`/attachment-files/${id}/`),
    getPublicWorkshopStats: (params) => api.get('/public-workshop-stats/', { params }),
    getMyWorkshops: () => api.get('/my-workshops/'),
};

export const profileAPI = {
    getProfile: (id) => api.get(`/profiles/${id}/`),
    getOwnProfile: () => api.get('/profile/'),
    editProfile: (id, data) => api.put(`/profiles/${id}/`, data),
    getUsers: () => api.get('/users/'),
    getUserDetail: (id) => api.get(`/users/${id}/`),
};

export const teamAPI = {
    getTeamStats: (teamId) => api.get(teamId ? `/team-stats/${teamId}/` : '/team-stats/'),
    getTeams: () => api.get('/teams/'),
    getTeamDetail: (id) => api.get(`/teams/${id}/`),
    addTeam: (data) => api.post('/teams/', data),
    editTeam: (id, data) => api.put(`/teams/${id}/`, data),
    deleteTeam: (id) => api.delete(`/teams/${id}/`),
};

export default api;
