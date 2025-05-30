import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'firebase/auth';
import { UserProfile } from '@/types/api';
import { auth } from '@/firebase/config';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
};

// Helper function to create user profile in Firestore
const createUserProfile = async (user: User, additionalData: Record<string, any> = {}) => {
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    const { displayName, email, photoURL } = user;

    const profileData: Partial<UserProfile> = {
      id: user.uid,
      email: email || '',
      displayName: displayName || '',
      photoURL: photoURL || undefined,
      bio: '',
      website: '',
      preferences: {
        defaultStyle: 'realistic',
        defaultQuality: 'standard',
        emailNotifications: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...additionalData,
    };

    await setDoc(userRef, profileData);
    return profileData as UserProfile;
  }

  return userDoc.data() as UserProfile;
};

// Helper function to convert Firestore data to serializable format
const convertFirestoreData = (data: any): UserProfile => {
  const converted = { ...data };
  
  // List of all possible timestamp fields that need conversion
  const timestampFields = [
    'createdAt',
    'updatedAt', 
    'lastLogin',
    'lastImageCreated',
    'lastTokenReset',
    'subscriptionUpdatedAt'
  ];
  
  // Convert all Firestore Timestamps to ISO strings
  timestampFields.forEach(field => {
    if (converted[field]?.toDate) {
      converted[field] = converted[field].toDate().toISOString();
    }
  });
  
  return converted as UserProfile;
};

// Helper function to get user profile from Firestore
const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return convertFirestoreData(userDoc.data());
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

// Async thunks
export const loginWithEmail = createAsyncThunk(
  'auth/loginWithEmail',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const profile = await getUserProfile(userCredential.user.uid);
      
      if (!profile) {
        const newProfile = await createUserProfile(userCredential.user);
        return { user: userCredential.user, profile: newProfile };
      }
      
      return { user: userCredential.user, profile };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerWithEmail = createAsyncThunk(
  'auth/registerWithEmail',
  async ({ email, password, displayName }: { email: string; password: string; displayName: string }, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }
      
      // Create user profile
      const profile = await createUserProfile(userCredential.user, { displayName });
      
      return { user: userCredential.user, profile };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      let profile = await getUserProfile(userCredential.user.uid);
      
      if (!profile) {
        profile = await createUserProfile(userCredential.user);
      }
      
      return { user: userCredential.user, profile };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { message: 'Password reset email sent' };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (updates: Partial<UserProfile>, { getState, rejectWithValue }) => {
    try {
      const { auth: authState } = getState() as { auth: AuthState };
      
      if (!authState.user) {
        return rejectWithValue('No user logged in');
      }
      
      const userRef = doc(db, 'users', authState.user.uid);
      const updatedData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      
      await setDoc(userRef, updatedData, { merge: true });
      
      return updatedData;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isLoading = false;
    },
    setProfile: (state, action: PayloadAction<UserProfile | null>) => {
      state.profile = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login with email
      .addCase(loginWithEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.profile = action.payload.profile;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Register with email
      .addCase(registerWithEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerWithEmail.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.profile = action.payload.profile;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerWithEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Login with Google
      .addCase(loginWithGoogle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.profile = action.payload.profile;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.profile = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      
      // Reset password
      .addCase(resetPassword.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      // Update profile
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile = { ...state.profile, ...action.payload };
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setUser, setProfile, setLoading, setError, clearError } = authSlice.actions;
export default authSlice.reducer;