import api from './api';

// Auth API functions
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgotpassword', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, password) => {
    const response = await api.put(`/auth/resetpassword/${token}`, { password });
    return response.data;
  },
};

// User API functions
export const userAPI = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/user/profile', profileData);
    return response.data;
  },

  // Upload avatar
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await api.post('/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete avatar
  deleteAvatar: async () => {
    const response = await api.delete('/user/avatar');
    return response.data;
  },

  // Update preferences
  updatePreferences: async (preferences) => {
    const response = await api.put('/user/preferences', preferences);
    return response.data;
  },

  // Get game statistics
  getGameStats: async () => {
    const response = await api.get('/user/stats');
    return response.data;
  },

  // Get leaderboard
  getLeaderboard: async (limit = 10) => {
    const response = await api.get(`/user/leaderboard?limit=${limit}`);
    return response.data;
  },

  // Search users
  searchUsers: async (query) => {
    const response = await api.get(`/user/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Delete account
  deleteAccount: async () => {
    const response = await api.delete('/user/account');
    return response.data;
  },
};

// Game API functions
export const gameAPI = {
  // Start new game session
  startGame: async (gameMode = 'classic', difficulty = 'medium') => {
    const response = await api.post('/game/start', { gameMode, difficulty });
    return response.data;
  },

  // End game session
  endGame: async (sessionId, gameData) => {
    const response = await api.post(`/game/end/${sessionId}`, gameData);
    return response.data;
  },

  // Get game history
  getGameHistory: async (page = 1, limit = 10, gameMode = null) => {
    const params = new URLSearchParams({ page, limit });
    if (gameMode) params.append('gameMode', gameMode);
    
    const response = await api.get(`/game/history?${params}`);
    return response.data;
  },

  // Get best scores
  getBestScores: async () => {
    const response = await api.get('/game/best-scores');
    return response.data;
  },

  // Get game leaderboard
  getGameLeaderboard: async (gameMode = 'classic', limit = 10) => {
    const response = await api.get(`/game/leaderboard/${gameMode}?limit=${limit}`);
    return response.data;
  },

  // Record game event
  recordGameEvent: async (sessionId, eventData) => {
    const response = await api.post(`/game/event/${sessionId}`, eventData);
    return response.data;
  },

  // Get game analytics
  getGameAnalytics: async () => {
    const response = await api.get('/game/analytics');
    return response.data;
  },
};

export default api;
