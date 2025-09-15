import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Logout from './components/Logout';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import ActivateUserPage from './pages/ActivateUserPage';
import NotFoundPage from './pages/NotFoundPage';
import WorkshopPublicStatsPage from './pages/WorkshopPublicStatsPage';
import TeamStatsPage from './pages/TeamStatsPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import WorkshopTypeListPage from './pages/WorkshopTypeListPage';
import WorkshopTypeDetailPage from './pages/WorkshopTypeDetailPage';
import AddWorkshopTypePage from './pages/AddWorkshopTypePage';
import EditWorkshopTypePage from './pages/EditWorkshopTypePage';
import ProposeWorkshopPage from './pages/ProposeWorkshopPage';
import WorkshopStatusCoordinatorPage from './pages/WorkshopStatusCoordinatorPage';
import WorkshopStatusInstructorPage from './pages/WorkshopStatusInstructorPage';
import WorkshopDetailPage from './pages/WorkshopDetailPage';
import ViewProfilePage from './pages/ViewProfilePage';
import { AuthProvider, useAuth } from './context/AuthContext';

const AppContent = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-1 pt-16">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/page/:permalink" element={<HomePage />} />
                    <Route path="/statistics/public" element={<WorkshopPublicStatsPage />} />
                    {/* Protected Routes */}
                    {isAuthenticated && (
                        <>
                            <Route path="/statistics/team" element={<TeamStatsPage />} />
                            <Route path="/workshop/status" element={<WorkshopStatusCoordinatorPage />} />
                            <Route path="/dashboard" element={<WorkshopStatusInstructorPage />} />
                            <Route path="/workshop/propose" element={<ProposeWorkshopPage />} />
                            <Route path="/workshop/types" element={<WorkshopTypeListPage />} />
                            <Route path="/workshop/types/add" element={<AddWorkshopTypePage />} />
                            <Route path="/workshop/types/:id" element={<WorkshopTypeDetailPage />} />
                            <Route path="/workshop/types/edit/:id" element={<EditWorkshopTypePage />} />
                            <Route path="/workshop/details/:id" element={<WorkshopDetailPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/profile/edit" element={<EditProfilePage />} />
                            <Route path="/view-profile/:id" element={<ViewProfilePage />} />
                            <Route path="/change-password" element={<ChangePasswordPage />} />
                            <Route path="/logout" element={<Logout />} />
                        </>
                    )}
                    {/* Authentication Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/activate_user/:uidb64/:token" element={<ActivateUserPage />} />
                    <Route path="/activate_user" element={<ActivateUserPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </main>
            <footer className="bg-gray-800 text-white py-6 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-sm text-gray-300">Developed by FOSSEE group, IIT Bombay</p>
                        <p className="text-xs text-gray-400 mt-2">
                            © 2024 Workshop Booking Portal. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
}

export default App;
