import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, user, logout, isInstructor, isCoordinator } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
    };

    return (
        <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="text-lg sm:text-xl font-bold text-indigo-600">Workshop Portal</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
                        <Link
                            to="/"
                            className={`px-2 lg:px-3 py-2 rounded-md text-sm font-medium ${
                                isActive('/') 
                                    ? 'bg-indigo-100 text-indigo-700' 
                                    : 'text-gray-700 hover:text-indigo-600'
                            }`}
                        >
                            Home
                        </Link>
                        
                        <Link
                            to="/statistics/public"
                            className={`px-2 lg:px-3 py-2 rounded-md text-sm font-medium ${
                                isActive('/statistics/public') 
                                    ? 'bg-indigo-100 text-indigo-700' 
                                    : 'text-gray-700 hover:text-indigo-600'
                            }`}
                        >
                            Public Stats
                        </Link>

                        {isAuthenticated && (
                            <>
                                {isCoordinator() && (
                                    <>
                                        <Link
                                            to="/workshop/status"
                                            className={`px-2 lg:px-3 py-2 rounded-md text-sm font-medium ${
                                                isActive('/workshop/status') 
                                                    ? 'bg-indigo-100 text-indigo-700' 
                                                    : 'text-gray-700 hover:text-indigo-600'
                                            }`}
                                        >
                                            <span className="hidden lg:inline">My Workshops</span>
                                            <span className="lg:hidden">Workshops</span>
                                        </Link>
                                        <Link
                                            to="/workshop/propose"
                                            className={`px-2 lg:px-3 py-2 rounded-md text-sm font-medium ${
                                                isActive('/workshop/propose') 
                                                    ? 'bg-indigo-100 text-indigo-700' 
                                                    : 'text-gray-700 hover:text-indigo-600'
                                            }`}
                                        >
                                            <span className="hidden lg:inline">Propose Workshop</span>
                                            <span className="lg:hidden">Propose</span>
                                        </Link>
                                    </>
                                )}

                                {isInstructor() && (
                                    <>
                                        <Link
                                            to="/dashboard"
                                            className={`px-2 lg:px-3 py-2 rounded-md text-sm font-medium ${
                                                isActive('/dashboard') 
                                                    ? 'bg-indigo-100 text-indigo-700' 
                                                    : 'text-gray-700 hover:text-indigo-600'
                                            }`}
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            to="/workshop/types"
                                            className={`px-2 lg:px-3 py-2 rounded-md text-sm font-medium ${
                                                isActive('/workshop/types') 
                                                    ? 'bg-indigo-100 text-indigo-700' 
                                                    : 'text-gray-700 hover:text-indigo-600'
                                            }`}
                                        >
                                            <span className="hidden lg:inline">Workshop Types</span>
                                            <span className="lg:hidden">Types</span>
                                        </Link>
                                    </>
                                )}

                                <Link
                                    to="/profile"
                                    className={`px-2 lg:px-3 py-2 rounded-md text-sm font-medium ${
                                        isActive('/profile') 
                                            ? 'bg-indigo-100 text-indigo-700' 
                                            : 'text-gray-700 hover:text-indigo-600'
                                    }`}
                                >
                                    Profile
                                </Link>

                                <div className="relative group">
                                    <button className="flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600 px-2 lg:px-3 py-2 rounded-md">
                                        <span className="mr-1 truncate max-w-20 sm:max-w-none">
                                            {user?.first_name || user?.username}
                                        </span>
                                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            View Profile
                                        </Link>
                                        <Link
                                            to="/profile/edit"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Edit Profile
                                        </Link>
                                        <Link
                                            to="/change-password"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Change Password
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {!isAuthenticated && (
                            <>
                                <Link
                                    to="/login"
                                    className="px-2 lg:px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-2 lg:px-3 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                            aria-label="Toggle menu"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t shadow-lg">
                        <Link
                            to="/"
                            className={`block px-3 py-2 rounded-md text-base font-medium ${
                                isActive('/') 
                                    ? 'bg-indigo-100 text-indigo-700' 
                                    : 'text-gray-700 hover:text-indigo-600'
                            }`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </Link>
                        
                        <Link
                            to="/statistics/public"
                            className={`block px-3 py-2 rounded-md text-base font-medium ${
                                isActive('/statistics/public') 
                                    ? 'bg-indigo-100 text-indigo-700' 
                                    : 'text-gray-700 hover:text-indigo-600'
                            }`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Public Stats
                        </Link>

                        {isAuthenticated && (
                            <>
                                {isCoordinator() && (
                                    <>
                                        <Link
                                            to="/workshop/status"
                                            className={`block px-3 py-2 rounded-md text-base font-medium ${
                                                isActive('/workshop/status') 
                                                    ? 'bg-indigo-100 text-indigo-700' 
                                                    : 'text-gray-700 hover:text-indigo-600'
                                            }`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            My Workshops
                                        </Link>
                                        <Link
                                            to="/workshop/propose"
                                            className={`block px-3 py-2 rounded-md text-base font-medium ${
                                                isActive('/workshop/propose') 
                                                    ? 'bg-indigo-100 text-indigo-700' 
                                                    : 'text-gray-700 hover:text-indigo-600'
                                            }`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Propose Workshop
                                        </Link>
                                    </>
                                )}

                                {isInstructor() && (
                                    <>
                                        <Link
                                            to="/dashboard"
                                            className={`block px-3 py-2 rounded-md text-base font-medium ${
                                                isActive('/dashboard') 
                                                    ? 'bg-indigo-100 text-indigo-700' 
                                                    : 'text-gray-700 hover:text-indigo-600'
                                            }`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            to="/workshop/types"
                                            className={`block px-3 py-2 rounded-md text-base font-medium ${
                                                isActive('/workshop/types') 
                                                    ? 'bg-indigo-100 text-indigo-700' 
                                                    : 'text-gray-700 hover:text-indigo-600'
                                            }`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Workshop Types
                                        </Link>
                                    </>
                                )}

                                <div className="border-t border-gray-200 pt-2 mt-2">
                                    <div className="px-3 py-2 text-sm font-medium text-gray-500">
                                        {user?.first_name || user?.username}
                                    </div>
                                    <Link
                                        to="/profile"
                                        className={`block px-3 py-2 rounded-md text-base font-medium ${
                                            isActive('/profile') 
                                                ? 'bg-indigo-100 text-indigo-700' 
                                                : 'text-gray-700 hover:text-indigo-600'
                                        }`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        View Profile
                                    </Link>
                                    <Link
                                        to="/profile/edit"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Edit Profile
                                    </Link>
                                    <Link
                                        to="/change-password"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Change Password
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        )}

                        {!isAuthenticated && (
                            <>
                                <div className="border-t border-gray-200 pt-2 mt-2">
                                    <Link
                                        to="/login"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Register
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
