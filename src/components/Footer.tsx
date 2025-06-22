
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Clock, 
  GraduationCap, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram 
} from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Job Portal</h3>
            <p className="text-gray-400 mb-4">
              Connecting talented professionals with amazing opportunities. 
              Find your next career move with us.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
              <Linkedin className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Access Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Job Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/internships" 
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <GraduationCap className="w-4 h-4" />
                  Internships
                </Link>
              </li>
              <li>
                <Link 
                  to="/part-time" 
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Clock className="w-4 h-4" />
                  Part-Time Jobs
                </Link>
              </li>
              <li>
                <Link 
                  to="/full-time" 
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Briefcase className="w-4 h-4" />
                  Full-Time Jobs
                </Link>
              </li>
              <li>
                <Link 
                  to="/jobs" 
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Building2 className="w-4 h-4" />
                  All Opportunities
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@jobportal.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>123 Business St, City, State 12345</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p>&copy; 2025 Job Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
