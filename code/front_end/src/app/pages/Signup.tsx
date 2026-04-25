import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Mail, Lock, User, Phone, ArrowRight, GraduationCap, Home, Briefcase } from 'lucide-react';
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

const USER_TYPES = [
  { value: 'student', label: 'Student', icon: GraduationCap, desc: 'Looking for a room' },
  { value: 'professional', label: 'Professional', icon: Briefcase, desc: 'Working professional' },
  { value: 'landlord', label: 'Landlord', icon: Home, desc: 'Have rooms to rent' },
];

export function Signup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'student',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: formData.userType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      alert("Registration successful! Please login.");
      navigate('/login');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: '#f7fafa' }}>
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-4">
            <MyStayLogo />
            <div className="text-left">
              <p className="text-xl font-normal" style={{ fontFamily: "'DM Serif Display', serif", color: '#1a7a6e' }}>MyStay</p>
              <p className="text-xs tracking-widest uppercase" style={{ color: '#e07b39' }}>Find Your Space</p>
            </div>
          </Link>
          <h1 className="text-3xl font-normal mt-2" style={{ fontFamily: "'DM Serif Display', serif", color: '#0d1f1d' }}>
            Create your account
          </h1>
          <p className="mt-1" style={{ color: '#5a7874' }}>Join MyStay today — it's free</p>
        </div>

        <Card className="shadow-sm" style={{ border: '1px solid rgba(26,122,110,0.12)' }}>
          <CardContent className="pt-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role selector */}
              <div>
                <Label className="text-sm mb-3 block" style={{ color: '#0d1f1d' }}>I am a:</Label>
                <div className="grid grid-cols-3 gap-2">
                  {USER_TYPES.map(({ value, label, icon: Icon, desc }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleChange('userType', value)}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-center transition-all border-2 text-sm font-medium"
                      style={{
                        borderColor: formData.userType === value ? '#1a7a6e' : 'rgba(26,122,110,0.15)',
                        backgroundColor: formData.userType === value ? '#e8f5f3' : 'white',
                        color: formData.userType === value ? '#1a7a6e' : '#5a7874',
                      }}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <Label htmlFor="name" className="text-sm mb-2 block" style={{ color: '#0d1f1d' }}>Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#5a7874' }} />
                  <Input id="name" type="text" placeholder="Your full name" value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)} className="pl-10" required />
                </div>
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="email" className="text-sm mb-2 block" style={{ color: '#0d1f1d' }}>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#5a7874' }} />
                    <Input id="email" type="email" placeholder="you@example.com" value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)} className="pl-10" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm mb-2 block" style={{ color: '#0d1f1d' }}>Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#5a7874' }} />
                    <Input id="phone" type="tel" placeholder="077-1234567" value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)} className="pl-10" required />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password" className="text-sm mb-2 block" style={{ color: '#0d1f1d' }}>Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#5a7874' }} />
                  <Input id="password" type="password" placeholder="Create a password" value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)} className="pl-10" required />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <Label htmlFor="confirmPassword" className="text-sm mb-2 block" style={{ color: '#0d1f1d' }}>Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#5a7874' }} />
                  <Input id="confirmPassword" type="password" placeholder="Confirm your password" value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)} className="pl-10" required />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full gap-2 font-semibold"
                size="lg"
                disabled={isLoading}
                style={{ backgroundColor: '#1a7a6e', color: 'white', border: 'none' }}
              >
                {isLoading ? 'Creating Account…' : (
                  <>Create Account <ArrowRight className="w-4 h-4" /></>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm mt-6" style={{ color: '#5a7874' }}>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold hover:underline" style={{ color: '#e07b39' }}>
            Sign in
          </Link>
        </p>
        <p className="text-center text-xs mt-3" style={{ color: 'rgba(90,120,116,0.5)' }}>
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
