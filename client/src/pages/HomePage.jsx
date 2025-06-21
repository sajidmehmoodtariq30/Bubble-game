import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { 
  Play, 
  Trophy, 
  Users, 
  Target, 
  Zap, 
  Star,
  ArrowRight,
  GamepadIcon,
  BarChart3
} from 'lucide-react';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-12">
        <div className="space-y-4">
          <Badge variant="secondary" className="px-4 py-2 text-sm">
            🎮 The Ultimate Bubble Game Experience
          </Badge>
          <h1 className="text-6xl font-bold tracking-tight">
            Pop Bubbles,
            <span className="block bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Break Records
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Challenge yourself with the most addictive bubble-popping game. 
            Compete with friends, unlock achievements, and climb the leaderboards!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {isAuthenticated ? (
            <>
              <Link to="/game">
                <Button size="lg" className="text-lg px-8 py-6 bg-green-600 hover:bg-green-700">
                  <Play className="mr-2 h-5 w-5" />
                  Play Now
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  View Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/register">
                <Button size="lg" className="text-lg px-8 py-6 bg-green-600 hover:bg-green-700">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-bold">Why Players Love Bubble Game</h2>
          <p className="text-xl text-gray-600">
            Experience the perfect blend of fun, competition, and skill
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Precision Gameplay</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Test your reflexes and accuracy with fast-paced bubble-popping action.
                Every click counts in this skill-based game.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Competitive Leaderboards</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Climb to the top of global rankings and compete with players worldwide.
                Track your progress and see how you stack up.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Achievements & Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Unlock achievements, earn experience points, and level up your profile.
                Show off your gaming prowess to the community.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Game Modes Section */}
      <section className="py-16 bg-gray-50 rounded-2xl">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-bold">Multiple Game Modes</h2>
          <p className="text-xl text-gray-600">
            Choose your preferred way to play and challenge yourself
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <GamepadIcon className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Classic Mode</h3>
            <p className="text-gray-600 text-sm">30 seconds of bubble-popping fun</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Time Attack</h3>
            <p className="text-gray-600 text-sm">Race against the clock for high scores</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Endless Mode</h3>
            <p className="text-gray-600 text-sm">Play as long as you can survive</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Challenge Mode</h3>
            <p className="text-gray-600 text-sm">Special objectives and limited bubbles</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="text-center py-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl text-white">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">Ready to Start Popping?</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Join thousands of players worldwide and see if you have what it takes 
              to reach the top of the leaderboards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                  Create Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/leaderboard">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-green-600">
                  View Leaderboard
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
