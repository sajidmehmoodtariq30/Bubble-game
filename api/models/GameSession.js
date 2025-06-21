import mongoose from 'mongoose';

const gameSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    type: Number,
    required: true,
    min: 0 // in seconds
  },
  bubblesHit: {
    type: Number,
    required: true,
    min: 0
  },
  bubblesTotal: {
    type: Number,
    required: true,
    min: 0
  },
  accuracy: {
    type: Number,
    min: 0,
    max: 100
  },
  gameMode: {
    type: String,
    enum: ['classic', 'time-attack', 'endless', 'challenge'],
    default: 'classic'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'expert'],
    default: 'medium'
  },
  powerUpsUsed: [{
    name: String,
    usedAt: Date,
    effect: String
  }],
  gameEvents: [{
    type: {
      type: String,
      enum: ['bubble_hit', 'bubble_miss', 'powerup_collected', 'level_up', 'combo']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    data: mongoose.Schema.Types.Mixed
  }],
  isCompleted: {
    type: Boolean,
    default: false
  },
  endReason: {
    type: String,
    enum: ['time_up', 'user_quit', 'completed', 'error'],
    default: 'completed'
  }
}, {
  timestamps: true
});

// Indexes for better performance
gameSessionSchema.index({ userId: 1, createdAt: -1 });
gameSessionSchema.index({ score: -1 });
gameSessionSchema.index({ gameMode: 1, difficulty: 1 });

// Pre-save middleware to calculate accuracy
gameSessionSchema.pre('save', function(next) {
  if (this.bubblesTotal > 0) {
    this.accuracy = Math.round((this.bubblesHit / this.bubblesTotal) * 100);
  } else {
    this.accuracy = 0;
  }
  next();
});

// Static method to get user's game history
gameSessionSchema.statics.getUserGameHistory = function(userId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('score duration accuracy gameMode difficulty createdAt');
};

// Static method to get user's best scores by game mode
gameSessionSchema.statics.getUserBestScores = function(userId) {
  return this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$gameMode',
        bestScore: { $max: '$score' },
        bestAccuracy: { $max: '$accuracy' },
        totalGames: { $sum: 1 },
        averageScore: { $avg: '$score' }
      }
    }
  ]);
};

// Static method to get global leaderboard for a specific game mode
gameSessionSchema.statics.getGlobalLeaderboard = function(gameMode = 'classic', limit = 10) {
  return this.aggregate([
    { $match: { gameMode, isCompleted: true } },
    {
      $group: {
        _id: '$userId',
        bestScore: { $max: '$score' },
        gamesPlayed: { $sum: 1 },
        averageScore: { $avg: '$score' }
      }
    },
    { $sort: { bestScore: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' },
    {
      $project: {
        username: '$user.username',
        avatar: '$user.avatar',
        bestScore: 1,
        gamesPlayed: 1,
        averageScore: { $round: ['$averageScore', 2] }
      }
    }
  ]);
};

export default mongoose.model('GameSession', gameSessionSchema);
