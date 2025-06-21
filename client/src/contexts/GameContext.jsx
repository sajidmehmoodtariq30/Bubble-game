import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import { gameAPI } from '../services/auth';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

// Game modes and difficulties
export const GAME_MODES = {
  CLASSIC: 'classic',
  TIME_ATTACK: 'time-attack',
  ENDLESS: 'endless',
  CHALLENGE: 'challenge',
};

export const DIFFICULTIES = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
  EXPERT: 'expert',
};

// Game states
export const GAME_STATES = {
  IDLE: 'idle',
  STARTING: 'starting',
  PLAYING: 'playing',
  PAUSED: 'paused',
  ENDED: 'ended',
};

// Initial state
const initialState = {
  // Game session
  sessionId: null,
  gameState: GAME_STATES.IDLE,
  gameMode: GAME_MODES.CLASSIC,
  difficulty: DIFFICULTIES.MEDIUM,
  
  // Game data
  score: 0,
  timer: 30,
  targetNumber: 0,
  bubblesHit: 0,
  bubblesTotal: 0,
  accuracy: 0,
  // UI state
  bubbles: [],
  countdown: null,
  isLoading: false,
  
  // Game events
  gameEvents: [],
  
  // Statistics
  gameHistory: [],
  bestScores: {},
  analytics: null,
};

// Action types
const GameActionTypes = {
  SET_LOADING: 'SET_LOADING',
  START_GAME: 'START_GAME',
  SET_GAME_STATE: 'SET_GAME_STATE',
  UPDATE_GAME_DATA: 'UPDATE_GAME_DATA',
  SET_BUBBLES: 'SET_BUBBLES',
  SET_TARGET: 'SET_TARGET',
  HIT_BUBBLE: 'HIT_BUBBLE',
  MISS_BUBBLE: 'MISS_BUBBLE',
  UPDATE_TIMER: 'UPDATE_TIMER',
  SET_COUNTDOWN: 'SET_COUNTDOWN',
  END_GAME: 'END_GAME',
  RESET_GAME: 'RESET_GAME',
  ADD_EVENT: 'ADD_EVENT',
  SET_GAME_HISTORY: 'SET_GAME_HISTORY',
  SET_BEST_SCORES: 'SET_BEST_SCORES',
  SET_ANALYTICS: 'SET_ANALYTICS',
};

// Reducer
const gameReducer = (state, action) => {
  switch (action.type) {
    case GameActionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case GameActionTypes.START_GAME:
      return {
        ...state,
        sessionId: action.payload.sessionId,
        gameMode: action.payload.gameMode,
        difficulty: action.payload.difficulty,
        gameState: GAME_STATES.STARTING,
        score: 0,
        bubblesHit: 0,
        bubblesTotal: 0,
        accuracy: 0,
        gameEvents: [],
      };

    case GameActionTypes.SET_GAME_STATE:
      return { ...state, gameState: action.payload };

    case GameActionTypes.UPDATE_GAME_DATA:
      return { ...state, ...action.payload };

    case GameActionTypes.SET_BUBBLES:
      return { ...state, bubbles: action.payload };

    case GameActionTypes.SET_TARGET:
      return { ...state, targetNumber: action.payload };    case GameActionTypes.HIT_BUBBLE:
      const newScore = state.score + 10;
      const newBubblesHit = state.bubblesHit + 1;
      const newBubblesTotal = state.bubblesTotal + 1;
      const newAccuracy = Math.round((newBubblesHit / newBubblesTotal) * 100);
      
      return {
        ...state,
        score: newScore,
        bubblesHit: newBubblesHit,
        bubblesTotal: newBubblesTotal,
        accuracy: newAccuracy,
      };

    case GameActionTypes.MISS_BUBBLE:
      const missedBubblesTotal = state.bubblesTotal + 1;
      const missedAccuracy = Math.round((state.bubblesHit / missedBubblesTotal) * 100);
      
      return {
        ...state,
        bubblesTotal: missedBubblesTotal,
        accuracy: missedAccuracy,
      };

    case GameActionTypes.UPDATE_TIMER:
      return { ...state, timer: action.payload };

    case GameActionTypes.SET_COUNTDOWN:
      return { ...state, countdown: action.payload };    case GameActionTypes.END_GAME:
      return {
        ...state,
        gameState: GAME_STATES.ENDED,
        countdown: null,
      };

    case GameActionTypes.RESET_GAME:
      return {
        ...initialState,
        gameHistory: state.gameHistory,
        bestScores: state.bestScores,
        analytics: state.analytics,
      };

    case GameActionTypes.ADD_EVENT:
      return {
        ...state,
        gameEvents: [...state.gameEvents, action.payload],
      };

    case GameActionTypes.SET_GAME_HISTORY:
      return { ...state, gameHistory: action.payload };

    case GameActionTypes.SET_BEST_SCORES:
      return { ...state, bestScores: action.payload };

    case GameActionTypes.SET_ANALYTICS:
      return { ...state, analytics: action.payload };

    default:
      return state;
  }
};

// Create context
const GameContext = createContext();

// GameProvider component
export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { isAuthenticated, updateUser, user } = useAuth();

  // Ref to store current game state for timer callbacks
  const currentGameStateRef = useRef({
    score: 0,
    accuracy: 0,
    bubblesHit: 0,
    bubblesTotal: 0,
    difficulty: DIFFICULTIES.MEDIUM
  });

  // Update ref whenever state changes
  useEffect(() => {
    currentGameStateRef.current = {
      score: state.score,
      accuracy: state.accuracy,
      bubblesHit: state.bubblesHit,
      bubblesTotal: state.bubblesTotal,
      difficulty: state.difficulty
    };
  }, [state.score, state.accuracy, state.bubblesHit, state.bubblesTotal, state.difficulty]);

  // Get time limit based on difficulty
  const getTimeLimit = (difficulty) => {
    switch (difficulty) {
      case DIFFICULTIES.EASY: return 45;
      case DIFFICULTIES.MEDIUM: return 30;
      case DIFFICULTIES.HARD: return 20;
      case DIFFICULTIES.EXPERT: return 15;
      default: return 30;
    }
  };  // End game
  const endGame = useCallback(async (endReason = 'completed', currentGameState = null) => {
    // Clear timer
    if (window.gameTimerInterval) {
      clearInterval(window.gameTimerInterval);
      window.gameTimerInterval = null;
    }

    // Use provided state or current state
    const gameStats = currentGameState || {
      score: state.score,
      accuracy: state.accuracy,
      bubblesHit: state.bubblesHit,
      bubblesTotal: state.bubblesTotal,
      timer: state.timer,
      difficulty: state.difficulty
    };

    dispatch({ type: GameActionTypes.END_GAME });

    const currentScore = gameStats.score;
    const currentAccuracy = gameStats.accuracy;
    const currentBubblesHit = gameStats.bubblesHit;
    const currentBubblesTotal = gameStats.bubblesTotal;
    const currentTimer = gameStats.timer;
    const currentDifficulty = gameStats.difficulty;
    
    // Calculate final duration
    const duration = getTimeLimit(currentDifficulty) - currentTimer;

    console.log('EndGame with final stats:', {
      score: currentScore,
      accuracy: currentAccuracy,
      bubblesHit: currentBubblesHit,
      duration
    });

    // Update user statistics
    if (isAuthenticated && updateUser) {
      try {
        // Get current user stats or initialize them
        const currentStats = user?.gameStats || {
          gamesPlayed: 0,
          highestScore: 0,
          totalScore: 0,
          averageScore: 0,
          level: 1,
          experience: 0
        };

        // Calculate new stats
        const newGamesPlayed = currentStats.gamesPlayed + 1;
        const newTotalScore = currentStats.totalScore + currentScore;
        const newAverageScore = Math.round(newTotalScore / newGamesPlayed);
        const newHighestScore = Math.max(currentStats.highestScore, currentScore);
        const newExperience = currentStats.experience + currentScore;
        const newLevel = Math.floor(newExperience / 1000) + 1;

        // Update user with new game statistics
        const updatedStats = {
          gameStats: {
            gamesPlayed: newGamesPlayed,
            highestScore: newHighestScore,
            totalScore: newTotalScore,
            averageScore: newAverageScore,
            level: newLevel,
            experience: newExperience,
            lastGameScore: currentScore,
            lastGameAccuracy: currentAccuracy,
            lastGameDate: new Date().toISOString()
          }
        };

        updateUser(updatedStats);
        
        console.log('Game statistics updated:', updatedStats);
        toast.success(`Game saved! Score: ${currentScore} | Level ${newLevel}`);
      } catch (error) {
        console.error('Failed to update game statistics:', error);
      }
    }

    // Show game over message
    if (endReason === 'time_up') {
      toast.info('Time\'s up! Game over!', { duration: 3000 });
    }

    console.log('Game ended:', { 
      score: currentScore, 
      duration, 
      endReason 
    });  }, [state.score, state.accuracy, state.bubblesHit, state.bubblesTotal, state.timer, state.difficulty, getTimeLimit, isAuthenticated, updateUser, user]);

  // Start game timer
  const startTimer = useCallback((initialTime) => {    // Clear any existing timer
    if (window.gameTimerInterval) {
      clearInterval(window.gameTimerInterval);
    }

    let timeLeft = initialTime;
      const timerInterval = setInterval(() => {
      timeLeft--;
      dispatch({ type: GameActionTypes.UPDATE_TIMER, payload: timeLeft });
        if (timeLeft <= 0) {
        clearInterval(timerInterval);
        window.gameTimerInterval = null;
        
        // Get current state from ref (not stale closure)
        const currentGameState = {
          score: currentGameStateRef.current.score,
          accuracy: currentGameStateRef.current.accuracy,
          bubblesHit: currentGameStateRef.current.bubblesHit,
          bubblesTotal: currentGameStateRef.current.bubblesTotal,
          timer: timeLeft,
          difficulty: currentGameStateRef.current.difficulty
        };
        
        endGame('time_up', currentGameState);
      }
    }, 1000);

    // Store interval ID for cleanup
    window.gameTimerInterval = timerInterval;
  }, [endGame]);

  // Generate random bubbles
  const generateBubbles = useCallback(() => {
    const bubbles = [];
    for (let i = 0; i < 200; i++) {
      bubbles.push({
        id: i,
        value: Math.floor(Math.random() * 10),
        x: (i % 20) * 50,
        y: Math.floor(i / 20) * 50,
      });
    }
    dispatch({ type: GameActionTypes.SET_BUBBLES, payload: bubbles });
  }, []);

  // Generate random target number
  const generateTarget = useCallback(() => {
    const target = Math.floor(Math.random() * 10);
    dispatch({ type: GameActionTypes.SET_TARGET, payload: target });
  }, []);

  // Start new game
  const startGame = useCallback(async (gameMode = GAME_MODES.CLASSIC, difficulty = DIFFICULTIES.MEDIUM) => {
    if (!isAuthenticated) {
      toast.error('Please login to start a game');
      return;
    }

    try {
      dispatch({ type: GameActionTypes.SET_LOADING, payload: true });
      
      // Mock API response for now
      const mockSessionId = 'mock_session_' + Date.now();
      
      dispatch({
        type: GameActionTypes.START_GAME,
        payload: {
          sessionId: mockSessionId,
          gameMode,
          difficulty,
        },
      });

      // Start countdown
      let countdown = 3;
      dispatch({ type: GameActionTypes.SET_COUNTDOWN, payload: countdown });

      const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
          dispatch({ type: GameActionTypes.SET_COUNTDOWN, payload: countdown });
        } else {
          clearInterval(countdownInterval);
          dispatch({ type: GameActionTypes.SET_COUNTDOWN, payload: null });
          dispatch({ type: GameActionTypes.SET_GAME_STATE, payload: GAME_STATES.PLAYING });
          
          // Initialize game
          const newBubbles = [];
          for (let i = 0; i < 200; i++) {
            newBubbles.push({
              id: i,
              value: Math.floor(Math.random() * 10),
              x: (i % 20) * 50,
              y: Math.floor(i / 20) * 50,
            });
          }
          dispatch({ type: GameActionTypes.SET_BUBBLES, payload: newBubbles });
          
          const newTarget = Math.floor(Math.random() * 10);
          dispatch({ type: GameActionTypes.SET_TARGET, payload: newTarget });
          
          // Start timer based on difficulty
          const timeLimit = getTimeLimit(difficulty);
          dispatch({ type: GameActionTypes.UPDATE_TIMER, payload: timeLimit });
          startTimer(timeLimit);
        }
      }, 1000);

    } catch (error) {
      console.error('Failed to start game:', error);
      toast.error('Failed to start game');
    } finally {
      dispatch({ type: GameActionTypes.SET_LOADING, payload: false });
    }
  }, [isAuthenticated, startTimer]);  // Handle bubble click
  const handleBubbleClick = useCallback(async (bubbleValue) => {
    if (state.gameState !== GAME_STATES.PLAYING) {
      return;
    }

    const eventData = {
      type: bubbleValue === state.targetNumber ? 'bubble_hit' : 'bubble_miss',
      data: { bubbleValue, targetNumber: state.targetNumber },
      timestamp: Date.now(),
    };

    // Record event locally
    dispatch({ type: GameActionTypes.ADD_EVENT, payload: eventData });

    // Record event on server (if session exists and backend available)
    if (state.sessionId && state.sessionId.startsWith('real_')) {
      try {
        await gameAPI.recordGameEvent(state.sessionId, eventData);
      } catch (error) {
        console.error('Failed to record game event:', error);
      }
    }

    if (bubbleValue === state.targetNumber) {
      // Correct bubble hit
      dispatch({ type: GameActionTypes.HIT_BUBBLE });
      
      // Generate new bubbles and target
      const newBubbles = [];
      for (let i = 0; i < 200; i++) {
        newBubbles.push({
          id: i,
          value: Math.floor(Math.random() * 10),
          x: (i % 20) * 50,
          y: Math.floor(i / 20) * 50,
        });
      }
      dispatch({ type: GameActionTypes.SET_BUBBLES, payload: newBubbles });
      
      const newTarget = Math.floor(Math.random() * 10);
      dispatch({ type: GameActionTypes.SET_TARGET, payload: newTarget });
      
      // Add visual feedback
      toast.success('+10 points!', { duration: 1000 });
    } else {
      // Wrong bubble hit
      dispatch({ type: GameActionTypes.MISS_BUBBLE });
      toast.error('Wrong bubble!', { duration: 500 });
    }  }, [state.gameState, state.targetNumber, state.sessionId]);

  // Reset game
  const resetGame = useCallback(() => {
    if (window.gameTimerInterval) {
      clearInterval(window.gameTimerInterval);
      window.gameTimerInterval = null;
    }
    dispatch({ type: GameActionTypes.RESET_GAME });
  }, []);
  // Pause/Resume game
  const pauseGame = useCallback(() => {
    if (state.gameState === GAME_STATES.PLAYING) {
      dispatch({ type: GameActionTypes.SET_GAME_STATE, payload: GAME_STATES.PAUSED });
      if (window.gameTimerInterval) {
        clearInterval(window.gameTimerInterval);
        window.gameTimerInterval = null;
      }
    }
  }, [state.gameState]);

  const resumeGame = useCallback(() => {
    if (state.gameState === GAME_STATES.PAUSED) {
      dispatch({ type: GameActionTypes.SET_GAME_STATE, payload: GAME_STATES.PLAYING });
      startTimer(state.timer);
    }
  }, [state.gameState, state.timer, startTimer]);

  // Load game history
  const loadGameHistory = async (page = 1, limit = 10) => {
    try {
      const response = await gameAPI.getGameHistory(page, limit);
      dispatch({ type: GameActionTypes.SET_GAME_HISTORY, payload: response.data.sessions });
      return response.data;
    } catch (error) {
      console.error('Failed to load game history:', error);
      toast.error('Failed to load game history');
    }
  };

  // Load best scores
  const loadBestScores = async () => {
    try {
      const response = await gameAPI.getBestScores();
      const bestScoresMap = response.data.reduce((acc, item) => {
        acc[item._id] = item;
        return acc;
      }, {});
      dispatch({ type: GameActionTypes.SET_BEST_SCORES, payload: bestScoresMap });
      return response.data;
    } catch (error) {
      console.error('Failed to load best scores:', error);
      toast.error('Failed to load best scores');
    }
  };

  // Load analytics
  const loadAnalytics = async () => {
    try {
      const response = await gameAPI.getGameAnalytics();
      dispatch({ type: GameActionTypes.SET_ANALYTICS, payload: response.data });
      return response.data;
    } catch (error) {
      console.error('Failed to load analytics:', error);
      toast.error('Failed to load analytics');
    }
  };
  // Game mode and difficulty setters
  const setGameMode = useCallback((mode) => {
    if (state.gameState === GAME_STATES.IDLE) {
      dispatch({ type: GameActionTypes.UPDATE_GAME_DATA, payload: { gameMode: mode } });
    }
  }, [state.gameState]);

  const setDifficulty = useCallback((difficulty) => {
    if (state.gameState === GAME_STATES.IDLE) {
      dispatch({ type: GameActionTypes.UPDATE_GAME_DATA, payload: { difficulty } });
    }
  }, [state.gameState]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (window.gameTimerInterval) {
        clearInterval(window.gameTimerInterval);
        window.gameTimerInterval = null;
      }
    };
  }, []);

  // Context value
  const value = {
    // State
    ...state,
    
    // Constants
    GAME_STATES,
    GAME_MODES,
    DIFFICULTIES,
    
    // Actions
    startGame,
    endGame,
    resetGame,
    pauseGame,
    resumeGame,
    handleBubbleClick,
    setGameMode,
    setDifficulty,
    
    // Data loading
    loadGameHistory,
    loadBestScores,
    loadAnalytics,
    
    // Utilities
    generateBubbles,
    generateTarget,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

// Custom hook to use game context
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export default GameContext;
