import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [20, 'Username cannot exceed 20 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password in queries by default
  },
  avatar: {
    url: {
      type: String,
      default: ''
    },
    publicId: {
      type: String,
      default: ''
    }
  },
  profile: {
    firstName: {
      type: String,
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    dateOfBirth: {
      type: Date
    }
  },
  gameStats: {
    gamesPlayed: {
      type: Number,
      default: 0
    },
    totalScore: {
      type: Number,
      default: 0
    },
    highestScore: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    totalTimePlayed: {
      type: Number,
      default: 0 // in seconds
    },
    achievements: [{
      name: String,
      description: String,
      unlockedAt: {
        type: Date,
        default: Date.now
      }
    }],
    level: {
      type: Number,
      default: 1
    },
    experience: {
      type: Number,
      default: 0
    }
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    },
    soundEnabled: {
      type: Boolean,
      default: true
    },
    notificationsEnabled: {
      type: Boolean,
      default: true
    }
  },
  refreshTokens: [{
    token: String,
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 2592000 // 30 days
    }
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ 'gameStats.highestScore': -1 });
userSchema.index({ createdAt: -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.profile.firstName || ''} ${this.profile.lastName || ''}`.trim();
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or if it's new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Instance method to update game statistics
userSchema.methods.updateGameStats = function(score, timePlayed) {
  this.gameStats.gamesPlayed += 1;
  this.gameStats.totalScore += score;
  this.gameStats.totalTimePlayed += timePlayed;
  
  // Update highest score
  if (score > this.gameStats.highestScore) {
    this.gameStats.highestScore = score;
  }
  
  // Calculate average score
  this.gameStats.averageScore = Math.round(this.gameStats.totalScore / this.gameStats.gamesPlayed);
  
  // Update experience and level
  this.gameStats.experience += Math.floor(score / 10);
  this.gameStats.level = Math.floor(this.gameStats.experience / 1000) + 1;
};

// Instance method to add achievement
userSchema.methods.addAchievement = function(name, description) {
  const existingAchievement = this.gameStats.achievements.find(
    achievement => achievement.name === name
  );
  
  if (!existingAchievement) {
    this.gameStats.achievements.push({
      name,
      description,
      unlockedAt: new Date()
    });
  }
};

// Static method to get leaderboard
userSchema.statics.getLeaderboard = function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ 'gameStats.highestScore': -1 })
    .limit(limit)
    .select('username avatar gameStats.highestScore gameStats.gamesPlayed');
};

// Static method to get user rank
userSchema.statics.getUserRank = async function(userId) {
  const user = await this.findById(userId);
  if (!user) return null;
  
  const rank = await this.countDocuments({
    'gameStats.highestScore': { $gt: user.gameStats.highestScore },
    isActive: true
  });
  
  return rank + 1;
};

export default mongoose.model('User', userSchema);
