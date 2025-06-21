import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { uploadAvatar, handleMulterError } from '../middleware/upload.js';
import { uploadAvatar as cloudinaryUpload, deleteAvatar } from '../config/cloudinary.js';

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, bio, dateOfBirth } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update profile fields
    if (firstName !== undefined) user.profile.firstName = firstName;
    if (lastName !== undefined) user.profile.lastName = lastName;
    if (bio !== undefined) user.profile.bio = bio;
    if (dateOfBirth !== undefined) user.profile.dateOfBirth = dateOfBirth;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload/Update avatar
// @route   POST /api/user/avatar
// @access  Private
export const uploadUserAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file'
      });
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete old avatar if it exists
    if (user.avatar.publicId) {
      try {
        await deleteAvatar(user.avatar.publicId);
      } catch (error) {
        console.error('Error deleting old avatar:', error);
      }
    }

    // Upload new avatar to Cloudinary
    const result = await cloudinaryUpload(req.file.buffer, user.username);
    
    // Update user avatar
    user.avatar = {
      url: result.secure_url,
      publicId: result.public_id
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        avatar: user.avatar
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete avatar
// @route   DELETE /api/user/avatar
// @access  Private
export const deleteUserAvatar = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete avatar from Cloudinary if it exists
    if (user.avatar.publicId) {
      try {
        await deleteAvatar(user.avatar.publicId);
      } catch (error) {
        console.error('Error deleting avatar:', error);
      }
    }

    // Clear avatar from user
    user.avatar = {
      url: '',
      publicId: ''
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Avatar deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user preferences
// @route   PUT /api/user/preferences
// @access  Private
export const updatePreferences = async (req, res, next) => {
  try {
    const { theme, soundEnabled, notificationsEnabled } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update preferences
    if (theme !== undefined) user.preferences.theme = theme;
    if (soundEnabled !== undefined) user.preferences.soundEnabled = soundEnabled;
    if (notificationsEnabled !== undefined) user.preferences.notificationsEnabled = notificationsEnabled;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        preferences: user.preferences
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user game statistics
// @route   GET /api/user/stats
// @access  Private
export const getGameStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('gameStats username avatar');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user rank
    const rank = await User.getUserRank(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        gameStats: user.gameStats,
        rank: rank,
        username: user.username,
        avatar: user.avatar
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get leaderboard
// @route   GET /api/user/leaderboard
// @access  Public
export const getLeaderboard = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const leaderboard = await User.getLeaderboard(limit);

    res.status(200).json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search users
// @route   GET /api/user/search
// @access  Private
export const searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters'
      });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { 'profile.firstName': { $regex: q, $options: 'i' } },
        { 'profile.lastName': { $regex: q, $options: 'i' } }
      ],
      isActive: true,
      _id: { $ne: req.user.id } // Exclude current user
    })
    .select('username avatar profile.firstName profile.lastName gameStats.level')
    .limit(20);

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account
// @route   DELETE /api/user/account
// @access  Private
export const deleteAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete avatar from Cloudinary if it exists
    if (user.avatar.publicId) {
      try {
        await deleteAvatar(user.avatar.publicId);
      } catch (error) {
        console.error('Error deleting avatar:', error);
      }
    }

    // Soft delete - just deactivate the account
    user.isActive = false;
    user.email = `deleted_${Date.now()}_${user.email}`;
    user.username = `deleted_${Date.now()}_${user.username}`;
    
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/avatar', protect, uploadAvatar, handleMulterError, uploadUserAvatar);
router.delete('/avatar', protect, deleteUserAvatar);
router.put('/preferences', protect, updatePreferences);
router.get('/stats', protect, getGameStats);
router.get('/leaderboard', getLeaderboard);
router.get('/search', protect, searchUsers);
router.delete('/account', protect, deleteAccount);

export default router;
