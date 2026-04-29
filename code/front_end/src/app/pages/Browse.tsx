import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Search, MapPin, DollarSign, Users, Star, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

export function Browse() {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [roomTypeFilter, setRoomTypeFilter] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/stays');
        if (response.ok) {
          const data = await response.json();
          // Map backend fields to frontend expectations, using defaults for images/rating
          const formattedData = data.map((stay: any) => ({
            ...stay,
            id: stay.stay_id.toString(),
            location: stay.address,
            facilities: stay.facilities ? stay.facilities.split(',').map((f: string) => f.trim()) : [],
            rating: 4.5, 
            distance: 'Unknown distance', 
            availability: stay.availability || 'Available',
            price: Number(stay.price),
            roomType: stay.roomType || 'Single',
            gender: stay.gender || 'Any',
          }));
          setListings(formattedData);
        }
      } catch (error) {
        console.error('Failed to fetch listings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, []);

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice =
      priceFilter === 'all' ||
      (priceFilter === 'low' && listing.price < 10000) ||
      (priceFilter === 'medium' && listing.price >= 10000 && listing.price < 15000) ||
      (priceFilter === 'high' && listing.price >= 15000);
    const matchesRoomType = roomTypeFilter === 'all' || listing.roomType === roomTypeFilter;
    const matchesAvailability = availabilityFilter === 'all' || listing.availability === availabilityFilter;
    const matchesGender = genderFilter === 'all' || listing.gender === genderFilter;
    return matchesSearch && matchesPrice && matchesRoomType && matchesAvailability && matchesGender;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setPriceFilter('all');
    setRoomTypeFilter('all');
    setAvailabilityFilter('all');
    setGenderFilter('all');
  };

  const hasActiveFilters =
    searchTerm || priceFilter !== 'all' || roomTypeFilter !== 'all' ||
    availabilityFilter !== 'all' || genderFilter !== 'all';

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f7fafa' }}>

      {/* Page Header */}
      <div className="py-10" style={{ background: 'linear-gradient(135deg, #0d1f1d 0%, #1a7a6e 100%)' }}>
        <div className="container mx-auto px-4">
          <p className="text-sm font-medium tracking-widest uppercase mb-2" style={{ color: '#52b788' }}>Explore</p>
          <h1 className="text-4xl font-normal text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>
            Browse Boarding Places
          </h1>
          <p className="mt-2" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Find your perfect room near University of Peradeniya
          </p>
          <Link to="/landlord-dashboard">
            <Button variant="outline">Post a Boarding Place</Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">

        {/* Search Bar */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#5a7874' }} />
            <Input
              placeholder="Search by title or location…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-base rounded-xl"
              style={{ border: '1px solid rgba(26,122,110,0.2)', backgroundColor: 'white' }}
            />
          </div>
          <Button
            variant="outline"
            className="h-12 px-4 gap-2 rounded-xl"
            style={{ borderColor: 'rgba(26,122,110,0.2)', color: '#1a7a6e' }}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#e07b39' }} />
            )}
          </Button>
        </div>

        {/* Collapsible Filters */}
        {showFilters && (
          <Card className="mb-6 shadow-sm" style={{ border: '1px solid rgba(26,122,110,0.12)' }}>
            <CardContent className="pt-5 pb-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-semibold mb-2 block uppercase tracking-wider" style={{ color: '#5a7874' }}>Price Range</label>
                  <Select value={priceFilter} onValueChange={setPriceFilter}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="low">Under Rs. 10,000</SelectItem>
                      <SelectItem value="medium">Rs. 10,000 – 15,000</SelectItem>
                      <SelectItem value="high">Above Rs. 15,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-semibold mb-2 block uppercase tracking-wider" style={{ color: '#5a7874' }}>Room Type</label>
                  <Select value={roomTypeFilter} onValueChange={setRoomTypeFilter}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Double">Double</SelectItem>
                      <SelectItem value="Triple">Triple</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-semibold mb-2 block uppercase tracking-wider" style={{ color: '#5a7874' }}>Availability</label>
                  <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Not Available">Not Available</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-semibold mb-2 block uppercase tracking-wider" style={{ color: '#5a7874' }}>Gender</label>
                  <Select value={genderFilter} onValueChange={setGenderFilter}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Any">Any</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="mt-4 text-sm flex items-center gap-1 hover:underline" style={{ color: '#e07b39' }}>
                  <X className="w-3.5 h-3.5" /> Clear all filters
                </button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Results count */}
        <div className="mb-5 text-sm font-medium" style={{ color: '#5a7874' }}>
          Showing <span style={{ color: '#1a7a6e', fontWeight: 600 }}>{filteredListings.length}</span> {filteredListings.length === 1 ? 'result' : 'results'}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <p className="text-sm font-medium" style={{ color: '#5a7874' }}>Loading listings...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <Link key={listing.id} to={`/listing/${listing.id}`}>
              <Card className="h-full cursor-pointer overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 group border-0 flex flex-col" style={{ border: '1px solid rgba(26,122,110,0.1)' }}>
                <div className="h-48 flex w-full relative">
                  <div className="w-1/2 h-full overflow-hidden">
                    <img
                      src={listing.image_url || 'https://via.placeholder.com/600x400?text=No+Image'}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="w-1/2 h-full overflow-hidden border-l">
                    {(listing.latitude && listing.longitude) ? (
                      <MapContainer center={[listing.latitude, listing.longitude]} zoom={13} style={{ height: '100%', width: '100%', zIndex: 0 }} zoomControl={false} dragging={false} scrollWheelZoom={false}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={[listing.latitude, listing.longitude]} />
                      </MapContainer>
                    ) : listing.map_url ? (
                      <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: listing.map_url.replace(/width="\d+"/, 'width="100%"').replace(/height="\d+"/, 'height="100%"') }} />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-500">No Location</div>
                    )}
                  </div>
                  {/* Availability badge */}
                  <div className="absolute top-3 right-3">
                    {listing.availability === 'Available' ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: '#52b788' }}>
                        Available
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: '#5a7874' }}>
                        Occupied
                      </span>
                    )}
                  </div>
                </div>
                <CardContent className="pt-4 pb-4">
                  <h3 className="font-semibold text-base mb-3 line-clamp-1" style={{ color: '#0d1f1d' }}>
                    {listing.title}
                  </h3>

                  <div className="space-y-1.5 text-sm mb-4">
                    <div className="flex items-center gap-2" style={{ color: '#5a7874' }}>
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{listing.location} · {listing.distance}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#1a7a6e' }} />
                      <span className="font-semibold" style={{ color: '#1a7a6e' }}>
                        Rs. {listing.price.toLocaleString()}<span className="font-normal text-xs" style={{ color: '#5a7874' }}>/month</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2" style={{ color: '#5a7874' }}>
                      <Users className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{listing.roomType} · {listing.gender}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-xs" style={{ color: '#0d1f1d' }}>{listing.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {listing.facilities.slice(0, 3).map((f: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#e8f5f3', color: '#1a7a6e' }}>
                        {f}
                      </span>
                    ))}
                    {listing.facilities.length > 3 && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#f7fafa', color: '#5a7874', border: '1px solid rgba(26,122,110,0.15)' }}>
                        +{listing.facilities.length - 3}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filteredListings.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#e8f5f3' }}>
              <Search className="w-8 h-8" style={{ color: '#1a7a6e' }} />
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: '#0d1f1d' }}>No listings found</h3>
            <p className="mb-6" style={{ color: '#5a7874' }}>No listings match your current filters.</p>
            <Button onClick={clearFilters} variant="outline" style={{ borderColor: '#1a7a6e', color: '#1a7a6e' }}>
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
