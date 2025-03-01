import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp,
  increment,
  query,
  where,
  orderBy,
  getDocs,
  DocumentData
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7Xk9ajpg7njnPswealXsvAEajYMUt6VM",
  authDomain: "dreamcanvas-d52d4.firebaseapp.com",
  projectId: "dreamcanvas-d52d4",
  storageBucket: "dreamcanvas-d52d4.firebasestorage.app",
  messagingSenderId: "805720012124",
  appId: "1:805720012124:web:b9810cbce205de86327d99",
  measurementId: "G-1DT8MN1SG3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Subscription Plans
export const SUBSCRIPTION_TIERS = {
  FREE: {
    name: 'Free',
    monthlyTokens: 50,
    price: 0,
    features: [
      'Basic image generation',
      'Standard resolution (512x512)',
      'Basic models only',
      '50 tokens per month',
      'Community support'
    ]
  },
  BASIC: {
    name: 'Basic',
    monthlyTokens: 200,
    price: 9.99,
    features: [
      'Higher quality image generation',
      'HD resolution (1024x1024)',
      'Access to all models',
      '200 tokens per month',
      'Email support',
      'Save and organize creations'
    ]
  },
  PRO: {
    name: 'Professional',
    monthlyTokens: 600,
    price: 19.99,
    features: [
      'Premium image generation',
      'Ultra HD resolution (2048x2048)',
      'Advanced settings and controls',
      'Priority processing',
      '600 tokens per month',
      'Priority support',
      'Commercial usage rights'
    ]
  },
  UNLIMITED: {
    name: 'Enterprise',
    monthlyTokens: 2000,
    price: 49.99,
    features: [
      'Unlimited resolution options',
      'API access',
      'Custom model fine-tuning',
      'Bulk generation',
      '2000 tokens per month',
      'Dedicated support manager',
      'Full commercial rights',
      'White-label option'
    ]
  }
};

// Token costs by operation
export const TOKEN_COSTS = {
  STANDARD_GENERATION: 1,  // Basic 512x512 image
  HD_GENERATION: 3,        // HD 1024x1024 image
  ULTRA_HD_GENERATION: 7,  // Ultra HD 2048x2048 image
  CUSTOM_GENERATION: 10,   // Special model or custom parameters
  EDIT_EXISTING: 2,        // Edit/variation of existing image
};

// Authentication functions
export const registerUser = async (email: string, password: string, displayName: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with display name
    await updateProfile(userCredential.user, { displayName });
    
    // Create user document in Firestore
    await createUserDocument(userCredential.user, { displayName });
    
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    console.error("Registration error:", error);
    return { user: null, error: error.message };
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    console.error("Login error:", error);
    return { user: null, error: error.message };
  }
};

export const loginWithGoogle = async () => {
  try {
    // Add additional scopes to the Google provider
    googleProvider.addScope('profile');
    googleProvider.addScope('email');
    
    // Set custom parameters
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
    
    console.log("Starting Google sign-in process...");
    
    // Sign in with popup
    const userCredential = await signInWithPopup(auth, googleProvider);
    
    // The signed-in user info
    const user = userCredential.user;
    console.log("Google sign-in successful:", user.displayName, user.email);
    
    // Create or update the user document in Firestore
    try {
      console.log("Checking for existing user document...");
      
      // We'll try to create/update the user document in Firestore
      await createUserDocument(user, {
        displayName: user.displayName,
        photoURL: user.photoURL,
        provider: 'google',
        lastLogin: serverTimestamp()
      });
      
      console.log("User document created or verified successfully");
      
      // Verify the user document was created properly by fetching it
      const { userData, error: fetchError } = await getUserData(user.uid);
      
      if (fetchError) {
        console.error("Error verifying user document:", fetchError);
        return { user, error: "Profile was created but there was an issue loading your data. Please try refreshing the page." };
      }
      
      if (!userData) {
        console.error("User document not found after creation");
        return { user, error: "Your profile was created but we couldn't load your data. Please try refreshing the page." };
      }
      
      console.log("User document verified and loaded successfully");
      return { user, error: null };
    } catch (firestoreError: any) {
      // Log the specific error for debugging
      console.error("Error with Firestore during Google login:", firestoreError);
      
      // Try to provide more specific error information
      let errorMessage = "Authentication successful, but there was an error setting up your profile.";
      
      if (firestoreError.code === 'permission-denied') {
        errorMessage = "Authentication successful, but you don't have permission to access this feature. Please contact support.";
      } else if (firestoreError.code === 'unavailable') {
        errorMessage = "Authentication successful, but the database is currently unavailable. Please try again later.";
      }
      
      // Return the user anyway so they're at least authenticated
      return { user, error: errorMessage };
    }
  } catch (error: any) {
    console.error("Google login error:", error);
    let errorMessage = "Failed to sign in with Google.";
    
    if (error.code) {
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = "Login window was closed before completing the login process.";
          break;
        case 'auth/popup-blocked':
          errorMessage = "Login popup was blocked by your browser. Please allow popups for this site.";
          break;
        case 'auth/cancelled-popup-request':
          errorMessage = "Login request was cancelled.";
          break;
        case 'auth/account-exists-with-different-credential':
          errorMessage = "An account already exists with the same email address but different sign-in credentials. Try signing in with a different method.";
          break;
        case 'auth/unauthorized-domain':
          errorMessage = "This domain is not authorized for OAuth operations. Contact the administrator.";
          break;
        case 'auth/operation-not-allowed':
          errorMessage = "Google login is not enabled. Contact the administrator.";
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
    }
    
    return { user: null, error: errorMessage };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: any) {
    console.error("Logout error:", error);
    return { error: error.message };
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error: any) {
    console.error("Password reset error:", error);
    return { error: error.message };
  }
};

// User document management
export const createUserDocument = async (user: User, additionalData: any = {}) => {
  if (!user) {
    console.error("Cannot create document for null user");
    return null;
  }
  
  try {
    console.log(`Creating/updating user document for UID: ${user.uid}`);
    
    // Get a reference to the user document
    const userRef = doc(db, 'users', user.uid);
    
    // Try to get the current document
    const userSnap = await getDoc(userRef);
    
    // If document doesn't exist, create it
    if (!userSnap.exists()) {
      console.log("User document doesn't exist, creating now");
      const { email, displayName, photoURL } = user;
      const createdAt = serverTimestamp();
      
      // Create the user document data
      const userData = {
        uid: user.uid,
        email,
        displayName: displayName || additionalData.displayName || email?.split('@')[0] || 'User',
        photoURL: photoURL || null,
        createdAt,
        tier: 'FREE',
        tokensRemaining: SUBSCRIPTION_TIERS.FREE.monthlyTokens,
        tokensUsed: 0,
        totalImages: 0,
        lastTokenReset: createdAt,
        ...additionalData
      };
      
      // Log the data we're about to write
      console.log("Writing user document data:", JSON.stringify(userData));
      
      // Set the data to Firestore
      await setDoc(userRef, userData);
      console.log("User document successfully created");
    } else {
      console.log("User document already exists");
    }
    
    return userRef;
  } catch (error) {
    console.error("Error creating user document:", error);
    // Throw the error so caller can handle it
    throw error;
  }
};

// User data and tokens management
export const getUserData = async (uid: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    
    if (userDoc.exists()) {
      return { userData: userDoc.data(), error: null };
    } else {
      return { userData: null, error: 'User not found' };
    }
  } catch (error: any) {
    console.error("Error fetching user data:", error);
    return { userData: null, error: error.message };
  }
};

export const updateUserProfile = async (uid: string, data: any) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    
    // If display name is being updated, update auth profile as well
    if (data.displayName && auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: data.displayName });
    }
    
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error updating user profile:", error);
    return { success: false, error: error.message };
  }
};

export const consumeTokens = async (uid: string, amount: number) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return { success: false, error: 'User not found' };
    }
    
    const userData = userDoc.data();
    
    // Check if user has enough tokens
    if (userData.tokensRemaining < amount) {
      return { success: false, error: 'Insufficient tokens', tokensRemaining: userData.tokensRemaining };
    }
    
    // Consume tokens
    await updateDoc(userRef, {
      tokensRemaining: increment(-amount),
      tokensUsed: increment(amount),
      totalImages: increment(1),
      lastImageCreated: serverTimestamp()
    });
    
    return { 
      success: true, 
      error: null, 
      tokensRemaining: userData.tokensRemaining - amount 
    };
  } catch (error: any) {
    console.error("Error consuming tokens:", error);
    return { success: false, error: error.message };
  }
};

export const checkAndResetMonthlyTokens = async (uid: string) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return { success: false, error: 'User not found' };
    }
    
    const userData = userDoc.data();
    const lastReset = userData.lastTokenReset?.toDate() || new Date(0);
    const now = new Date();
    
    // Check if it's been a month since the last reset
    const monthsSinceReset = (now.getFullYear() - lastReset.getFullYear()) * 12 + 
                              now.getMonth() - lastReset.getMonth();
    
    if (monthsSinceReset >= 1) {
      // Reset tokens based on user's tier
      const tier = userData.tier || 'FREE';
      const monthlyTokens = SUBSCRIPTION_TIERS[tier as keyof typeof SUBSCRIPTION_TIERS]?.monthlyTokens || SUBSCRIPTION_TIERS.FREE.monthlyTokens;
      
      await updateDoc(userRef, {
        tokensRemaining: monthlyTokens,
        lastTokenReset: serverTimestamp()
      });
      
      return { success: true, tokensReset: true, newTotal: monthlyTokens };
    }
    
    return { success: true, tokensReset: false };
  } catch (error: any) {
    console.error("Error checking/resetting tokens:", error);
    return { success: false, error: error.message };
  }
};

// Image history functions
export const saveGeneratedImage = async (uid: string, imageData: any) => {
  try {
    // Create a reference to the images collection for this user
    const imagesCollectionRef = collection(db, 'users', uid, 'images');
    const imageDocRef = doc(imagesCollectionRef);
    
    // Save the image data
    await setDoc(imageDocRef, {
      ...imageData,
      createdAt: serverTimestamp(),
      userId: uid,
      id: imageDocRef.id
    });
    
    return { success: true, imageId: imageDocRef.id };
  } catch (error: any) {
    console.error("Error saving image:", error);
    return { success: false, error: error.message };
  }
};

export const getUserImages = async (uid: string, filter: any = {}) => {
  try {
    const imagesRef = collection(db, 'users', uid, 'images');
    
    // Build query based on filters
    let imagesQuery = query(imagesRef, orderBy('createdAt', 'desc'));
    
    if (filter.modelId) {
      imagesQuery = query(imagesQuery, where('params.modelId', '==', filter.modelId));
    }
    
    // Execute query
    const querySnapshot = await getDocs(imagesQuery);
    const images: DocumentData[] = [];
    
    querySnapshot.forEach((doc) => {
      images.push({ ...doc.data(), id: doc.id });
    });
    
    return { images, error: null };
  } catch (error: any) {
    console.error("Error fetching user images:", error);
    return { images: [], error: error.message };
  }
};

export const getUserImageById = async (uid: string, imageId: string) => {
  try {
    const imageDocRef = doc(db, 'users', uid, 'images', imageId);
    const imageDoc = await getDoc(imageDocRef);
    
    if (imageDoc.exists()) {
      return { image: { ...imageDoc.data(), id: imageDoc.id }, error: null };
    } else {
      return { image: null, error: 'Image not found' };
    }
  } catch (error: any) {
    console.error("Error fetching image:", error);
    return { image: null, error: error.message };
  }
};

// Subscription management
export const updateUserSubscription = async (uid: string, tier: string) => {
  try {
    // Validate the tier
    if (!SUBSCRIPTION_TIERS[tier as keyof typeof SUBSCRIPTION_TIERS]) {
      return { success: false, error: 'Invalid subscription tier' };
    }
    
    const userRef = doc(db, 'users', uid);
    const monthlyTokens = SUBSCRIPTION_TIERS[tier as keyof typeof SUBSCRIPTION_TIERS].monthlyTokens;
    
    await updateDoc(userRef, {
      tier,
      tokensRemaining: monthlyTokens,
      subscriptionUpdatedAt: serverTimestamp(),
      lastTokenReset: serverTimestamp()
    });
    
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error updating subscription:", error);
    return { success: false, error: error.message };
  }
};

// Auth listener helper
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Helper exports
export { auth, db, storage, serverTimestamp };