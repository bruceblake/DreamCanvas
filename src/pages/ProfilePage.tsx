import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Navigate } from 'react-router-dom';
import { 
  IoPersonOutline, 
  IoMailOutline, 
  IoTicketOutline, 
  IoWalletOutline, 
  IoImageOutline,
  IoSettingsOutline,
  IoSaveOutline,
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline
} from 'react-icons/io5';
import { useAuth } from '../contexts/AuthContext';
import { updateUserProfile } from '../services/firebase';

const ProfilePage: React.FC = () => {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  
  const [displayName, setDisplayName] = useState(userData?.displayName || '');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!currentUser || !userData) {
    return <Navigate to="/login" />;
  }

  // Format date function
  const formatDate = (dateString: any) => {
    if (!dateString) return 'N/A';
    
    // If it's a Firebase timestamp
    if (dateString.toDate) {
      dateString = dateString.toDate();
    }
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleUpdateProfile = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    
    if (!displayName.trim()) {
      setError('Display name cannot be empty');
      setLoading(false);
      return;
    }
    
    try {
      const { success, error } = await updateUserProfile(currentUser.uid, {
        displayName: displayName.trim()
      });
      
      if (error) {
        setError(error);
      } else {
        setSuccess('Profile updated successfully');
        setIsEditing(false);
      }
    } catch (err: any) {
      setError('Failed to update profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          User Profile
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 lg:col-span-2"
            whileHover={{ y: -5, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)' }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Personal Information
              </h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                <IoSettingsOutline className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-sm">
                <div className="flex">
                  <IoAlertCircleOutline className="flex-shrink-0 w-5 h-5 mr-2" />
                  <p>{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-300 text-sm">
                <div className="flex">
                  <IoCheckmarkCircleOutline className="flex-shrink-0 w-5 h-5 mr-2" />
                  <p>{success}</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-4">
                  <IoPersonOutline className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-grow">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full py-2 px-3 mt-1 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  ) : (
                    <p className="font-medium text-gray-900 dark:text-white">{userData.displayName}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-4">
                  <IoMailOutline className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="font-medium text-gray-900 dark:text-white">{userData.email}</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-4">
                  <IoTicketOutline className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Membership Plan</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {userData.tier === 'FREE' && 'Free'}
                    {userData.tier === 'BASIC' && 'Basic'}
                    {userData.tier === 'PRO' && 'Professional'}
                    {userData.tier === 'UNLIMITED' && 'Enterprise'}
                    {!['FREE', 'BASIC', 'PRO', 'UNLIMITED'].includes(userData.tier) && 'Custom'}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mr-4">
                  <IoImageOutline className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Creations</p>
                  <p className="font-medium text-gray-900 dark:text-white">{userData.totalImages || 0}</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mr-4">
                  <IoWalletOutline className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDate(userData.createdAt)}
                  </p>
                </div>
              </div>

              {isEditing && (
                <div className="mt-6">
                  <motion.button
                    onClick={handleUpdateProfile}
                    disabled={loading}
                    className="flex items-center justify-center w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <IoSaveOutline className="mr-2" />
                        Save Changes
                      </>
                    )}
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Subscription & Tokens */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
            whileHover={{ y: -5, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)' }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Token Balance
            </h2>

            <div className="mb-6">
              <div className="text-center p-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                <p className="text-white text-sm mb-1">Available Tokens</p>
                <p className="text-white text-4xl font-bold">{userData.tokensRemaining}</p>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                  <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Used This Month</p>
                  <p className="text-gray-800 dark:text-gray-200 font-semibold">{userData.tokensUsed || 0}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                  <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Next Reset</p>
                  <p className="text-gray-800 dark:text-gray-200 font-semibold">
                    {userData.lastTokenReset 
                      ? (() => {
                          const lastReset = userData.lastTokenReset.toDate ? userData.lastTokenReset.toDate() : new Date(userData.lastTokenReset);
                          const nextReset = new Date(lastReset);
                          nextReset.setMonth(nextReset.getMonth() + 1);
                          
                          // Format as Month Day
                          return nextReset.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          });
                        })()
                      : 'N/A'
                    }
                  </p>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
              Need More Tokens?
            </h3>
            
            <motion.button
              onClick={() => navigate('/subscription')}
              className="flex items-center justify-center w-full py-2 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg transition-colors mb-4"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Upgrade Plan
            </motion.button>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Upgrade to get more tokens and premium features
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;