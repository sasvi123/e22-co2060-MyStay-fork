import { useState } from 'react';
import { Link } from 'react-router';
import { Search, MapPin, DollarSign, Users, Star, Filter } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { mockListings, BoardingListing } from '../data/mockListings';
import { imageMapping } from '../data/imageMapping';

export function Browse() {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [roomTypeFilter, setRoomTypeFilter] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<string>('all');

  const filteredListings = mockListings.filter((listing) => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPrice = priceFilter === 'all' || 
                        (priceFilter === 'low' && listing.price < 10000) ||
                        (priceFilter === 'medium' && listing.price >= 10000 && listing.price < 15000) ||
                        (priceFilter === 'high' && listing.price >= 15000);
    
    const matchesRoomType = roomTypeFilter === 'all' || listing.roomType === roomTypeFilter;
    const matchesAvailability = availabilityFilter === 'all' || listing.availability === availabilityFilter;
    const matchesGender = genderFilter === 'all' || listing.gender === genderFilter;

    return matchesSearch && matchesPrice && matchesRoomType && matchesAvailability && matchesGender;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Browse Boarding Places</h1>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search by title or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Price Range</label>
                  <Select value={priceFilter} onValueChange={setPriceFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="low">Under Rs. 10,000</SelectItem>
                      <SelectItem value="medium">Rs. 10,000 - 15,000</SelectItem>
                      <SelectItem value="high">Above Rs. 15,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Room Type</label>
                  <Select value={roomTypeFilter} onValueChange={setRoomTypeFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Double">Double</SelectItem>
                      <SelectItem value="Triple">Triple</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Availability</label>
                  <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Not Available">Not Available</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Gender</label>
                  <Select value={genderFilter} onValueChange={setGenderFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Any">Any</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-4 text-gray-600">
          Showing {filteredListings.length} {filteredListings.length === 1 ? 'result' : 'results'}
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <Link key={listing.id} to={`/listing/${listing.id}`}>
              <Card className="hover:shadow-lg transition-shadow h-full cursor-pointer">
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={imageMapping[listing.images[0]]}
                    alt={listing.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg line-clamp-1">{listing.title}</h3>
                    {listing.availability === 'Available' ? (
                      <Badge className="bg-green-500">Available</Badge>
                    ) : (
                      <Badge variant="secondary">Not Available</Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{listing.location} • {listing.distance}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-semibold text-blue-600">Rs. {listing.price.toLocaleString()}/month</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{listing.roomType} • {listing.gender}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{listing.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {listing.facilities.slice(0, 3).map((facility, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {facility}
                      </Badge>
                    ))}
                    {listing.facilities.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{listing.facilities.length - 3} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No listings found matching your criteria.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchTerm('');
                setPriceFilter('all');
                setRoomTypeFilter('all');
                setAvailabilityFilter('all');
                setGenderFilter('all');
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
