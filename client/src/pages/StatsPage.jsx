import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Clock, 
  Trophy, 
  Star,
  Calendar,
  Award,
  Zap,
  Activity,
  Users,
  Timer
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const StatsPage = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  // Get user stats
  const stats = user?.gameStats || {
    gamesPlayed: 0,
    highestScore: 0,
    totalScore: 0,
    averageScore: 0,
    level: 1,
    experience: 0,
    lastGameScore: 0,
    lastGameAccuracy: 0,
    lastGameDate: null
  };

  // Calculate additional metrics
  const totalTime = stats.gamesPlayed * 30; // Assuming 30 seconds per game on average
  const averageAccuracy = stats.lastGameAccuracy || 0;
  const experienceToNext = Math.max(0, (stats.level * 1000) - stats.experience);
  const progressToNext = stats.experience > 0 ? ((stats.experience % 1000) / 1000) * 100 : 0;

  // Performance metrics
  const performanceMetrics = [
    {
      title: "Games Played",
      value: stats.gamesPlayed,
      icon: <Trophy className="h-5 w-5 text-blue-600" />,
      change: "+1 today",
      color: "text-blue-600"
    },
    {
      title: "Highest Score",
      value: stats.highestScore.toLocaleString(),
      icon: <Award className="h-5 w-5 text-yellow-600" />,
      change: stats.lastGameScore > stats.highestScore ? "New record!" : "Personal best",
      color: "text-yellow-600"
    },
    {
      title: "Average Score",
      value: stats.averageScore.toLocaleString(),
      icon: <BarChart3 className="h-5 w-5 text-green-600" />,
      change: stats.gamesPlayed > 1 ? "Across all games" : "First game",
      color: "text-green-600"
    },
    {
      title: "Last Accuracy",
      value: `${averageAccuracy}%`,
      icon: <Target className="h-5 w-5 text-purple-600" />,
      change: averageAccuracy >= 90 ? "Excellent!" : averageAccuracy >= 70 ? "Good!" : "Keep practicing!",
      color: "text-purple-600"
    }
  ];

  // Skill analysis
  const skillLevel = (score) => {
    if (score >= 500) return { level: "Expert", color: "text-red-600", bg: "bg-red-100" };
    if (score >= 300) return { level: "Advanced", color: "text-orange-600", bg: "bg-orange-100" };
    if (score >= 150) return { level: "Intermediate", color: "text-yellow-600", bg: "bg-yellow-100" };
    if (score >= 50) return { level: "Beginner", color: "text-green-600", bg: "bg-green-100" };
    return { level: "Novice", color: "text-gray-600", bg: "bg-gray-100" };
  };

  const currentSkill = skillLevel(stats.highestScore);

  // Achievements
  const achievements = [
    {
      title: "First Steps",
      description: "Play your first game",
      progress: stats.gamesPlayed >= 1 ? 100 : 0,
      unlocked: stats.gamesPlayed >= 1,
      icon: <Star className="h-4 w-4" />
    },
    {
      title: "Getting Started",
      description: "Play 5 games",
      progress: Math.min((stats.gamesPlayed / 5) * 100, 100),
      unlocked: stats.gamesPlayed >= 5,
      icon: <Activity className="h-4 w-4" />
    },
    {
      title: "Dedicated Player",
      description: "Play 25 games",
      progress: Math.min((stats.gamesPlayed / 25) * 100, 100),
      unlocked: stats.gamesPlayed >= 25,
      icon: <Users className="h-4 w-4" />
    },
    {
      title: "Sharp Shooter",
      description: "Achieve 90% accuracy",
      progress: Math.min((averageAccuracy / 90) * 100, 100),
      unlocked: averageAccuracy >= 90,
      icon: <Target className="h-4 w-4" />
    },
    {
      title: "Century Club",
      description: "Score 100+ points",
      progress: Math.min((stats.highestScore / 100) * 100, 100),
      unlocked: stats.highestScore >= 100,
      icon: <Trophy className="h-4 w-4" />
    },
    {
      title: "High Scorer",
      description: "Score 500+ points",
      progress: Math.min((stats.highestScore / 500) * 100, 100),
      unlocked: stats.highestScore >= 500,
      icon: <Award className="h-4 w-4" />
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Game Statistics</h1>
          <p className="text-gray-600 mt-2">Track your progress and performance</p>
        </div>
        <div className="flex space-x-2">
          {['all', 'week', 'month'].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className="capitalize"
            >
              {period === 'all' ? 'All Time' : `This ${period}`}
            </Button>
          ))}
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {metric.icon}
                  <span className="text-sm font-medium text-gray-600">{metric.title}</span>
                </div>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <div className="mt-2">
                <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
                <div className="text-xs text-gray-500">{metric.change}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Player Level & Experience */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              <span>Player Level</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-blue-600">Level {stats.level}</div>
                  <div className="text-sm text-gray-600">{stats.experience.toLocaleString()} XP</div>
                </div>
                <Badge className={`${currentSkill.bg} ${currentSkill.color} border-0`}>
                  {currentSkill.level}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to Level {stats.level + 1}</span>
                  <span>{experienceToNext} XP to go</span>
                </div>
                <Progress value={progressToNext} className="h-2" />
              </div>

              <div className="text-xs text-gray-500">
                Earn XP by scoring points in games. Every 1000 XP = 1 Level up!
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              <span>Game Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.gamesPlayed}</div>
                  <div className="text-sm text-gray-600">Total Games</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{Math.round(totalTime / 60)}m</div>
                  <div className="text-sm text-gray-600">Time Played</div>
                </div>
              </div>

              {stats.lastGameDate && (
                <div className="border-t pt-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Last played: {new Date(stats.lastGameDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                    <Trophy className="h-4 w-4" />
                    <span>Last score: {stats.lastGameScore} points</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-yellow-600" />
            <span>Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  achievement.unlocked 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    achievement.unlocked ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'
                  }`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${
                      achievement.unlocked ? 'text-green-700' : 'text-gray-600'
                    }`}>
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-gray-500">{achievement.description}</p>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className={achievement.unlocked ? 'text-green-600' : 'text-gray-500'}>
                      {achievement.unlocked ? 'Completed!' : 'In Progress'}
                    </span>
                    <span>{Math.round(achievement.progress)}%</span>
                  </div>
                  <Progress 
                    value={achievement.progress} 
                    className={`h-2 ${achievement.unlocked ? 'bg-green-100' : 'bg-gray-200'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span>Performance Tips</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Improve Your Score</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Focus on accuracy over speed initially</li>
                <li>• Look for target numbers quickly</li>
                <li>• Practice recognizing numbers at a glance</li>
                <li>• Stay calm under time pressure</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Level Up Faster</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Play consistently to build experience</li>
                <li>• Higher scores give more XP</li>
                <li>• Complete achievements for bonus progress</li>
                <li>• Try different game modes when available</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsPage;
