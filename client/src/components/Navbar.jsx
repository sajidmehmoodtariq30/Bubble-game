import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Trophy,
  GamepadIcon,
  BarChart3,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-green-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Bubble Game
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-green-600 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/game"
                  className="text-gray-600 hover:text-green-600 transition-colors flex items-center space-x-1"
                >
                  <GamepadIcon className="w-4 h-4" />
                  <span>Play</span>
                </Link>
                <Link
                  to="/leaderboard"
                  className="text-gray-600 hover:text-green-600 transition-colors flex items-center space-x-1"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Leaderboard</span>
                </Link>
                <Link
                  to="/stats"
                  className="text-gray-600 hover:text-green-600 transition-colors flex items-center space-x-1"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Stats</span>
                </Link>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.avatar?.url} alt={user?.username} />
                        <AvatarFallback className="bg-green-500 text-white">
                          {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.username}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            Level {user?.gameStats?.level || 1}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {user?.gameStats?.gamesPlayed || 0} games
                          </Badge>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/about" className="text-gray-600 hover:text-green-600 transition-colors">
                  About
                </Link>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-green-600 hover:bg-green-700">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="h-10 w-10 p-0"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-green-200 py-4 space-y-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-3 px-4 py-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar?.url} alt={user?.username} />
                    <AvatarFallback className="bg-green-500 text-white">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user?.username}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                    onClick={toggleMobileMenu}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/game"
                    className="block px-4 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                    onClick={toggleMobileMenu}
                  >
                    Play Game
                  </Link>
                  <Link
                    to="/leaderboard"
                    className="block px-4 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                    onClick={toggleMobileMenu}
                  >
                    Leaderboard
                  </Link>
                  <Link
                    to="/stats"
                    className="block px-4 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                    onClick={toggleMobileMenu}
                  >
                    Statistics
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                    onClick={toggleMobileMenu}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                    onClick={toggleMobileMenu}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/about"
                  className="block px-4 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                  onClick={toggleMobileMenu}
                >
                  About
                </Link>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                  onClick={toggleMobileMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
                  onClick={toggleMobileMenu}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
