import { Link } from 'react-router';
import { Search, MapPin, Shield, Clock, TrendingUp, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { imageMapping } from '../data/imageMapping';

export function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Find Your Perfect Boarding Place
            </h1>
            <p className="text-xl mb-8">
              A centralized platform connecting students and professionals with quality boarding accommodations near University of Peradeniya
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/browse">
                <Button size="lg" variant="secondary">
                  <Search className="w-5 h-5 mr-2" />
                  Browse Listings
                </Button>
              </Link>
              <Link to="/landlord-dashboard">
                <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-blue-600">
                  List Your Property
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">The Problem We Solve</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-6">
                  <Clock className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="font-bold mb-2">Time-Consuming Search</h3>
                  <p className="text-gray-600">
                    Students waste hours visiting unsuitable boarding places scattered across social media and word-of-mouth
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Shield className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="font-bold mb-2">Lack of Transparency</h3>
                  <p className="text-gray-600">
                    No clear information about pricing, facilities, and availability leads to confusion and frustration
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Users className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="font-bold mb-2">Landlord Challenges</h3>
                  <p className="text-gray-600">
                    Property owners struggle to reach genuine tenants efficiently and manage their listings
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose MyStay?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold mb-2">Advanced Search</h3>
              <p className="text-gray-600">Filter by location, price, room type, and facilities to find exactly what you need</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold mb-2">Location-Based</h3>
              <p className="text-gray-600">See distance from University of Peradeniya and nearby amenities</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold mb-2">Verified Listings</h3>
              <p className="text-gray-600">All listings are reviewed to ensure accuracy and reliability</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold mb-2">Save Time</h3>
              <p className="text-gray-600">Browse multiple options in minutes instead of days of searching</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold mb-2">Easy Management</h3>
              <p className="text-gray-600">Landlords can add, update, and manage listings with ease</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold mb-2">User-Friendly</h3>
              <p className="text-gray-600">Simple, intuitive interface designed for students and landlords</p>
            </div>
          </div>
        </div>
      </section>

      {/* MVP Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Current Features (MVP)</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  ✓
                </div>
                <div>
                  <h3 className="font-bold mb-1">User Registration & Login</h3>
                  <p className="text-gray-600">Secure authentication for students and landlords</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  ✓
                </div>
                <div>
                  <h3 className="font-bold mb-1">Boarding Place Listings</h3>
                  <p className="text-gray-600">Comprehensive listing database with photos and details</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  ✓
                </div>
                <div>
                  <h3 className="font-bold mb-1">Search & Filter</h3>
                  <p className="text-gray-600">Filter by location, price, room type, and availability</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  ✓
                </div>
                <div>
                  <h3 className="font-bold mb-1">Landlord Dashboard</h3>
                  <p className="text-gray-600">Easy-to-use interface for managing property listings</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Ideal Boarding Place?</h2>
          <p className="text-xl mb-8">Join MyStay today and experience hassle-free accommodation search</p>
          <Link to="/browse">
            <Button size="lg" variant="secondary">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
