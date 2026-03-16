import { Link, useLocation } from 'react-router';
import { Button } from './ui/button';
import { Home, Search, PlusCircle, User, LogIn } from 'lucide-react';

export function Header() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Home className="w-6 h-6 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">MyStay</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`hover:text-blue-600 transition-colors ${isActive('/') ? 'text-blue-600 font-semibold' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/browse" 
              className={`hover:text-blue-600 transition-colors ${isActive('/browse') ? 'text-blue-600 font-semibold' : ''}`}
            >
              Browse Listings
            </Link>
            <Link 
              to="/landlord-dashboard" 
              className={`hover:text-blue-600 transition-colors ${isActive('/landlord-dashboard') ? 'text-blue-600 font-semibold' : ''}`}
            >
              For Landlords
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
