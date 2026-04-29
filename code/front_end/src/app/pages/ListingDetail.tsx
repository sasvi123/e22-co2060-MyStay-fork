import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { MapPin, DollarSign, Users, Star, Phone, ArrowLeft, CheckCircle, MessageCircle, Calendar } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { ReviewSection } from '../components/ReviewSection';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

export function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');

  const handleBookNow = async () => {
    if (!currentUser) {
      alert("Please log in to book a listing.");
      return;
    }
    
    if (currentUser.role === 'landlord') {
      alert("Landlords cannot book listings.");
      return;
    }

    setIsBooking(true);
    try {
      const response = await fetch('http://localhost:3000/api/bookings/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: currentUser.id,
          listing_id: listing.stay_id || id
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        alert("Booking request submitted successfully! The landlord will review your request.");
      } else {
        alert(data.error || "Failed to submit booking request.");
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert("An error occurred while submitting your booking request.");
    } finally {
      setIsBooking(false);
    }
  };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/stays/${id}`);
        if (response.ok) {
          const data = await response.json();
          setListing({
            ...data,
            id: data.stay_id.toString(),
            location: data.address,
            facilities: data.facilities ? data.facilities.split(',').map((f: string) => f.trim()) : [],
            rating: 4.5, // Dummy rating
            distance: 'Unknown distance', // Dummy distance
            availability: data.availability || 'Available',
            price: Number(data.price),
            roomType: data.roomType || 'Single',
            gender: data.gender || 'Any',
            landlordName: data.landlordName || 'Unknown Landlord',
            landlordContact: data.landlordContact || 'No contact info'
          });
        }
      } catch (error) {
        console.error('Failed to fetch listing:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
        fetchListing();
    }
  }, [id]);



  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f7fafa' }}>
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f7fafa' }}>
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#e8f5f3' }}>
            <MapPin className="w-10 h-10" style={{ color: '#1a7a6e' }} />
          </div>
          <h2 className="text-2xl font-semibold mb-2" style={{ color: '#0d1f1d' }}>Listing Not Found</h2>
          <p className="mb-6" style={{ color: '#5a7874' }}>This listing may have been removed or doesn't exist.</p>
          <Link to="/browse">
            <Button style={{ backgroundColor: '#1a7a6e', color: 'white', border: 'none' }}>
              Back to Browse
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f7fafa' }}>
      <div className="container mx-auto px-4 py-8">

        {/* Back */}
        <Link to="/browse">
          <Button variant="ghost" className="mb-6 gap-2 text-sm" style={{ color: '#1a7a6e' }}>
            <ArrowLeft className="w-4 h-4" />
            Back to Browse
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── Main ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Images */}
            <div className="rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid rgba(26,122,110,0.1)' }}>
              <div className="aspect-video overflow-hidden">
                <img src={listing.image_url || 'https://via.placeholder.com/800x450?text=No+Image'} alt={listing.title} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Title + Info */}
            <Card className="shadow-sm border-0" style={{ border: '1px solid rgba(26,122,110,0.1)' }}>
              <CardContent className="pt-6 pb-6">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <h1 className="text-3xl font-normal leading-snug" style={{ fontFamily: "'DM Serif Display', serif", color: '#0d1f1d' }}>
                    {listing.title}
                  </h1>
                  <span
                    className="px-3 py-1.5 rounded-full text-sm font-semibold flex-shrink-0"
                    style={
                      listing.availability === 'Available'
                        ? { backgroundColor: '#d8f3dc', color: '#1a5c30' }
                        : { backgroundColor: '#eff6f5', color: '#5a7874' }
                    }
                  >
                    {listing.availability}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#e8f5f3' }}>
                      <MapPin className="w-5 h-5" style={{ color: '#1a7a6e' }} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: '#0d1f1d' }}>{listing.location}</p>
                      <p className="text-xs" style={{ color: '#5a7874' }}>{listing.distance}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#e8f5f3' }}>
                      <DollarSign className="w-5 h-5" style={{ color: '#1a7a6e' }} />
                    </div>
                    <div>
                      <p className="font-bold text-xl" style={{ color: '#1a7a6e' }}>Rs. {listing.price.toLocaleString()}</p>
                      <p className="text-xs" style={{ color: '#5a7874' }}>per month</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#e8f5f3' }}>
                      <Users className="w-5 h-5" style={{ color: '#1a7a6e' }} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: '#0d1f1d' }}>{listing.roomType} Room</p>
                      <p className="text-xs" style={{ color: '#5a7874' }}>{listing.gender} only</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#fdf0e8' }}>
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: '#0d1f1d' }}>{listing.rating.toFixed(1)} Rating</p>
                      <p className="text-xs" style={{ color: '#5a7874' }}>Based on reviews</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="shadow-sm border-0" style={{ border: '1px solid rgba(26,122,110,0.1)' }}>
              <CardContent className="pt-6 pb-6">
                <h2 className="text-xl font-normal mb-4" style={{ fontFamily: "'DM Serif Display', serif", color: '#0d1f1d' }}>
                  About This Place
                </h2>
                <p className="leading-relaxed" style={{ color: '#3d5a57' }}>{listing.description}</p>
              </CardContent>
            </Card>

            {/* Facilities */}
            <Card className="shadow-sm border-0" style={{ border: '1px solid rgba(26,122,110,0.1)' }}>
              <CardContent className="pt-6 pb-6">
                <h2 className="text-xl font-normal mb-5" style={{ fontFamily: "'DM Serif Display', serif", color: '#0d1f1d' }}>
                  Facilities & Amenities
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {listing.facilities.map((facility: string, index: number) => (
                    <div key={index} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl" style={{ backgroundColor: '#f7fafa', border: '1px solid rgba(26,122,110,0.1)' }}>
                      <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#52b788' }} />
                      <span className="text-sm font-medium" style={{ color: '#0d1f1d' }}>{facility}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* map url or coordinates */}
            <Card className="shadow-sm border-0 mt-6" style={{ border: '1px solid rgba(26,122,110,0.1)' }}>
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-normal" style={{ fontFamily: "'DM Serif Display', serif", color: '#0d1f1d' }}>
                    Location
                  </h2>
                  {listing.map_url && !listing.map_url.includes('<iframe') && (
                    <a href={listing.map_url.startsWith('http') ? listing.map_url : `https://${listing.map_url}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-2" style={{ color: '#1a7a6e', borderColor: 'rgba(26,122,110,0.2)' }}>
                        <MapPin className="w-4 h-4" /> Open in Google Maps
                      </Button>
                    </a>
                  )}
                </div>
                
                {listing.map_url && listing.map_url.includes('<iframe') ? (
                  <div className="w-full h-[300px] rounded-lg overflow-hidden border" 
                       dangerouslySetInnerHTML={{ __html: listing.map_url.replace(/width="[^"]+"/, 'width="100%"').replace(/height="[^"]+"/, 'height="100%"') }} />
                ) : (listing.latitude && listing.longitude) ? (
                  <div className="w-full h-[300px] rounded-lg overflow-hidden border relative z-0">
                    <MapContainer center={[listing.latitude, listing.longitude]} zoom={15} style={{ height: '100%', width: '100%' }}>
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker position={[listing.latitude, listing.longitude]} />
                    </MapContainer>
                  </div>
                ) : (
                  <div className="w-full h-[300px] bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                    Location not available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* --- 3. Add the ReviewSection component here --- */}
            <ReviewSection listingId={id} currentUser={currentUser} />
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-sm border-0" style={{ border: '1px solid rgba(26,122,110,0.1)' }}>
              <CardContent className="pt-6 pb-6">
                <h2 className="text-xl font-normal mb-5" style={{ fontFamily: "'DM Serif Display', serif", color: '#0d1f1d' }}>
                  Contact Landlord
                </h2>

                {/* Landlord info */}
                <div className="flex items-center gap-3 p-4 rounded-xl mb-5" style={{ backgroundColor: '#f7fafa', border: '1px solid rgba(26,122,110,0.1)' }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg text-white flex-shrink-0" style={{ backgroundColor: '#1a7a6e' }}>
                    {listing.landlordName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: '#0d1f1d' }}>{listing.landlordName}</p>
                    <p className="text-sm" style={{ color: '#5a7874' }}>{listing.landlordContact}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    className="w-full gap-2 font-semibold" 
                    size="lg" 
                    style={{ 
                      backgroundColor: listing.availability === 'Booked' || listing.availability === 'Not Available' ? '#ccc' : '#e07b39', 
                      color: 'white', 
                      border: 'none',
                      cursor: listing.availability === 'Booked' || listing.availability === 'Not Available' ? 'not-allowed' : 'pointer'
                    }}
                    onClick={handleBookNow}
                    disabled={isBooking || listing.availability !== 'Available'}
                  >
                    <Calendar className="w-4 h-4" />
                    {isBooking ? 'Submitting...' : (listing.availability === 'Booked' || listing.availability === 'Not Available') ? 'Not Available' : 'Book Now'}
                  </Button>
                  <Button className="w-full gap-2 font-semibold" size="lg" style={{ backgroundColor: '#1a7a6e', color: 'white', border: 'none' }}>
                    <Phone className="w-4 h-4" />
                    Call Now
                  </Button>
                  <Button variant="outline" className="w-full gap-2 font-medium" size="lg" style={{ borderColor: '#1a7a6e', color: '#1a7a6e' }}>
                    <MessageCircle className="w-4 h-4" />
                    Send Message
                  </Button>
                </div>

                <div className="mt-5 p-4 rounded-xl" style={{ backgroundColor: '#fdf0e8', border: '1px solid rgba(224,123,57,0.2)' }}>
                  <p className="text-sm leading-relaxed" style={{ color: '#7a4020' }}>
                    <strong>Note:</strong> Please verify all details with the landlord before making any commitments.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
