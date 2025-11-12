import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, Calendar, Archive, Menu } from 'lucide-react';

const Navigation = () => {
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 mx-auto max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Trophy className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold text-gray-900">PlayVerse</span>
          </Link>

          {/* Navigation Links */}
          <div className="items-center hidden space-x-8 md:flex">
            <Link 
              to="/scores" 
              className="flex items-center space-x-1 text-gray-700 transition-colors hover:text-red-600"
            >
              <Trophy className="w-4 h-4" />
              <span>Scores</span>
            </Link>
            <Link 
              to="/schedule" 
              className="flex items-center space-x-1 text-gray-700 transition-colors hover:text-red-600"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule</span>
            </Link>
            <Link 
              to="/archives" 
              className="flex items-center space-x-1 text-gray-700 transition-colors hover:text-red-600"
            >
              <Archive className="w-4 h-4" />
              <span>Archives</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="p-2 text-gray-700 rounded-md md:hidden hover:bg-gray-100">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
