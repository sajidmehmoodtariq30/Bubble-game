import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import {
  GamepadIcon,
  Play,
  Pause,
  RotateCcw,
  Target,
  Timer,
  Trophy,
  Zap
} from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const GamePage = () => {
  const { user } = useAuth();
  const {
    gameState,
    score,
    timer,
    targetNumber,
    bubbles,
    countdown,
    accuracy,
    bubblesHit,
    bubblesTotal,
    gameMode,
    difficulty,
    startGame,
    pauseGame,
    resumeGame,
    endGame,
    resetGame,
    handleBubbleClick,
    setGameMode,
    setDifficulty,
    GAME_STATES,
    GAME_MODES,
    DIFFICULTIES
  } = useGame();

  const [isStarting, setIsStarting] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Handle game start with countdown
  const handleStart = useCallback(async () => {
    if (gameState === GAME_STATES.PLAYING) {
      pauseGame();
      return;
    }

    if (gameState === GAME_STATES.PAUSED) {
      resumeGame();
      return;
    }

    setIsStarting(true);
    try {
      await startGame();
      toast.success('Game started! Good luck!');
    } catch (error) {
      toast.error('Failed to start game');
    } finally {
      setIsStarting(false);
    }
  }, [gameState, startGame, pauseGame, resumeGame]);

  // Handle game reset
  const handleReset = useCallback(async () => {
    try {
      await resetGame();
      setShowStats(false);
      toast.success('Game reset!');
    } catch (error) {
      toast.error('Failed to reset game');
    }
  }, [resetGame]);

  // Show stats when game ends
  useEffect(() => {
    if (gameState === GAME_STATES.ENDED) {
      setShowStats(true);
      if (score > 0) {
        toast.success(`Game Over! Final Score: ${score}`, {
          duration: 5000,
        });
      }
    }
  }, [gameState, score]);

  // Game configuration panel
  const GameConfig = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Game Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Game Mode</label>
            <select
              value={gameMode}
              onChange={(e) => setGameMode(e.target.value)}
              disabled={gameState === GAME_STATES.PLAYING}
              className="w-full p-2 border rounded-md"
            >
              <option value={GAME_MODES.CLASSIC}>Classic</option>
              <option value={GAME_MODES.TIME_ATTACK}>Time Attack</option>
              <option value={GAME_MODES.ENDLESS}>Endless</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              disabled={gameState === GAME_STATES.PLAYING}
              className="w-full p-2 border rounded-md"
            >
              <option value={DIFFICULTIES.EASY}>Easy</option>
              <option value={DIFFICULTIES.MEDIUM}>Medium</option>
              <option value={DIFFICULTIES.HARD}>Hard</option>
              <option value={DIFFICULTIES.EXPERT}>Expert</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Game HUD
  const GameHUD = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4 text-center">
          <Trophy className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
          <div className="text-2xl font-bold">{score}</div>
          <div className="text-sm text-gray-600">Score</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 text-center">
          <Timer className="h-6 w-6 mx-auto mb-2 text-blue-600" />
          <div className="text-2xl font-bold">{timer}</div>
          <div className="text-sm text-gray-600">Time</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 text-center">
          <Target className="h-6 w-6 mx-auto mb-2 text-red-600" />
          <div className="text-2xl font-bold">{targetNumber}</div>
          <div className="text-sm text-gray-600">Target</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 text-center">
          <Zap className="h-6 w-6 mx-auto mb-2 text-green-600" />
          <div className="text-2xl font-bold">{accuracy}%</div>
          <div className="text-sm text-gray-600">Accuracy</div>
        </CardContent>
      </Card>
    </div>
  );

  // Game controls
  const GameControls = () => (
    <div className="flex justify-center gap-4 mb-6">
      <Button
        size="lg"
        onClick={handleStart}
        disabled={isStarting}
        className="min-w-[120px]"
      >
        {gameState === GAME_STATES.PLAYING ? (
          <>
            <Pause className="mr-2 h-4 w-4" />
            Pause
          </>
        ) : gameState === GAME_STATES.PAUSED ? (
          <>
            <Play className="mr-2 h-4 w-4" />
            Resume
          </>
        ) : (
          <>
            <Play className="mr-2 h-4 w-4" />
            {isStarting ? 'Starting...' : 'Start Game'}
          </>
        )}
      </Button>

      <Button
        size="lg"
        variant="outline"
        onClick={handleReset}
        disabled={gameState === GAME_STATES.IDLE && score === 0}
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Reset
      </Button>
    </div>
  );

  // Bubble grid
  const BubbleGrid = () => (
    <Card className="mb-6">
      <CardContent className="p-6">
        {countdown !== null ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-8xl font-bold text-primary mb-4">
                {countdown === 0 ? 'GO!' : countdown}
              </div>
              <div className="text-lg text-gray-600">Get Ready!</div>
            </div>
          </div>
        ) : gameState === GAME_STATES.IDLE ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <GamepadIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <div className="text-xl text-gray-600 mb-2">Ready to Play?</div>
              <div className="text-sm text-gray-500">Click Start Game to begin!</div>
            </div>
          </div>
        ) : gameState === GAME_STATES.PAUSED ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Pause className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
              <div className="text-xl text-gray-600 mb-2">Game Paused</div>
              <div className="text-sm text-gray-500">Click Resume to continue playing!</div>
            </div>
          </div>
        ) : gameState === GAME_STATES.ENDED && showStats ? (
          <div className="text-center py-8">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
            <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-md mx-auto">
              <div>
                <div className="text-2xl font-bold text-primary">{score}</div>
                <div className="text-sm text-gray-600">Final Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{bubblesHit}</div>
                <div className="text-sm text-gray-600">Bubbles Hit</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{accuracy}%</div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{bubblesTotal}</div>
                <div className="text-sm text-gray-600">Total Clicks</div>
              </div>
            </div>          </div>        ) : (
          <div className="grid grid-cols-12 gap-1 h-[50vh] overflow-hidden justify-items-center">
            {bubbles.map((bubble, index) => (
              <button
                key={index}
                onClick={() => handleBubbleClick(bubble.value)}
                className={`
                  w-14 h-14 rounded-full font-bold text-sm
                  transition-all duration-200 hover:scale-110
                  ${bubble.value === targetNumber 
                    ? 'bg-gradient-to-br from-red-400 to-red-600 text-white shadow-lg' 
                    : 'bg-gradient-to-br from-blue-400 to-blue-600 text-white hover:from-blue-500 hover:to-blue-700'
                  }
                `}
              >
                {bubble.value}
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Bubble Game</h1>
        <p className="text-gray-600">
          Click the bubbles with the target number as fast as you can!
        </p>
      </div>

      {gameState === GAME_STATES.IDLE && <GameConfig />}

      {(gameState === GAME_STATES.PLAYING || gameState === GAME_STATES.PAUSED || gameState === GAME_STATES.ENDED) && (
        <GameHUD />
      )}

      <GameControls />
      <BubbleGrid />
      {gameState === GAME_STATES.PLAYING && (
        <div className="max-w-md mx-auto">
          <Progress
            value={(() => {
              const timeLimit = (() => {
                switch (difficulty) {
                  case DIFFICULTIES.EASY: return 45;
                  case DIFFICULTIES.MEDIUM: return 30;
                  case DIFFICULTIES.HARD: return 20;
                  case DIFFICULTIES.EXPERT: return 15;
                  default: return 30;
                }
              })();
              return ((timeLimit - timer) / timeLimit) * 100;
            })()}
            className="h-2"
          />
          <div className="text-center text-sm text-gray-600 mt-2">
            Time Progress
          </div>
        </div>
      )}
    </div>
  );
};

export default GamePage;
