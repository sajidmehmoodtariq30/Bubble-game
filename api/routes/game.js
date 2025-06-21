import express from 'express';
import { body, validationResult } from 'express-validator';
import GameSession from '../models/GameSession.js';
import User from '../models/User.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// @desc    Start a new game session
// @route   POST /api/game/start
// @access  Private
export const startGame = async (req, res, next) => {
  try {
    const { gameMode = 'classic', difficulty = 'medium' } = req.body;
    
    // Validate game mode and difficulty
    const validGameModes = ['classic', 'time-attack', 'endless', 'challenge'];
    const validDifficulties = ['easy', 'medium', 'hard', 'expert'];
    
    if (!validGameModes.includes(gameMode)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid game mode'
      });
    }
    
    if (!validDifficulties.includes(difficulty)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid difficulty level'
      });
    }

    // Create new game session
    const gameSession = await GameSession.create({
      userId: req.user.id,
      gameMode,
      difficulty,
      score: 0,
      duration: 0,
      bubblesHit: 0,
      bubblesTotal: 0,
      isCompleted: false
    });

    res.status(201).json({
      success: true,
      message: 'Game session started',
      data: {
        sessionId: gameSession._id,
        gameMode: gameSession.gameMode,
        difficulty: gameSession.difficulty,
        startTime: gameSession.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    End game session and save results
// @route   POST /api/game/end/:sessionId
// @access  Private
export const endGame = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { 
      score, 
      duration, 
      bubblesHit, 
      bubblesTotal, 
      endReason = 'completed',
      gameEvents = []
    } = req.body;

    // Find the game session
    const gameSession = await GameSession.findOne({
      _id: sessionId,
      userId: req.user.id,
      isCompleted: false
    });

    if (!gameSession) {
      return res.status(404).json({
        success: false,
        message: 'Game session not found or already completed'
      });
    }

    // Update game session
    gameSession.score = score || 0;
    gameSession.duration = duration || 0;
    gameSession.bubblesHit = bubblesHit || 0;
    gameSession.bubblesTotal = bubblesTotal || 0;
    gameSession.endReason = endReason;
    gameSession.gameEvents = gameEvents;
    gameSession.isCompleted = true;

    await gameSession.save();

    // Update user statistics
    const user = await User.findById(req.user.id);
    if (user) {
      user.updateGameStats(gameSession.score, gameSession.duration);
      
      // Check for achievements
      if (gameSession.score > 1000 && !user.gameStats.achievements.find(a => a.name === 'High Scorer')) {
        user.addAchievement('High Scorer', 'Scored over 1000 points in a single game');
      }
      
      if (user.gameStats.gamesPlayed >= 10 && !user.gameStats.achievements.find(a => a.name === 'Dedicated Player')) {
        user.addAchievement('Dedicated Player', 'Played 10 games');
      }
      
      if (gameSession.accuracy >= 90 && !user.gameStats.achievements.find(a => a.name === 'Sharp Shooter')) {
        user.addAchievement('Sharp Shooter', 'Achieved 90% accuracy in a game');
      }

      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Game session completed',
      data: {
        session: gameSession,
        userStats: user.gameStats,
        newAchievements: user.gameStats.achievements.filter(
          a => new Date(a.unlockedAt) > new Date(Date.now() - 5000) // Last 5 seconds
        )
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's game history
// @route   GET /api/game/history
// @access  Private
export const getGameHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const gameMode = req.query.gameMode;

    let query = { userId: req.user.id, isCompleted: true };
    if (gameMode) {
      query.gameMode = gameMode;
    }

    const sessions = await GameSession.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('score duration accuracy gameMode difficulty createdAt endReason');

    const total = await GameSession.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        sessions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's best scores by game mode
// @route   GET /api/game/best-scores
// @access  Private
export const getBestScores = async (req, res, next) => {
  try {
    const bestScores = await GameSession.getUserBestScores(req.user.id);

    res.status(200).json({
      success: true,
      data: bestScores
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get global leaderboard for specific game mode
// @route   GET /api/game/leaderboard/:gameMode
// @access  Public
export const getGameLeaderboard = async (req, res, next) => {
  try {
    const { gameMode = 'classic' } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    const leaderboard = await GameSession.getGlobalLeaderboard(gameMode, limit);

    res.status(200).json({
      success: true,
      data: {
        gameMode,
        leaderboard
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Record game event (for real-time tracking)
// @route   POST /api/game/event/:sessionId
// @access  Private
export const recordGameEvent = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { type, data } = req.body;

    // Validate event type
    const validEventTypes = ['bubble_hit', 'bubble_miss', 'powerup_collected', 'level_up', 'combo'];
    if (!validEventTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event type'
      });
    }

    // Find the game session
    const gameSession = await GameSession.findOne({
      _id: sessionId,
      userId: req.user.id,
      isCompleted: false
    });

    if (!gameSession) {
      return res.status(404).json({
        success: false,
        message: 'Active game session not found'
      });
    }

    // Add event
    gameSession.gameEvents.push({
      type,
      timestamp: new Date(),
      data
    });

    await gameSession.save();

    res.status(200).json({
      success: true,
      message: 'Event recorded successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get game statistics and analytics
// @route   GET /api/game/analytics
// @access  Private
export const getGameAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Get overall statistics
    const totalGames = await GameSession.countDocuments({ userId, isCompleted: true });
    
    const averageScore = await GameSession.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId), isCompleted: true } },
      { $group: { _id: null, avgScore: { $avg: '$score' } } }
    ]);

    const bestGame = await GameSession.findOne({ userId, isCompleted: true })
      .sort({ score: -1 })
      .select('score accuracy duration gameMode difficulty createdAt');

    // Get performance by game mode
    const performanceByMode = await GameSession.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId), isCompleted: true } },
      {
        $group: {
          _id: '$gameMode',
          gamesPlayed: { $sum: 1 },
          averageScore: { $avg: '$score' },
          bestScore: { $max: '$score' },
          averageAccuracy: { $avg: '$accuracy' }
        }
      }
    ]);

    // Get recent performance (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentGames = await GameSession.find({
      userId,
      isCompleted: true,
      createdAt: { $gte: sevenDaysAgo }
    }).select('score createdAt');

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalGames,
          averageScore: averageScore[0]?.avgScore || 0,
          bestGame
        },
        performanceByMode,
        recentPerformance: recentGames
      }
    });
  } catch (error) {
    next(error);
  }
};

// Routes
router.post('/start', protect, startGame);
router.post('/end/:sessionId', protect, endGame);
router.get('/history', protect, getGameHistory);
router.get('/best-scores', protect, getBestScores);
router.get('/leaderboard/:gameMode?', getGameLeaderboard);
router.post('/event/:sessionId', protect, recordGameEvent);
router.get('/analytics', protect, getGameAnalytics);

export default router;
