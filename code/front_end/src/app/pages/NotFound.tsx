import { Link } from 'react-router';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '../components/ui/button';

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#f7fafa' }}>
      <div className="text-center max-w-md">
        <div className="mb-8">
          <p className="text-8xl font-normal mb-2" style={{ fontFamily: "'DM Serif Display', serif", color: '#1a7a6e' }}>404</p>
          <div className="w-16 h-1 rounded-full mx-auto" style={{ backgroundColor: '#e07b39' }} />
        </div>
        <h2 className="text-2xl font-semibold mb-3" style={{ color: '#0d1f1d' }}>Page Not Found</h2>
        <p className="mb-8 leading-relaxed" style={{ color: '#5a7874' }}>
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/">
            <Button size="lg" className="gap-2 font-semibold" style={{ backgroundColor: '#1a7a6e', color: 'white', border: 'none' }}>
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          <Link to="/browse">
            <Button size="lg" variant="outline" className="gap-2" style={{ borderColor: '#1a7a6e', color: '#1a7a6e' }}>
              Browse Listings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
