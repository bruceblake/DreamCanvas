import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { 
  auth,
  onAuthStateChange,
  getUserData,
  registerUser,
  loginUser,
  loginWithGoogle as firebaseLoginWithGoogle,
  logoutUser,
  resetPassword as firebaseResetPassword,
  createUserDocument,
  checkAndResetMonthlyTokens,
  SUBSCRIPTION_TIERS,
  serverTimestamp
} from '../services/firebase';

export interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  tier: keyof typeof SUBSCRIPTION_TIERS;
  tokensRemaining: number;
  tokensUsed: number;
  totalImages: number;
  createdAt: any;
  lastTokenReset: any;
}

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  isLoading: boolean;
  error: string | null;
  checkingSession: boolean;
  register: (email: string, password: string, name: string) => Promise<{ user: User | null; error: string | null }>;
  login: (email: string, password: string) => Promise<{ user: User | null; error: string | null }>;
  loginWithGoogle: () => Promise<{ user: User | null; error: string | null }>;
  logout: () => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState<boolean>(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChange(async (user) => {
      console.log("Auth state changed:", user?.email);
      setCurrentUser(user);
      setCheckingSession(false);
      
      if (user) {
        // Set a maximum retry count for creating user document
        const MAX_RETRIES = 3;
        let retryCount = 0;
        let success = false;
        
        while (retryCount < MAX_RETRIES && !success) {
          try {
            console.log(`Loading user data (attempt ${retryCount + 1})`);
            // First, check if user document exists
            const { userData: userDoc, error: userError } = await getUserData(user.uid);
            
            if (userError) {
              console.error('Error fetching user data:', userError);
              
              // If error is "User not found", try to create the user document
              if (userError === 'User not found') {
                console.log("Creating user document for:", user.email);
                try {
                  await createUserDocument(user, {
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    provider: user.providerData[0]?.providerId || 'unknown',
                    lastLogin: serverTimestamp()
                  });
                  
                  // Wait a short time for Firestore to process
                  await new Promise(resolve => setTimeout(resolve, 500));
                  
                  // Fetch the newly created user data
                  const { userData: newUserData } = await getUserData(user.uid);
                  if (newUserData) {
                    console.log("New user document created and loaded");
                    setUserData(newUserData as UserData);
                    success = true;
                  } else {
                    throw new Error("User document created but could not be loaded");
                  }
                } catch (createError) {
                  console.error("Error creating user document:", createError);
                  retryCount++;
                  if (retryCount >= MAX_RETRIES) {
                    setError("Failed to create user profile after multiple attempts");
                  } else {
                    // Wait before retrying (exponential backoff)
                    await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
                  }
                  continue; // Retry the loop
                }
              } else {
                // Some other error occurred
                setError(userError);
                retryCount = MAX_RETRIES; // Stop retrying
              }
            } else if (userDoc) {
              console.log("User data loaded:", userDoc);
              
              // Check if we need to reset monthly tokens
              await checkAndResetMonthlyTokens(user.uid);
              
              // Get fresh user data after token reset
              const { userData: refreshedUserData } = await getUserData(user.uid);
              setUserData((refreshedUserData || userDoc) as UserData);
              success = true;
            } else {
              // Document exists but is empty, this shouldn't happen
              console.log("Empty user document found, recreating");
              try {
                await createUserDocument(user, {
                  displayName: user.displayName,
                  photoURL: user.photoURL,
                  provider: user.providerData[0]?.providerId || 'unknown',
                  lastLogin: serverTimestamp()
                });
                
                // Fetch the newly created user data
                const { userData: newUserData } = await getUserData(user.uid);
                setUserData(newUserData as UserData);
                success = true;
              } catch (createError) {
                console.error("Error recreating user document:", createError);
                retryCount++;
              }
            }
          } catch (err: any) {
            console.error('Auth context error:', err);
            setError(err.message);
            retryCount++;
          }
        }
        
        setIsLoading(false);
      } else {
        // No user is signed in
        setUserData(null);
        setIsLoading(false);
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Register function
  const register = async (email: string, password: string, name: string) => {
    try {
      return await registerUser(email, password, name);
    } catch (error: any) {
      console.error('Registration error:', error);
      return { user: null, error: error.message };
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      return await loginUser(email, password);
    } catch (error: any) {
      console.error('Login error:', error);
      return { user: null, error: error.message };
    }
  };
  
  // Google login function
  const loginWithGoogle = async () => {
    try {
      return await firebaseLoginWithGoogle();
    } catch (error: any) {
      console.error('Google login error:', error);
      return { user: null, error: error.message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      return await logoutUser();
    } catch (error: any) {
      console.error('Logout error:', error);
      return { error: error.message };
    }
  };
  
  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      return await firebaseResetPassword(email);
    } catch (error: any) {
      console.error('Reset password error:', error);
      return { error: error.message };
    }
  };

  const value = {
    currentUser,
    userData,
    isLoading,
    error,
    checkingSession,
    register,
    login,
    loginWithGoogle,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;