import { useParams, Link } from 'react-router';
import { MapPin, DollarSign, Users, Star, Phone, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { mockListings } from '../data/mockListings';
import { imageMapping } from '../data/imageMapping';
import { ReviewSection } from '../components/ReviewSection';
export function ListingDetail() {
  const { id } = useParams();
  const listing = mockListings.find((l) => l.id === id);

  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Listing Not Found</h2>
          <Link to="/browse">
            <Button>Back to Browse</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link to="/browse">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Browse
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <div className="aspect-video overflow-hidden rounded-t-lg">
                <img
                  src={imageMapping[listing.images[0]]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-2 p-4">
                {listing.images.slice(1).map((image, index) => (
                  <div key={index} className="aspect-video overflow-hidden rounded-lg">
                    <img
                      src={imageMapping[image]}
                      alt={`${listing.title} ${index + 2}`}
                      className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  </div>
                ))}
              </div>
            </Card>

            {/* Title and Basic Info */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-3xl font-bold">{listing.title}</h1>
                  {listing.availability === 'Available' ? (
                    <Badge className="bg-green-500 text-lg px-4 py-1">Available</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-lg px-4 py-1">Not Available</Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    <div>
                      <p className="font-semibold">{listing.location}</p>
                      <p className="text-sm">{listing.distance}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold text-blue-600">Rs. {listing.price.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">per month</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-5 h-5" />
                    <div>
                      <p className="font-semibold">{listing.roomType} Room</p>
                      <p className="text-sm">{listing.gender} only</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <div>
                      <p className="font-semibold">{listing.rating.toFixed(1)} Rating</p>
                      <p className="text-sm">Based on reviews</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed">{listing.description}</p>
              </CardContent>
            </Card>

            {/* Facilities */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4">Facilities & Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {listing.facilities.map((facility, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>{facility}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* --- 3. Add the ReviewSection component here --- */}
            <ReviewSection listingId={id} currentUser={currentUser} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4">Contact Landlord</h2>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Landlord Name</p>
                    <p className="font-semibold">{listing.landlordName}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Contact Number</p>
                    <p className="font-semibold">{listing.landlordContact}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full" size="lg">
                    <Phone className="w-5 h-5 mr-2" />
                    Call Now
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    Send Message
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700">
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
