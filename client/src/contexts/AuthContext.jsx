import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI, userAPI } from '../services/auth';
import { toast } from 'sonner';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Action types
const AuthActionTypes = {
  AUTH_START: 'AUTH_START',
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  AUTH_FAILURE: 'AUTH_FAILURE',
  AUTH_LOGOUT: 'AUTH_LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AuthActionTypes.AUTH_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case AuthActionTypes.AUTH_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case AuthActionTypes.AUTH_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload.error,
      };

    case AuthActionTypes.AUTH_LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case AuthActionTypes.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload.user },
      };

    case AuthActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
          // Verify token is still valid
          const userData = await authAPI.getCurrentUser();
          
          dispatch({
            type: AuthActionTypes.AUTH_SUCCESS,
            payload: { user: userData.data },
          });
        } else {
          dispatch({ type: AuthActionTypes.AUTH_LOGOUT });
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        // Clear invalid tokens
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        dispatch({ type: AuthActionTypes.AUTH_LOGOUT });
      }
    };

    initializeAuth();
  }, []);

  // Listen for logout events from API interceptor
  useEffect(() => {
    const handleLogout = () => {
      dispatch({ type: AuthActionTypes.AUTH_LOGOUT });
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  // Auth actions
  const login = async (credentials) => {
    try {
      dispatch({ type: AuthActionTypes.AUTH_START });

      const response = await authAPI.login(credentials);
      const { user, accessToken, refreshToken } = response;

      // Store tokens and user data
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      dispatch({
        type: AuthActionTypes.AUTH_SUCCESS,
        payload: { user },
      });

      toast.success('Login successful!');
      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      
      dispatch({
        type: AuthActionTypes.AUTH_FAILURE,
        payload: { error: errorMessage },
      });

      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: AuthActionTypes.AUTH_START });

      const response = await authAPI.register(userData);
      const { user, accessToken, refreshToken } = response;

      // Store tokens and user data
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      dispatch({
        type: AuthActionTypes.AUTH_SUCCESS,
        payload: { user },
      });

      toast.success('Registration successful! Welcome to Bubble Game!');
      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      
      dispatch({
        type: AuthActionTypes.AUTH_FAILURE,
        payload: { error: errorMessage },
      });

      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      dispatch({ type: AuthActionTypes.AUTH_LOGOUT });
      toast.success('Logged out successfully');
    }
  };
  const updateUser = async (userData) => {
    try {
      // If there's profile data to update, call the API
      if (Object.keys(userData).length > 0) {
        const response = await userAPI.updateProfile(userData);
        
        dispatch({
          type: AuthActionTypes.UPDATE_USER,
          payload: { user: response.data },
        });

        // Update localStorage
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...currentUser, ...response.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        return response.data;
      }
    } catch (error) {
      console.error('Failed to update user:', error);
      toast.error('Failed to update profile');
      throw error;
    }
  };
  const uploadAvatar = async (file) => {
    try {
      const response = await userAPI.uploadAvatar(file);
      
      dispatch({
        type: AuthActionTypes.UPDATE_USER,
        payload: { user: { avatar: response.data.avatar } },
      });

      // Update localStorage
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, avatar: response.data.avatar };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return response.data;
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      toast.error('Failed to upload avatar');
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: AuthActionTypes.CLEAR_ERROR });
  };

  const forgotPassword = async (email) => {
    try {
      const response = await authAPI.forgotPassword(email);
      toast.success('Password reset instructions sent to your email');
      return { success: true, data: response };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send reset email';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const resetPassword = async (token, password) => {
    try {
      const response = await authAPI.resetPassword(token, password);
      const { user, accessToken, refreshToken } = response;

      // Store tokens and user data
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      dispatch({
        type: AuthActionTypes.AUTH_SUCCESS,
        payload: { user },
      });

      toast.success('Password reset successful!');
      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password reset failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };
  // Context value
  const value = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login,
    register,
    logout,
    updateUser,
    uploadAvatar,
    clearError,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
