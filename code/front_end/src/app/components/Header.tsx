import { Link, useLocation } from 'react-router';
import { Button } from './ui/button';
import { LogIn, Menu, X } from 'lucide-react';
import { useState } from 'react';

function MyStayLogo() {
  return (
    <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* House shape */}
      <path d="M24 4L4 20V44H18V32H30V44H44V20L24 4Z" fill="#1a7a6e"/>
      {/* Roof accent */}
      <path d="M24 4L4 20H44L24 4Z" fill="#2a9d8f"/>
      {/* M letter in house */}
      <path d="M14 26V38H17V30L21 35L24 30.5L27 35L31 30V38H34V26L24 21L14 26Z" fill="white"/>
      {/* Orange door accent */}
      <rect x="20" y="34" width="8" height="10" rx="1" fill="#e07b39"/>
    </svg>
  );
}

export function Header() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/browse', label: 'Browse Listings' },
    { to: '/landlord-dashboard', label: 'For Landlords' },
  ];

  return (
    <header className="border-b bg-white sticky top-0 z-50 shadow-sm" style={{ borderColor: 'rgba(26,122,110,0.12)' }}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <MyStayLogo />
            <div className="flex flex-col leading-none">
              <span className="text-xl font-bold" style={{ color: '#1a7a6e', fontFamily: "'DM Serif Display', serif" }}>
                MyStay
              </span>
              <span className="text-[10px] tracking-widest uppercase" style={{ color: '#e07b39', letterSpacing: '0.15em' }}>
                Find Your Space
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(to)
                    ? 'text-white'
                    : 'text-gray-600 hover:text-teal-700 hover:bg-teal-50'
                }`}
                style={isActive(to) ? { backgroundColor: '#1a7a6e', color: 'white' } : {}}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/login">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-sm font-medium"
                style={{ color: '#1a7a6e' }}
              >
                <LogIn className="w-4 h-4" />
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button
                size="sm"
                className="text-sm font-medium px-5"
                style={{ backgroundColor: '#e07b39', color: 'white', border: 'none' }}
              >
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg"
            style={{ color: '#1a7a6e' }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden mt-3 pb-3 border-t pt-3 space-y-1" style={{ borderColor: 'rgba(26,122,110,0.12)' }}>
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(to) ? 'text-white' : 'text-gray-700'
                }`}
                style={isActive(to) ? { backgroundColor: '#1a7a6e' } : {}}
              >
                {label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2">
              <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" size="sm" className="w-full" style={{ borderColor: '#1a7a6e', color: '#1a7a6e' }}>
                  Login
                </Button>
              </Link>
              <Link to="/signup" className="flex-1" onClick={() => setMobileOpen(false)}>
                <Button size="sm" className="w-full" style={{ backgroundColor: '#e07b39', color: 'white', border: 'none' }}>
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
