import { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, Home, TrendingUp, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { mockListings, BoardingListing } from '../data/mockListings';
import { imageMapping } from '../data/imageMapping';
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
          images: ['bedroom-study-desk', 'modern-bathroom'], // Dummy images since they aren't in DB yet
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

  useEffect(() => {
    fetchListings();
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
  };

  const [newListing, setNewListing] = useState(defaultListing);

  const handleOpenAdd = () => {
    setIsEditMode(false);
    setEditingId(null);
    setNewListing(defaultListing);
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
    });
    setIsDialogOpen(true);
  };

  const handleSaveListing = async () => {
    if (isEditMode && editingId) {
      // In a real app, update the backend here with a PUT request
      setListings(listings.map(l => l.id === editingId ? {
        ...l,
        ...newListing,
        price: Number(newListing.price),
        facilities: newListing.facilities.split(',').map(s => s.trim())
      } : l));
      setIsDialogOpen(false);
    } else {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/stays', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: newListing.title,
            description: newListing.description,
            price: Number(newListing.price),
            address: newListing.location,
            latitude: newListing.latitude || 6.9271, // fallback to Colombo 
            longitude: newListing.longitude || 79.8612,
            roomType: newListing.roomType,
            gender: newListing.gender,
            facilities: newListing.facilities,
            availability: 'Available' // Default for new listings
          })
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

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      setListings(listings.filter((l) => l.id !== id));
    }
  };

  const stats = [
    { label: 'Total Listings', value: listings.length, icon: Home, color: '#1a7a6e', bg: '#e8f5f3' },
    { label: 'Available', value: listings.filter((l) => l.availability === 'Available').length, icon: TrendingUp, color: '#52b788', bg: '#d8f3dc' },
    { label: 'Occupied', value: listings.filter((l) => l.availability === 'Not Available').length, icon: Users, color: '#e07b39', bg: '#fdf0e8' },
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
                  <div className="w-28 h-28 flex-shrink-0 overflow-hidden rounded-xl">
                    <img src={imageMapping[listing.images[0]]} alt={listing.title} className="w-full h-full object-cover" />
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
