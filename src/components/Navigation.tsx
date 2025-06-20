
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Menu, X, Briefcase, Users, Clock, MapPin, Settings } from 'lucide-react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTopAiringOpen, setIsTopAiringOpen] = useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TalentSpur
              </h1>
              <span className="text-xs text-gray-500">Top Job Portal</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Home
            </Link>
            
            {/* Top Airing Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsTopAiringOpen(!isTopAiringOpen)}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Top Airing
                <ChevronDown className={`w-4 h-4 transition-transform ${isTopAiringOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isTopAiringOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                  <Link
                    to="/jobs"
                    className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={() => setIsTopAiringOpen(false)}
                  >
                    <Briefcase className="w-4 h-4" />
                    Jobs
                  </Link>
                  <Link
                    to="/internships"
                    className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={() => setIsTopAiringOpen(false)}
                  >
                    <Users className="w-4 h-4" />
                    Internships
                  </Link>
                  <Link
                    to="/full-time"
                    className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={() => setIsTopAiringOpen(false)}
                  >
                    <Clock className="w-4 h-4" />
                    Full-Time
                  </Link>
                  <Link
                    to="/part-time"
                    className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={() => setIsTopAiringOpen(false)}
                  >
                    <MapPin className="w-4 h-4" />
                    Part-Time
                  </Link>
                </div>
              )}
            </div>

            <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Contact Us
            </Link>
            <Link to="/privacy" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Terms & Conditions
            </Link>
            
            <Link to="/admin">
              <Button variant="outline" className="flex items-center gap-2 hover:bg-blue-50">
                <Settings className="w-4 h-4" />
                Admin Portal
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Home
              </Link>
              <div className="pl-4 space-y-2">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Top Airing</p>
                <Link to="/jobs" className="block text-gray-700 hover:text-blue-600 transition-colors">
                  Jobs
                </Link>
                <Link to="/internships" className="block text-gray-700 hover:text-blue-600 transition-colors">
                  Internships
                </Link>
                <Link to="/full-time" className="block text-gray-700 hover:text-blue-600 transition-colors">
                  Full-Time
                </Link>
                <Link to="/part-time" className="block text-gray-700 hover:text-blue-600 transition-colors">
                  Part-Time
                </Link>
              </div>
              <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                About Us
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Contact Us
              </Link>
              <Link to="/privacy" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Terms & Conditions
              </Link>
              <Link to="/admin" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Admin Portal
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
