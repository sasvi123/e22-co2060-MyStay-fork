import { useParams, Link } from 'react-router';
import { MapPin, DollarSign, Users, Star, Phone, ArrowLeft, CheckCircle, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { mockListings } from '../data/mockListings';
import { imageMapping } from '../data/imageMapping';
import { ReviewSection } from '../components/ReviewSection';
export function ListingDetail() {
  const { id } = useParams();
  const listing = mockListings.find((l) => l.id === id);

  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');

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
                <img src={imageMapping[listing.images[0]]} alt={listing.title} className="w-full h-full object-cover" />
              </div>
              {listing.images.length > 1 && (
                <div className="grid grid-cols-3 gap-2 p-3 bg-white">
                  {listing.images.slice(1).map((image, index) => (
                    <div key={index} className="aspect-video overflow-hidden rounded-xl">
                      <img
                        src={imageMapping[image]}
                        alt={`${listing.title} ${index + 2}`}
                        className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    </div>
                  ))}
                </div>
              )}
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
                  {listing.facilities.map((facility, index) => (
                    <div key={index} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl" style={{ backgroundColor: '#f7fafa', border: '1px solid rgba(26,122,110,0.1)' }}>
                      <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#52b788' }} />
                      <span className="text-sm font-medium" style={{ color: '#0d1f1d' }}>{facility}</span>
                    </div>
                  ))}
                </div>
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
                    {listing.landlordName.charAt(listing.landlordName.indexOf(' ') + 1)}
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: '#0d1f1d' }}>{listing.landlordName}</p>
                    <p className="text-sm" style={{ color: '#5a7874' }}>{listing.landlordContact}</p>
                  </div>
                </div>

                <div className="space-y-3">
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
