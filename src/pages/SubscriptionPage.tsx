import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoCheckmarkCircleOutline, 
  IoCloseCircleOutline, 
  IoFlashOutline, 
  IoImageOutline, 
  IoColorPaletteOutline, 
  IoRocketOutline,
  IoAlertCircleOutline
} from 'react-icons/io5';
import { useAuth } from '../contexts/AuthContext';
import { SUBSCRIPTION_TIERS, updateUserSubscription } from '../services/firebase';

const SubscriptionPage: React.FC = () => {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  
  if (!currentUser || !userData) {
    return <Navigate to="/login" />;
  }
  
  const handleTierSelect = (tier: string) => {
    setSelectedTier(tier);
    setError(null);
  };
  
  const handleContinue = () => {
    if (!selectedTier) {
      setError('Please select a subscription plan');
      return;
    }
    
    setShowConfirmation(true);
  };
  
  const handleConfirmSubscription = async () => {
    if (!selectedTier) return;
    
    setProcessingPayment(true);
    setError(null);
    
    // Add payment processing logic here in a real app
    // This is a simplified mock implementation
    
    try {
      // Wait for 1.5 seconds to simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update user's subscription plan
      const { success, error } = await updateUserSubscription(currentUser.uid, selectedTier);
      
      if (error) {
        setError(error);
        setProcessingPayment(false);
      } else {
        // Redirect to profile page after successful subscription
        navigate('/profile', { state: { subscriptionUpdated: true }});
      }
    } catch (err: any) {
      setError('Failed to process payment: ' + err.message);
      setProcessingPayment(false);
    }
  };
  
  const handleGoBack = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <AnimatePresence mode="wait">
        {!showConfirmation ? (
          <motion.div
            key="subscription-selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Choose Your Plan
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl">
              Select the plan that works best for you. All plans include access to our AI image generation technology with 
              varying levels of features and token allocation.
            </p>

            {error && (
              <div className="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-sm">
                <div className="flex">
                  <IoAlertCircleOutline className="flex-shrink-0 w-5 h-5 mr-2" />
                  <p>{error}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Free Plan */}
              <PlanCard
                name="Free"
                price={0}
                description="Perfect for casual users and beginners"
                features={SUBSCRIPTION_TIERS.FREE.features}
                icon={<IoFlashOutline className="w-6 h-6" />}
                color="blue"
                selected={selectedTier === 'FREE'}
                current={userData.tier === 'FREE'}
                onClick={() => handleTierSelect('FREE')}
              />

              {/* Basic Plan */}
              <PlanCard
                name="Basic"
                price={SUBSCRIPTION_TIERS.BASIC.price}
                description="Great for hobbyists and enthusiasts"
                features={SUBSCRIPTION_TIERS.BASIC.features}
                icon={<IoImageOutline className="w-6 h-6" />}
                color="purple"
                popular={true}
                selected={selectedTier === 'BASIC'}
                current={userData.tier === 'BASIC'}
                onClick={() => handleTierSelect('BASIC')}
              />

              {/* Professional Plan */}
              <PlanCard
                name="Professional"
                price={SUBSCRIPTION_TIERS.PRO.price}
                description="Ideal for content creators and artists"
                features={SUBSCRIPTION_TIERS.PRO.features}
                icon={<IoColorPaletteOutline className="w-6 h-6" />}
                color="pink"
                selected={selectedTier === 'PRO'}
                current={userData.tier === 'PRO'}
                onClick={() => handleTierSelect('PRO')}
              />

              {/* Enterprise Plan */}
              <PlanCard
                name="Enterprise"
                price={SUBSCRIPTION_TIERS.UNLIMITED.price}
                description="For professionals and businesses"
                features={SUBSCRIPTION_TIERS.UNLIMITED.features}
                icon={<IoRocketOutline className="w-6 h-6" />}
                color="amber"
                selected={selectedTier === 'UNLIMITED'}
                current={userData.tier === 'UNLIMITED'}
                onClick={() => handleTierSelect('UNLIMITED')}
              />
            </div>

            <div className="mt-10 flex justify-end">
              <motion.button
                onClick={() => navigate(-1)}
                className="px-6 py-2 mr-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleContinue}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
              >
                Continue
              </motion.button>
            </div>

            <div className="mt-8 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
              <p>
                * All subscriptions automatically renew monthly. You can cancel anytime.
                Unused tokens will roll over to the next month, up to 3x your monthly allocation.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="subscription-confirmation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">
              Confirm Your Subscription
            </h1>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-6">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedTier === 'FREE' && 'Free Plan'}
                    {selectedTier === 'BASIC' && 'Basic Plan'}
                    {selectedTier === 'PRO' && 'Professional Plan'}
                    {selectedTier === 'UNLIMITED' && 'Enterprise Plan'}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Monthly subscription
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    ${selectedTier && SUBSCRIPTION_TIERS[selectedTier as keyof typeof SUBSCRIPTION_TIERS].price.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">per month</p>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Plan includes:</h3>
                <ul className="space-y-2">
                  {selectedTier && SUBSCRIPTION_TIERS[selectedTier as keyof typeof SUBSCRIPTION_TIERS].features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <IoCheckmarkCircleOutline className="flex-shrink-0 w-5 h-5 text-green-500 mr-2 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                  <span className="text-gray-900 dark:text-white">
                    ${selectedTier && SUBSCRIPTION_TIERS[selectedTier as keyof typeof SUBSCRIPTION_TIERS].price.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Tax</span>
                  <span className="text-gray-900 dark:text-white">$0.00</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-600 my-2 pt-2 flex justify-between font-semibold">
                  <span className="text-gray-800 dark:text-gray-200">Total due today</span>
                  <span className="text-gray-900 dark:text-white">
                    ${selectedTier && SUBSCRIPTION_TIERS[selectedTier as keyof typeof SUBSCRIPTION_TIERS].price.toFixed(2)}
                  </span>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-sm">
                  <div className="flex">
                    <IoAlertCircleOutline className="flex-shrink-0 w-5 h-5 mr-2" />
                    <p>{error}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col space-y-3">
                <motion.button
                  onClick={handleConfirmSubscription}
                  className="w-full flex justify-center items-center py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={processingPayment}
                >
                  {processingPayment ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing Payment...
                    </>
                  ) : (
                    'Confirm and Pay'
                  )}
                </motion.button>
                <motion.button
                  onClick={handleGoBack}
                  className="w-full py-2 text-gray-700 dark:text-gray-300 font-medium border border-gray-300 dark:border-gray-600 rounded-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={processingPayment}
                >
                  Go Back
                </motion.button>
              </div>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              By clicking "Confirm and Pay", you agree to our Terms of Service and authorize
              DreamCanvas to charge your payment method on a recurring basis. You can cancel
              anytime from your profile settings.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface PlanCardProps {
  name: string;
  price: number;
  description: string;
  features: string[];
  icon: React.ReactNode;
  color: 'blue' | 'purple' | 'pink' | 'amber';
  popular?: boolean;
  selected: boolean;
  current: boolean;
  onClick: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ 
  name, 
  price, 
  description, 
  features, 
  icon, 
  color, 
  popular, 
  selected,
  current,
  onClick 
}) => {
  // Define color schemes based on the color prop
  const colorSchemes = {
    blue: {
      gradient: 'from-blue-500 to-blue-600',
      hoverGradient: 'from-blue-600 to-blue-700',
      light: 'bg-blue-100 dark:bg-blue-900/20',
      icon: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800/50',
      selectedBorder: 'border-blue-500 dark:border-blue-400'
    },
    purple: {
      gradient: 'from-purple-500 to-purple-600',
      hoverGradient: 'from-purple-600 to-purple-700',
      light: 'bg-purple-100 dark:bg-purple-900/20',
      icon: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-200 dark:border-purple-800/50',
      selectedBorder: 'border-purple-500 dark:border-purple-400'
    },
    pink: {
      gradient: 'from-pink-500 to-pink-600',
      hoverGradient: 'from-pink-600 to-pink-700',
      light: 'bg-pink-100 dark:bg-pink-900/20',
      icon: 'text-pink-600 dark:text-pink-400',
      border: 'border-pink-200 dark:border-pink-800/50',
      selectedBorder: 'border-pink-500 dark:border-pink-400'
    },
    amber: {
      gradient: 'from-amber-500 to-amber-600',
      hoverGradient: 'from-amber-600 to-amber-700',
      light: 'bg-amber-100 dark:bg-amber-900/20',
      icon: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-800/50',
      selectedBorder: 'border-amber-500 dark:border-amber-400'
    }
  };
  
  const scheme = colorSchemes[color];
  
  return (
    <motion.div
      className={`
        relative bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 
        border-2 ${selected ? scheme.selectedBorder : 'border-gray-200 dark:border-gray-700'}
        transition-colors duration-200
      `}
      whileHover={{ y: -5, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)' }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${scheme.gradient}`}>
            Most Popular
          </div>
        </div>
      )}
      
      {current && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600">
            Current Plan
          </div>
        </div>
      )}
      
      <div className={`${scheme.light} w-12 h-12 rounded-full flex items-center justify-center mb-4 ${scheme.icon}`}>
        {icon}
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{name}</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">{description}</p>
      
      <div className="mb-4">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">${price.toFixed(2)}</span>
        <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">/month</span>
      </div>
      
      <div className="mb-6 space-y-2">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start">
            <IoCheckmarkCircleOutline className={`flex-shrink-0 w-5 h-5 ${scheme.icon} mr-2 mt-0.5`} />
            <span className="text-gray-600 dark:text-gray-300 text-sm">{feature}</span>
          </div>
        ))}
      </div>
      
      <button 
        className={`
          w-full py-2 rounded-lg font-medium transition-colors 
          ${selected 
            ? `bg-gradient-to-r ${scheme.gradient} text-white` 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
          }
        `}
      >
        {selected ? 'Selected' : (current ? 'Current Plan' : 'Select Plan')}
      </button>
    </motion.div>
  );
};

export default SubscriptionPage;