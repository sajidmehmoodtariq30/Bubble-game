import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Trophy, Medal, Crown, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LeaderboardPage = () => {
  const { user } = useAuth();

  // Real leaderboard data - currently empty, will be populated from API in future
  const leaderboardData = [];

  // User's stats
  const userStats = {
    rank: user?.gameStats?.gamesPlayed > 0 ? Math.max(1, 500 - (user?.gameStats?.highestScore || 0)) : null,
    bestScore: user?.gameStats?.highestScore || 0,
    gamesPlayed: user?.gameStats?.gamesPlayed || 0,
    accuracy: user?.gameStats?.lastGameAccuracy || 0
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Global Leaderboard</h1>
        <p className="text-lg text-gray-600">
          See how you stack up against the best bubble poppers worldwide
        </p>
        <div className="flex justify-center space-x-4">
          <Badge variant="secondary" className="px-4 py-2">
            🏆 Top Players
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            Updated in real-time
          </Badge>
        </div>
      </div>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-6 w-6 text-yellow-600" />
            <span>Top Players - Classic Mode</span>
          </CardTitle>
        </CardHeader>        <CardContent>
          <div className="space-y-4">
            {leaderboardData.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Rankings Yet</h3>
                <p className="text-gray-500 mb-4">
                  Be the first to set a high score and claim the top spot!
                </p>
                <Badge variant="outline" className="px-4 py-2">
                  Leaderboard coming soon
                </Badge>
              </div>
            ) : (
              leaderboardData.map((player) => (
                <div
                  key={player.rank}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    player.rank <= 3 
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    {/* Rank */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getRankBadgeColor(player.rank)}`}>
                      {getRankIcon(player.rank)}
                    </div>
                    
                    {/* Player Info */}
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={player.avatar} alt={player.username} />
                        <AvatarFallback className="bg-green-500 text-white">
                          {player.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-lg">{player.username}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>{player.gamesPlayed} games</span>
                          <span>•</span>
                          <span>{player.accuracy}% accuracy</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      {player.score.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">points</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-lg">Your Rank</CardTitle>
          </CardHeader>
          <CardContent>
            {userStats.rank ? (
              <>
                <div className="text-3xl font-bold text-blue-600">#{userStats.rank}</div>
                <p className="text-sm text-gray-600">Based on highest score</p>
              </>
            ) : (
              <>
                <div className="text-3xl font-bold text-gray-400">--</div>
                <p className="text-sm text-gray-600">Play a game to get ranked</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-lg">Your Best Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{userStats.bestScore.toLocaleString()}</div>
            {userStats.bestScore > 0 ? (
              <p className="text-sm text-gray-600">{userStats.gamesPlayed} games played</p>
            ) : (
              <p className="text-sm text-gray-600">No games played yet</p>
            )}
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-lg">Your Stats</CardTitle>
          </CardHeader>
          <CardContent>
            {userStats.accuracy > 0 ? (
              <>
                <div className="text-3xl font-bold text-purple-600">{userStats.accuracy}%</div>
                <p className="text-sm text-gray-600">Last game accuracy</p>
              </>
            ) : (
              <>
                <div className="text-3xl font-bold text-gray-400">--</div>
                <p className="text-sm text-gray-600">Play to see accuracy</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Game Mode Tabs Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Other Game Modes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg text-center">
              <h3 className="font-semibold">Time Attack</h3>
              <p className="text-sm text-gray-600">Coming soon</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg text-center">
              <h3 className="font-semibold">Endless Mode</h3>
              <p className="text-sm text-gray-600">Coming soon</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg text-center">
              <h3 className="font-semibold">Challenge Mode</h3>
              <p className="text-sm text-gray-600">Coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaderboardPage;
