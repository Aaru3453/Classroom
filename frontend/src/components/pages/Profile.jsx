import React, { useState, useEffect } from 'react';
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [profileData, setProfileData] = useState({
    name: '',
    email: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    clearMessages();
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    clearMessages();
  };

  const clearMessages = () => {
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!profileData.name.trim()) {
      setError('Full name is required');
      setLoading(false);
      return;
    }

    if (!profileData.email.trim()) {
      setError('Email address is required');
      setLoading(false);
      return;
    }

    try {
      const result = await updateProfile(profileData);
      
      if (result.success) {
        setSuccess(result.message);
        setIsEditing(false);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('An error occurred while updating profile.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!passwordData.currentPassword) {
      setError('Current password is required');
      setLoading(false);
      return;
    }

    if (!passwordData.newPassword) {
      setError('New password is required');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Temporary implementation - simulate password change
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Password changed successfully. Please login again.');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 2000);

    } catch (error) {
      setError('An error occurred while changing password.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfileData({
      name: user?.name || '',
      email: user?.email || ''
    });
    clearMessages();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-16 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-blue-500 text-4xl mb-4"></i>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-16">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Manage your account information and security
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-lg">
                  <span className="text-white text-4xl font-bold">
                    {getInitials(user.name)}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 break-words">
                  {user.name || 'User Name'}
                </h2>
                <p className="text-gray-600 text-sm mt-1 break-words">
                  {user.email || 'user@example.com'}
                </p>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mt-2">
                  <i className="fas fa-user-tag mr-2 text-xs"></i>
                  {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <i className="fas fa-calendar-alt text-blue-500 mr-3"></i>
                    <span className="text-gray-700">Member since</span>
                  </div>
                  <span className="text-gray-900 font-medium">2024</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <i className="fas fa-shield-alt text-green-500 mr-3"></i>
                    <span className="text-gray-700">Status</span>
                  </div>
                  <span className="text-green-600 font-medium">Active</span>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-3 ${
                    activeTab === 'profile' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <i className="fas fa-user-circle w-5 text-center"></i>
                  <span>Profile Information</span>
                </button>

                <button
                  onClick={() => setActiveTab('password')}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-3 ${
                    activeTab === 'password' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <i className="fas fa-lock w-5 text-center"></i>
                  <span>Change Password</span>
                </button>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => navigate('/forgot-password')}
                    className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:text-blue-500 flex items-center space-x-2 mb-2"
                  >
                    <i className="fas fa-key w-4"></i>
                    <span>Forgot Password?</span>
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:text-red-500 flex items-center space-x-2"
                  >
                    <i className="fas fa-sign-out-alt w-4"></i>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                  <i className="fas fa-exclamation-circle text-red-500 mr-3 mt-0.5"></i>
                  <div>
                    <span className="text-red-700 text-sm font-medium">{error}</span>
                  </div>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
                  <i className="fas fa-check-circle text-green-500 mr-3 mt-0.5"></i>
                  <div>
                    <span className="text-green-700 text-sm font-medium">{success}</span>
                    {success.includes('Please login again') && (
                      <p className="text-green-600 text-xs mt-1">
                        Redirecting to login page...
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <i className="fas fa-user-circle text-blue-500 mr-3 text-lg"></i>
                      Personal Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-3">
                          Full Name *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="fas fa-user text-gray-400"></i>
                          </div>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            disabled={!isEditing}
                            className={`block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                              !isEditing ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : 'bg-white text-gray-900'
                            }`}
                            placeholder="Enter your full name"
                            value={profileData.name}
                            onChange={handleProfileChange}
                          />
                        </div>
                        {!isEditing && (
                          <p className="mt-1 text-xs text-gray-500">Enable edit mode to change</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-3">
                          Email Address *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="fas fa-envelope text-gray-400"></i>
                          </div>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            disabled={!isEditing}
                            className={`block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                              !isEditing ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : 'bg-white text-gray-900'
                            }`}
                            placeholder="Enter your email address"
                            value={profileData.email}
                            onChange={handleProfileChange}
                          />
                        </div>
                        {!isEditing && (
                          <p className="mt-1 text-xs text-gray-500">Enable edit mode to change</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                    {!isEditing ? (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="flex-1 flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        <i className="fas fa-edit mr-3"></i>
                        Edit Profile
                      </button>
                    ) : (
                      <>
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {loading ? (
                            <>
                              <i className="fas fa-spinner fa-spin mr-3"></i>
                              Saving...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-save mr-3"></i>
                              Save Changes
                            </>
                          )}
                        </button>
                        
                        <button
                          type="button"
                          onClick={handleCancel}
                          disabled={loading}
                          className="flex-1 flex justify-center items-center py-3 px-6 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                        >
                          <i className="fas fa-times mr-3"></i>
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </form>
              )}

              {activeTab === 'password' && (
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <i className="fas fa-lock text-blue-500 mr-3 text-lg"></i>
                      Change Password
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                      After changing your password, you will be automatically logged out and need to login again.
                    </p>
                    
                    <div className="space-y-6 max-w-2xl">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-3">
                          Current Password *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="fas fa-key text-gray-400"></i>
                          </div>
                          <input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            required
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Enter your current password"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-3">
                            New Password *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <i className="fas fa-lock text-gray-400"></i>
                            </div>
                            <input
                              id="newPassword"
                              name="newPassword"
                              type="password"
                              required
                              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="Enter new password"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                            />
                          </div>
                          <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
                        </div>

                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-3">
                            Confirm New Password *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <i className="fas fa-lock text-gray-400"></i>
                            </div>
                            <input
                              id="confirmPassword"
                              name="confirmPassword"
                              type="password"
                              required
                              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="Confirm new password"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-3"></i>
                          Changing Password...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-key mr-3"></i>
                          Change Password
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;