import { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, Home, TrendingUp, Users, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
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

function LocationPicker({ position, setPosition }: { position: { lat: number, lng: number } | undefined, setPosition: (pos: { lat: number, lng: number }) => void }) {
  useMapEvents({
    click(e) {
      setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return position ? <Marker position={[position.lat, position.lng]} /> : null;
}

export function LandlordDashboard() {
  const [listings, setListings] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchListings = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/stays', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        // Map backend fields to what the frontend expects (id vs stay_id, address vs location, and add dummy images)
        const formattedData = data.map((stay: any) => ({
          ...stay,
          id: stay.stay_id.toString(),
          location: stay.address,
          facilities: stay.facilities ? stay.facilities.split(',').map((f: string) => f.trim()) : [],
          rating: 4.5, // Dummy rating
          distance: 'Unknown distance', // Dummy distance
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

  const fetchBookings = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) return;
      
      const response = await fetch(`http://localhost:3000/api/bookings/landlord/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    }
  };

  useEffect(() => {
    fetchListings();
    fetchBookings();
  }, []);

  const defaultListing = {
    title: '',
    location: '',
    price: '',
    roomType: 'Single',
    gender: 'Any',
    facilities: '',
    description: '',
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
    map_url: '',
    availability: 'Available'
  };

  const [newListing, setNewListing] = useState(defaultListing);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleOpenAdd = () => {
    setIsEditMode(false);
    setEditingId(null);
    setNewListing(defaultListing);
    setImageFile(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (listing: any) => {
    setIsEditMode(true);
    setEditingId(listing.id);
    setNewListing({
      title: listing.title,
      location: listing.location,
      price: listing.price.toString(),
      roomType: listing.roomType,
      gender: listing.gender,
      facilities: Array.isArray(listing.facilities) ? listing.facilities.join(', ') : listing.facilities,
      description: listing.description,
      latitude: listing.latitude,
      longitude: listing.longitude,
      map_url: listing.map_url || '',
      availability: listing.availability || 'Available'
    });
    setImageFile(null);
    setIsDialogOpen(true);
  };

  const handleSaveListing = async () => {
    if (isEditMode && editingId) {
      try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('title', newListing.title);
        formData.append('description', newListing.description);
        formData.append('price', newListing.price.toString());
        formData.append('address', newListing.location);
        formData.append('latitude', (newListing.latitude || 6.9271).toString());
        formData.append('longitude', (newListing.longitude || 79.8612).toString());
        formData.append('roomType', newListing.roomType);
        formData.append('gender', newListing.gender);
        formData.append('facilities', newListing.facilities);
        formData.append('availability', (newListing as any).availability || 'Available');
        if (newListing.map_url) {
            formData.append('map_url', newListing.map_url);
        }
        if (imageFile) {
            formData.append('image', imageFile);
        }

        const response = await fetch(`http://localhost:3000/api/stays/${editingId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (response.ok) {
          alert('Listing updated successfully!');
          fetchListings(); // Refresh the list
          setIsDialogOpen(false);
        } else {
          const data = await response.json();
          alert(`Error: ${data.error}`);
        }
      } catch (error) {
        console.error('Failed to update listing:', error);
        alert('Failed to update listing. Please try again.');
      }
    } else {
      try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('title', newListing.title);
        formData.append('description', newListing.description);
        formData.append('price', newListing.price.toString());
        formData.append('address', newListing.location);
        formData.append('latitude', (newListing.latitude || 6.9271).toString());
        formData.append('longitude', (newListing.longitude || 79.8612).toString());
        formData.append('roomType', newListing.roomType);
        formData.append('gender', newListing.gender);
        formData.append('facilities', newListing.facilities);
        formData.append('availability', 'Available');
        if (newListing.map_url) {
            formData.append('map_url', newListing.map_url);
        }
        if (imageFile) {
            formData.append('image', imageFile);
        }

        const response = await fetch('http://localhost:3000/api/stays', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (response.ok) {
          alert('Listing added successfully!');
          fetchListings(); // Refresh the list
          setIsDialogOpen(false);
        } else {
          const data = await response.json();
          alert(`Error: ${data.error}`);
        }
      } catch (error) {
        console.error('Failed to save listing:', error);
        alert('Failed to save listing. Please try again.');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/stays/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          setListings(listings.filter((l) => l.id !== id));
        } else {
          const data = await response.json();
          alert(`Error: ${data.error}`);
        }
      } catch (error) {
        console.error('Failed to delete listing:', error);
        alert('Failed to delete listing. Please try again.');
      }
    }
  };

  const handleUpdateBookingStatus = async (requestId: number, status: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/bookings/${requestId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        alert(`Booking ${status} successfully!`);
        fetchBookings(); // Refresh the bookings list
      } else {
        const data = await response.json();
        alert(data.error || "Failed to update booking status.");
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("An error occurred.");
    }
  };

  const stats = [
    { label: 'Total Listings', value: listings.length, icon: Home, color: '#1a7a6e', bg: '#e8f5f3' },
    { label: 'Available', value: listings.filter((l) => l.availability === 'Available').length, icon: TrendingUp, color: '#52b788', bg: '#d8f3dc' },
    { label: 'Pending Bookings', value: bookings.filter((b) => b.status === 'pending').length, icon: Calendar, color: '#e07b39', bg: '#fdf0e8' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f7fafa' }}>

      {/* Page Header */}
      <div className="py-10" style={{ background: 'linear-gradient(135deg, #0d1f1d 0%, #1a7a6e 100%)' }}>
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium tracking-widest uppercase mb-2" style={{ color: '#52b788' }}>Dashboard</p>
              <h1 className="text-4xl font-normal text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Landlord Dashboard
              </h1>
              <p className="mt-2" style={{ color: 'rgba(255,255,255,0.65)' }}>Manage your boarding place listings</p>
            </div>

            {localStorage.getItem('user') && JSON.parse(localStorage.getItem('user') as string).role === 'landlord' && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="gap-2 font-semibold flex-shrink-0" style={{ backgroundColor: '#e07b39', color: 'white', border: 'none' }} onClick={handleOpenAdd}>
                    <PlusCircle className="w-5 h-5" />
                    Add Listing
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle style={{ fontFamily: "'DM Serif Display', serif", fontSize: '22px', fontWeight: 400 }}>
                      {isEditMode ? 'Edit Boarding Place' : 'Add New Boarding Place'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" placeholder="e.g., Comfortable Single Room Near Campus"
                        value={newListing.title} onChange={(e) => setNewListing({ ...newListing, title: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" placeholder="e.g., Peradeniya"
                          value={newListing.location} onChange={(e) => setNewListing({ ...newListing, location: e.target.value })} />
                      </div>
                      <div>
                        <Label htmlFor="price">Monthly Price (Rs.)</Label>
                        <Input id="price" type="number" placeholder="e.g., 12000"
                          value={newListing.price} onChange={(e) => setNewListing({ ...newListing, price: e.target.value })} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Room Type</Label>
                        <Select value={newListing.roomType} onValueChange={(value) => setNewListing({ ...newListing, roomType: value })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Single">Single</SelectItem>
                            <SelectItem value="Double">Double</SelectItem>
                            <SelectItem value="Triple">Triple</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Gender Preference</Label>
                        <Select value={newListing.gender} onValueChange={(value) => setNewListing({ ...newListing, gender: value })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Any">Any</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="facilities">Facilities (comma-separated)</Label>
                      <Input id="facilities" placeholder="e.g., WiFi, Kitchen, Parking, Study Table"
                        value={newListing.facilities} onChange={(e) => setNewListing({ ...newListing, facilities: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Describe your boarding place…" rows={4}
                        value={newListing.description} onChange={(e) => setNewListing({ ...newListing, description: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="image">Upload Image</Label>
                      <Input id="image" type="file" accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setImageFile(e.target.files[0]);
                          }
                        }} />
                    </div>
                    <div>
                      <Label htmlFor="map_url">Google Maps URL (Optional)</Label>
                      <Input id="map_url" placeholder="Paste Google Maps URL here"
                        value={newListing.map_url}
                        onChange={(e) => setNewListing({ ...newListing, map_url: e.target.value })} />
                    </div>

                    <div className="space-y-2">
                      <Label>Location Map (Optional)</Label>
                      <div className="h-[250px] rounded-lg overflow-hidden border">
                        <MapContainer center={[newListing.latitude || 6.9271, newListing.longitude || 79.8612]} zoom={13} style={{ height: '100%', zIndex: 0 }}>
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <LocationPicker
                            position={newListing.latitude && newListing.longitude ? { lat: newListing.latitude, lng: newListing.longitude } : undefined}
                            setPosition={(pos) => setNewListing({ ...newListing, latitude: pos.lat, longitude: pos.lng })}
                          />
                        </MapContainer>
                      </div>
                      {newListing.latitude && newListing.longitude ? (
                        <p className="text-xs text-muted-foreground text-center">
                          Coords: {newListing.latitude.toFixed(4)}, {newListing.longitude.toFixed(4)}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground text-center">
                          Click on the map to set location coordinates.
                        </p>
                      )}
                    </div>

                    <Button onClick={handleSaveListing} className="w-full font-semibold" style={{ backgroundColor: '#1a7a6e', color: 'white', border: 'none' }}>
                      {isEditMode ? 'Save Changes' : 'Add Listing'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {stats.map(({ label, value, icon: Icon, color, bg }) => (
            <Card key={label} className="shadow-sm border-0" style={{ border: '1px solid rgba(26,122,110,0.1)' }}>
              <CardContent className="pt-5 pb-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm mb-1" style={{ color: '#5a7874' }}>{label}</p>
                    <p className="text-3xl font-bold" style={{ color, fontFamily: "'DM Serif Display', serif" }}>{value}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg }}>
                    <Icon className="w-6 h-6" style={{ color }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Booking Requests */}
        {bookings.length > 0 && (
          <Card className="shadow-sm border-0 mb-8" style={{ border: '1px solid rgba(26,122,110,0.1)' }}>
            <CardHeader className="pb-4 border-b" style={{ borderColor: 'rgba(26,122,110,0.1)' }}>
              <CardTitle style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: '22px', color: '#0d1f1d' }}>
                Recent Booking Requests
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 border-b" style={{ borderColor: 'rgba(26,122,110,0.1)' }}>
                    <tr>
                      <th className="px-6 py-4 font-medium text-gray-500">Student</th>
                      <th className="px-6 py-4 font-medium text-gray-500">Contact</th>
                      <th className="px-6 py-4 font-medium text-gray-500">Listing</th>
                      <th className="px-6 py-4 font-medium text-gray-500">Date</th>
                      <th className="px-6 py-4 font-medium text-gray-500">Status</th>
                      <th className="px-6 py-4 font-medium text-gray-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: 'rgba(26,122,110,0.1)' }}>
                    {bookings.map((booking) => (
                      <tr key={booking.request_id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium" style={{ color: '#0d1f1d' }}>{booking.student_name}</td>
                        <td className="px-6 py-4 text-gray-600">
                          <div>{booking.student_phone}</div>
                          <div className="text-xs text-gray-500">{booking.student_email}</div>
                        </td>
                        <td className="px-6 py-4" style={{ color: '#1a7a6e' }}>{booking.title}</td>
                        <td className="px-6 py-4 text-gray-600">
                          {new Date(booking.request_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0"
                            style={
                              booking.status === 'pending' ? { backgroundColor: '#fdf0e8', color: '#e07b39' } :
                              booking.status === 'approved' ? { backgroundColor: '#d8f3dc', color: '#1a5c30' } :
                              { backgroundColor: '#fee2e2', color: '#991b1b' }
                            }>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {booking.status === 'pending' ? (
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline" className="gap-1 h-8 text-xs bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200" onClick={() => handleUpdateBookingStatus(booking.request_id, 'approved')}>
                                <CheckCircle className="w-3.5 h-3.5" /> Approve
                              </Button>
                              <Button size="sm" variant="outline" className="gap-1 h-8 text-xs bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 border-red-200" onClick={() => handleUpdateBookingStatus(booking.request_id, 'rejected')}>
                                <XCircle className="w-3.5 h-3.5" /> Reject
                              </Button>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">Resolved</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Listings */}
        <Card className="shadow-sm border-0" style={{ border: '1px solid rgba(26,122,110,0.1)' }}>
          <CardHeader className="pb-4">
            <CardTitle style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: '22px', color: '#0d1f1d' }}>
              Your Listings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {listings.map((listing) => (
                <div key={listing.id} className="flex items-start gap-4 p-4 rounded-xl transition-shadow hover:shadow-md" style={{ border: '1px solid rgba(26,122,110,0.1)', backgroundColor: 'white' }}>
                  <div className="w-32 flex-shrink-0 flex flex-col gap-2">
                    <div className="w-full h-24 overflow-hidden rounded-xl">
                      <img src={listing.image_url || 'https://via.placeholder.com/150'} alt={listing.title} className="w-full h-full object-cover" />
                    </div>
                    {(listing.latitude && listing.longitude) ? (
                      <div className="w-full h-24 overflow-hidden rounded-xl border">
                        <MapContainer center={[listing.latitude, listing.longitude]} zoom={13} style={{ height: '100%', width: '100%', zIndex: 0 }} zoomControl={false} dragging={false} scrollWheelZoom={false}>
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <Marker position={[listing.latitude, listing.longitude]} />
                        </MapContainer>
                      </div>
                    ) : listing.map_url ? (
                      <div className="w-full h-24 overflow-hidden rounded-xl border" dangerouslySetInnerHTML={{ __html: listing.map_url.replace(/width="\d+"/, 'width="100%"').replace(/height="\d+"/, 'height="100%"') }} />
                    ) : null}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <div>
                        <h3 className="font-semibold" style={{ color: '#0d1f1d' }}>{listing.title}</h3>
                        <p className="text-sm" style={{ color: '#5a7874' }}>{listing.location}</p>
                      </div>
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0"
                        style={
                          listing.availability === 'Available'
                            ? { backgroundColor: '#d8f3dc', color: '#1a5c30' }
                            : { backgroundColor: '#eff6f5', color: '#5a7874' }
                        }
                      >
                        {listing.availability}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
                      {[
                        { label: 'Price', value: `Rs. ${listing.price.toLocaleString()}/mo` },
                        { label: 'Room Type', value: listing.roomType },
                        { label: 'Gender', value: listing.gender },
                        { label: 'Rating', value: `⭐ ${listing.rating}` },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <p className="text-xs mb-0.5" style={{ color: '#5a7874' }}>{label}</p>
                          <p className="font-semibold text-sm" style={{ color: '#0d1f1d' }}>{value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-1.5 text-xs" style={{ borderColor: 'rgba(26,122,110,0.25)', color: '#1a7a6e' }} onClick={() => handleEdit(listing)}>
                        <Edit className="w-3.5 h-3.5" /> Edit
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1.5 text-xs" style={{ borderColor: 'rgba(212,24,61,0.25)', color: '#d4183d' }}
                        onClick={() => handleDelete(listing.id)}>
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading ? (
                <div className="text-center py-16">
                  <p className="text-sm" style={{ color: '#5a7874' }}>Loading listings...</p>
                </div>
              ) : listings.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#e8f5f3' }}>
                    <Home className="w-8 h-8" style={{ color: '#1a7a6e' }} />
                  </div>
                  <h3 className="font-semibold mb-1" style={{ color: '#0d1f1d' }}>No listings yet</h3>
                  <p className="text-sm" style={{ color: '#5a7874' }}>Click "Add Listing" to create your first listing</p>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
