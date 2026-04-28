import { Link } from 'react-router';
import { Search, MapPin, Shield, Clock, TrendingUp, Users, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

export function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f7fafa' }}>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-24 md:py-32" style={{ background: 'linear-gradient(135deg, #0d1f1d 0%, #1a7a6e 60%, #2a9d8f 100%)' }}>
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: '#52b788' }} />
          <div className="absolute bottom-0 -left-16 w-64 h-64 rounded-full opacity-10" style={{ backgroundColor: '#e07b39' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5" style={{ border: '1px solid white' }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8" style={{ backgroundColor: 'rgba(82,183,136,0.2)', color: '#e4efea', border: '1px solid rgba(220, 236, 228, 0.3)' }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#e4efea' }} />
              Near University of Peradeniya
            </div>
            <h1 className="text-5xl md:text-6xl font-normal mb-6 text-white leading-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Find Your Perfect<br />
              <span style={{ color: '#52b788', fontStyle: 'italic' }}>Boarding Place</span>
            </h1>
            <p className="text-lg md:text-xl mb-10 leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
              A centralized platform connecting students and professionals with quality boarding accommodations — transparent, fast, and verified.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/browse">
                <Button size="lg" className="gap-2 px-8 text-base font-semibold shadow-lg" style={{ backgroundColor: '#e07b39', color: 'white', border: 'none' }}>
                  <Search className="w-5 h-5" />
                  Browse Listings
                </Button>
              </Link>
              <Link to="/landlord-dashboard">
                <Button size="lg" variant="outline" className="gap-2 px-8 text-base font-medium" style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white', backgroundColor: '#e07b39' }}>
                  List Your Property
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Stats row */}
            <div className="mt-16 grid grid-cols-3 gap-6 max-w-md mx-auto">
              {[
                { value: '100+', label: 'Listings' },
                { value: '500+', label: 'Students' },
                { value: '4.5★', label: 'Avg Rating' },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="text-2xl font-bold text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>{value}</p>
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Problems We Solve ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: '#e07b39' }}>The Problem</p>
              <h2 className="text-4xl font-normal" style={{ fontFamily: "'DM Serif Display', serif", color: '#0d1f1d' }}>
                Boarding Hunt:<br />A Frustrating Student Experienc
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Clock,
                  title: 'Time-Consuming Search',
                  desc: 'Students waste hours visiting unsuitable boarding places scattered across social media and word-of-mouth.',
                  color: '#1a7a6e',
                  bg: '#e8f5f3',
                },
                {
                  icon: Shield,
                  title: 'Lack of Transparency',
                  desc: 'No clear information about pricing, facilities, and availability leads to confusion and frustration.',
                  color: '#1a7a6e',
                  bg: '#e8f5f3',
                },
                {
                  icon: Users,
                  title: 'Landlord Challenges',
                  desc: 'Property owners struggle to reach genuine tenants efficiently and manage their listings well.',
                  color: '#1a7a6e',
                  bg: '#e8f5f3',
                },
              ].map(({ icon: Icon, title, desc, color, bg }) => (
                <Card key={title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-6 pb-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: bg }}>
                      <Icon className="w-6 h-6" style={{ color: '#2b534e' }} />
                    </div>
                    <h3 className="font-semibold mb-2" style={{ color: '#0d1f1d' }}>{title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#5a7874' }}>{desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Why MyStay ── */}
      <section className="py-20" style={{ backgroundColor: '#f7fafa' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: '#e07b39' }}>Why MyStay</p>
            <h2 className="text-4xl font-normal" style={{ fontFamily: "'DM Serif Display', serif", color: '#0d1f1d' }}>
              Everything You Need,<br />In One Place
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Search, title: 'Advanced Search', desc: 'Filter by location, price, room type, and facilities to find exactly what you need.' },
              { icon: MapPin, title: 'Location-Based', desc: 'See distance from University of Peradeniya and nearby amenities at a glance.' },
              { icon: Shield, title: 'Verified Listings', desc: 'All listings are reviewed to ensure accuracy and reliability for students.' },
              { icon: Clock, title: 'Save Time', desc: 'Browse multiple options in minutes instead of days of searching.' },
              { icon: TrendingUp, title: 'Easy Management', desc: 'Landlords can add, update, and manage listings with a simple dashboard.' },
              { icon: Users, title: 'User-Friendly', desc: 'Simple, intuitive interface designed for students and landlords alike.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center mt-0.5" style={{ backgroundColor: '#e8f5f3' }}>
                  <Icon className="w-5 h-5" style={{ color: '#1a7a6e' }} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: '#0d1f1d' }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#5a7874' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MVP Features ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: '#e07b39' }}>What's Available</p>
              <h2 className="text-4xl font-normal" style={{ fontFamily: "'DM Serif Display', serif", color: '#0d1f1d' }}>
                Current Features
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: 'User Registration & Login', desc: 'Secure authentication for students and landlords' },
                { title: 'Boarding Place Listings', desc: 'Comprehensive database with photos and details' },
                { title: 'Search & Filter', desc: 'Filter by location, price, room type, and availability' },
                { title: 'Landlord Dashboard', desc: 'Easy-to-use interface for managing property listings' },
              ].map(({ title, desc }) => (
                <div key={title} className="flex items-start gap-4 p-4 rounded-xl" style={{ backgroundColor: '#f7fafa', border: '1px solid rgba(26,122,110,0.1)' }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: '#1a7a6e' }}>
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-0.5" style={{ color: '#0d1f1d' }}>{title}</h3>
                    <p className="text-sm" style={{ color: '#5a7874' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #1a7a6e 0%, #2a9d8f 100%)' }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-normal mb-4 text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>
            Ready to Find Your<br />
            <span style={{ fontStyle: 'italic' }}>Ideal Boarding Place?</span>
          </h2>
          <p className="text-lg mb-10" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Join MyStay today and experience hassle-free accommodation search
          </p>
          <Link to="/browse">
            <Button size="lg" className="px-10 text-base font-semibold shadow-lg gap-2" style={{ backgroundColor: '#e07b39', color: 'white', border: 'none' }}>
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
