import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Label } from '../components/ui/label';

function MyStayLogo() {
  return (
    <svg width="44" height="44" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 4L4 20V44H18V32H30V44H44V20L24 4Z" fill="#1a7a6e"/>
      <path d="M24 4L4 20H44L24 4Z" fill="#2a9d8f"/>
      <path d="M14 26V38H17V30L21 35L24 30.5L27 35L31 30V38H34V26L24 21L14 26Z" fill="white"/>
      <rect x="20" y="34" width="8" height="10" rx="1" fill="#e07b39"/>
    </svg>
  );
}

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      alert("Login successful!");

      if (data.user.role === 'landlord') {
        navigate('/landlord-dashboard');
      } else {
        navigate('/browse');
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f7fafa' }}>
      {/* Left panel – decorative */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d1f1d 0%, #1a7a6e 100%)' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10" style={{ backgroundColor: '#52b788' }} />
          <div className="absolute bottom-20 -left-10 w-56 h-56 rounded-full opacity-10" style={{ backgroundColor: '#e07b39' }} />
        </div>
        <Link to="/" className="flex items-center gap-3 relative z-10">
          <MyStayLogo />
          <div>
            <p className="text-white text-xl font-normal" style={{ fontFamily: "'DM Serif Display', serif" }}>MyStay</p>
            <p className="text-xs tracking-widest uppercase" style={{ color: '#52b788' }}>Find Your Space</p>
          </div>
        </Link>
        <div className="relative z-10">
          <h2 className="text-4xl font-normal text-white mb-4 leading-snug" style={{ fontFamily: "'DM Serif Display', serif" }}>
            Your next home<br />
            <span style={{ color: '#52b788', fontStyle: 'italic' }}>is one click away</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', lineHeight: '1.7' }}>
            Connect with verified boarding places near University of Peradeniya — fast, transparent, and hassle-free.
          </p>
        </div>
        <p className="text-xs relative z-10" style={{ color: 'rgba(255,255,255,0.35)' }}>
          © 2026 MyStay · CO2060 Software Systems
        </p>
      </div>

      {/* Right panel – form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <Link to="/" className="inline-flex items-center gap-3">
              <MyStayLogo />
              <div className="text-left">
                <p className="text-xl font-normal" style={{ fontFamily: "'DM Serif Display', serif", color: '#1a7a6e' }}>MyStay</p>
                <p className="text-xs tracking-widest uppercase" style={{ color: '#e07b39' }}>Find Your Space</p>
              </div>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-normal mb-2" style={{ fontFamily: "'DM Serif Display', serif", color: '#0d1f1d' }}>
              Welcome back
            </h1>
            <p style={{ color: '#5a7874' }}>Sign in to continue to MyStay</p>
          </div>

          <Card className="shadow-sm border-0" style={{ border: '1px solid rgba(26,122,110,0.12)' }}>
            <CardContent className="pt-6 pb-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="email" className="text-sm mb-2 block" style={{ color: '#0d1f1d' }}>Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#5a7874' }} />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="password" className="text-sm" style={{ color: '#0d1f1d' }}>Password</Label>
                    <a href="#" className="text-xs hover:underline" style={{ color: '#1a7a6e' }}>Forgot password?</a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#5a7874' }} />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="remember" className="rounded w-4 h-4" style={{ accentColor: '#1a7a6e' }} />
                  <label htmlFor="remember" className="text-sm" style={{ color: '#5a7874' }}>Remember me</label>
                </div>

                <Button
                  type="submit"
                  className="w-full gap-2 font-semibold"
                  size="lg"
                  disabled={isLoading}
                  style={{ backgroundColor: '#1a7a6e', color: 'white', border: 'none' }}
                >
                  {isLoading ? 'Signing in…' : (
                    <>Sign In <ArrowRight className="w-4 h-4" /></>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-sm mt-6" style={{ color: '#5a7874' }}>
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold hover:underline" style={{ color: '#e07b39' }}>
              Sign up free
            </Link>
          </p>

          <p className="text-center text-xs mt-4" style={{ color: 'rgba(90,120,116,0.6)' }}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
