import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './slices/authSlice';
import imagesReducer from './slices/imagesSlice';
import uiReducer from './slices/uiSlice';
import generationReducer from './slices/generationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    images: imagesReducer,
    ui: uiReducer,
    generation: generationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/setUser', 'auth/setProfile', 'auth/loginWithEmail/fulfilled', 'auth/registerWithEmail/fulfilled', 'auth/loginWithGoogle/fulfilled'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.timestamp', 'payload.lastImageCreated', 'payload.lastLogin', 'payload.createdAt', 'payload.updatedAt', 'payload.lastTokenReset', 'payload.subscriptionUpdatedAt', 'payload.user'],
        // Ignore these paths in the state
        ignoredPaths: ['auth.user', 'auth.profile.lastImageCreated', 'auth.profile.lastLogin', 'auth.profile.createdAt', 'auth.profile.updatedAt', 'auth.profile.lastTokenReset', 'auth.profile.subscriptionUpdatedAt'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;