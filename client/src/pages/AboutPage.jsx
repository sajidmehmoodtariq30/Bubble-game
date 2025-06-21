import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { 
  Target, 
  Zap, 
  Clock, 
  Trophy,
  GamepadIcon,
  Users,
  Star,
  Lightbulb
} from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <Badge variant="secondary" className="px-4 py-2">
          🎮 About Bubble Game
        </Badge>
        <h1 className="text-5xl font-bold">
          The Most Addictive
          <span className="block bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Bubble-Popping Experience
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Built with modern web technologies and designed for competitive play, 
          our bubble game combines classic arcade fun with modern social features.
        </p>
      </section>

      {/* How to Play */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How to Play</h2>
          <p className="text-lg text-gray-600">Master the art of bubble popping in just a few simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">1. Find the Target</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Look at the target number displayed at the top. This is the number you need to find and click.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">2. Click Fast</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Scan the bubble field quickly and click on bubbles that match the target number.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">3. Beat the Clock</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Race against time! Each correct click gives you points and generates new bubbles.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle className="text-lg">4. Set Records</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Aim for high scores, climb leaderboards, and unlock achievements!
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Game Modes */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Game Modes</h2>
          <p className="text-lg text-gray-600">Choose your preferred challenge level</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <GamepadIcon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle>Classic Mode</CardTitle>
                  <CardDescription>30 seconds of pure bubble-popping action</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                The original game mode that started it all. You have 30 seconds to pop as many 
                correct bubbles as possible. Perfect for quick games and beating your personal best.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <CardTitle>Time Attack</CardTitle>
                  <CardDescription>Race against an even faster clock</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                For players who want the ultimate challenge. Shorter time limits but higher score 
                multipliers. Test your reflexes and see how many bubbles you can pop under pressure.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Endless Mode</CardTitle>
                  <CardDescription>Play until you can't keep up</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                No time limit, but the game gets progressively faster. See how long you can 
                survive as the pace increases. Perfect for zen gaming and flow states.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Star className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle>Challenge Mode</CardTitle>
                  <CardDescription>Special objectives and unique rules</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Rotating special challenges with unique objectives. Maybe you can only pop 
                certain colors, or you need to achieve specific accuracy rates. Always changing!
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Scoring System */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Scoring & Progression</h2>
          <p className="text-lg text-gray-600">Every click counts towards your gaming journey</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                <span>Points System</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Correct bubble</span>
                <Badge>+10 points</Badge>
              </div>
              <div className="flex justify-between">
                <span>Combo (3+ in a row)</span>
                <Badge variant="secondary">+5 bonus</Badge>
              </div>
              <div className="flex justify-between">
                <span>Perfect accuracy</span>
                <Badge variant="outline">+50 bonus</Badge>
              </div>
              <div className="flex justify-between">
                <span>Time remaining</span>
                <Badge variant="secondary">+1 per second</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-purple-600" />
                <span>Experience & Levels</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">
                Earn experience points with every game to level up your profile:
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Level 1-10</span>
                  <span className="text-sm text-gray-500">Beginner</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Level 11-25</span>
                  <span className="text-sm text-gray-500">Intermediate</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Level 26-50</span>
                  <span className="text-sm text-gray-500">Advanced</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Level 51+</span>
                  <span className="text-sm text-gray-500">Master</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-orange-600" />
                <span>Pro Tips</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <p>• <strong>Scan quickly:</strong> Your eyes should move in patterns</p>
                <p>• <strong>Stay calm:</strong> Panic leads to misclicks</p>
                <p>• <strong>Practice daily:</strong> Consistency improves reaction time</p>
                <p>• <strong>Use peripheral vision:</strong> Don't focus too narrowly</p>
                <p>• <strong>Take breaks:</strong> Fresh eyes perform better</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="bg-gray-50 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Built with Modern Technology</h2>
          <p className="text-lg text-gray-600">
            Powered by the latest web technologies for the best gaming experience
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-blue-600 font-bold">R</span>
            </div>
            <p className="font-semibold">React 19</p>
            <p className="text-sm text-gray-600">Latest React features</p>
          </div>
          
          <div className="space-y-2">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-purple-600 font-bold">V</span>
            </div>
            <p className="font-semibold">Vite</p>
            <p className="text-sm text-gray-600">Lightning fast builds</p>
          </div>
          
          <div className="space-y-2">
            <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-cyan-600 font-bold">T</span>
            </div>
            <p className="font-semibold">Tailwind CSS</p>
            <p className="text-sm text-gray-600">Modern styling</p>
          </div>
          
          <div className="space-y-2">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-green-600 font-bold">N</span>
            </div>
            <p className="font-semibold">Node.js</p>
            <p className="text-sm text-gray-600">Powerful backend</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
