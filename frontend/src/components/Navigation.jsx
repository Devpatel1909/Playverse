import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, Calendar, Archive, Menu } from 'lucide-react';

const Navigation = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Trophy className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold text-gray-900">PlayVerse</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/scores" 
              className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
            >
              <Trophy className="w-4 h-4" />
              <span>Scores</span>
            </Link>
            <Link 
              to="/schedule" 
              className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule</span>
            </Link>
            <Link 
              to="/archives" 
              className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
            >
              <Archive className="w-4 h-4" />
              <span>Archives</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
