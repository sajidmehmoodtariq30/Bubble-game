import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { 
  Play, 
  Trophy, 
  BarChart3, 
  Target, 
  Clock,
  Star,
  TrendingUp
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  // User statistics from actual game data
  const stats = {
    gamesPlayed: user?.gameStats?.gamesPlayed || 0,
    highestScore: user?.gameStats?.highestScore || 0,
    averageScore: user?.gameStats?.averageScore || 0,
    level: user?.gameStats?.level || 1,
    experience: user?.gameStats?.experience || 0,
    accuracy: user?.gameStats?.lastGameAccuracy || 0,
    rank: user?.gameStats?.gamesPlayed > 0 ? Math.max(1, 500 - (user?.gameStats?.highestScore || 0)) : 'N/A',
  };
  // Recent games will be populated from actual game history
  const recentGames = [];
  
  // Add last game if available
  if (user?.gameStats?.lastGameScore !== undefined) {
    const lastGameDate = user?.gameStats?.lastGameDate ? new Date(user.gameStats.lastGameDate) : new Date();
    const timeAgo = getTimeAgo(lastGameDate);
    
    recentGames.push({
      id: 1,
      score: user.gameStats.lastGameScore,
      mode: 'classic',
      accuracy: user.gameStats.lastGameAccuracy || 0,
      date: timeAgo
    });
  }

  // Helper function to calculate time ago
  function getTimeAgo(date) {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  }

  // Achievements based on actual user progress
  const achievements = [
    { 
      name: 'First Steps', 
      description: 'Played your first game', 
      unlocked: (user?.gameStats?.gamesPlayed || 0) > 0 
    },
    { 
      name: 'Sharp Shooter', 
      description: 'Achieved 90% accuracy', 
      unlocked: (user?.gameStats?.lastGameAccuracy || 0) >= 90 
    },
    { 
      name: 'Century Club', 
      description: 'Scored over 100 points', 
      unlocked: (user?.gameStats?.highestScore || 0) >= 100 
    },
    { 
      name: 'High Scorer', 
      description: 'Scored over 500 points', 
      unlocked: (user?.gameStats?.highestScore || 0) >= 500 
    },
    { 
      name: 'Dedicated Player', 
      description: 'Played 10 games', 
      unlocked: (user?.gameStats?.gamesPlayed || 0) >= 10 
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {user?.username}! 👋
            </h1>
            <p className="text-gray-600">
              Ready to pop some bubbles and beat your high score?
            </p>
          </div>
          <Link to="/game">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              <Play className="mr-2 h-5 w-5" />
              Play Now
            </Button>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="px-3 py-1">
            Level {stats.level}
          </Badge>          <Badge variant="outline" className="px-3 py-1">
            {typeof stats.rank === 'number' ? `Rank #${stats.rank}` : 'Unranked'}
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            {stats.gamesPlayed} games played
          </Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highest Score</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.highestScore.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Your personal best
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across {stats.gamesPlayed} games
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.accuracy}%</div>
            <p className="text-xs text-muted-foreground">
              Average hit rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Experience</CardTitle>
            <Star className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>            <div className="text-2xl font-bold">{stats.experience.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Level {stats.level} • {stats.experience > 0 ? Math.max(0, (stats.level * 1000) - stats.experience) : 1000} to next
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Games */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Recent Games</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentGames.map((game) => (
                <div key={game.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{game.score.toLocaleString()} points</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Badge variant="outline" className="text-xs">
                        {game.mode}
                      </Badge>
                      <span>{game.accuracy}% accuracy</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {game.date}
                  </div>
                </div>
              ))}
              {recentGames.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No games played yet!</p>
                  <Link to="/game">
                    <Button className="mt-2" size="sm">
                      Play Your First Game
                    </Button>
                  </Link>
                </div>
              )}
            </div>
            <div className="mt-4">
              <Link to="/stats">
                <Button variant="outline" className="w-full">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View All Stats
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5" />
              <span>Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    achievement.unlocked 
                      ? 'bg-yellow-100 text-yellow-600' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    <Trophy className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className={`font-medium ${
                        achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {achievement.name}
                      </p>
                      {achievement.unlocked && (
                        <Badge variant="secondary" className="text-xs">
                          Unlocked
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                <Star className="mr-2 h-4 w-4" />
                View All Achievements
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/game">
              <Button className="w-full h-16 bg-green-600 hover:bg-green-700">
                <div className="text-center">
                  <Play className="h-6 w-6 mx-auto mb-1" />
                  <div className="text-sm">Start New Game</div>
                </div>
              </Button>
            </Link>
            
            <Link to="/leaderboard">
              <Button variant="outline" className="w-full h-16">
                <div className="text-center">
                  <Trophy className="h-6 w-6 mx-auto mb-1" />
                  <div className="text-sm">View Leaderboard</div>
                </div>
              </Button>
            </Link>
            
            <Link to="/profile">
              <Button variant="outline" className="w-full h-16">
                <div className="text-center">
                  <TrendingUp className="h-6 w-6 mx-auto mb-1" />
                  <div className="text-sm">Update Profile</div>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
