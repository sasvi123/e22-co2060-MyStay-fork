import { useState } from 'react';
import { PlusCircle, Edit, Trash2, Home } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { mockListings, BoardingListing } from '../data/mockListings';
import { imageMapping } from '../data/imageMapping';

export function LandlordDashboard() {
  const [listings, setListings] = useState(mockListings.slice(0, 3)); // Show first 3 as user's listings
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newListing, setNewListing] = useState({
    title: '',
    location: '',
    price: '',
    roomType: 'Single',
    gender: 'Any',
    facilities: '',
    description: '',
  });

  const handleAddListing = () => {
    // Mock add listing
    console.log('New listing:', newListing);
    setIsAddDialogOpen(false);
    // Reset form
    setNewListing({
      title: '',
      location: '',
      price: '',
      roomType: 'Single',
      gender: 'Any',
      facilities: '',
      description: '',
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      setListings(listings.filter((l) => l.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Landlord Dashboard</h1>
            <p className="text-gray-600">Manage your boarding place listings</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <PlusCircle className="w-5 h-5 mr-2" />
                Add New Listing
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Boarding Place</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Comfortable Single Room Near Campus"
                    value={newListing.title}
                    onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Peradeniya"
                      value={newListing.location}
                      onChange={(e) => setNewListing({ ...newListing, location: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Monthly Price (Rs.)</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="e.g., 12000"
                      value={newListing.price}
                      onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="roomType">Room Type</Label>
                    <Select value={newListing.roomType} onValueChange={(value) => setNewListing({ ...newListing, roomType: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Double">Double</SelectItem>
                        <SelectItem value="Triple">Triple</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender Preference</Label>
                    <Select value={newListing.gender} onValueChange={(value) => setNewListing({ ...newListing, gender: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
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
                  <Input
                    id="facilities"
                    placeholder="e.g., WiFi, Kitchen, Parking, Study Table"
                    value={newListing.facilities}
                    onChange={(e) => setNewListing({ ...newListing, facilities: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your boarding place..."
                    rows={4}
                    value={newListing.description}
                    onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                  />
                </div>

                <Button onClick={handleAddListing} className="w-full">
                  Add Listing
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Listings</p>
                  <p className="text-3xl font-bold">{listings.length}</p>
                </div>
                <Home className="w-12 h-12 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Available</p>
                  <p className="text-3xl font-bold text-green-600">
                    {listings.filter((l) => l.availability === 'Available').length}
                  </p>
                </div>
                <Home className="w-12 h-12 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Occupied</p>
                  <p className="text-3xl font-bold text-gray-600">
                    {listings.filter((l) => l.availability === 'Not Available').length}
                  </p>
                </div>
                <Home className="w-12 h-12 text-gray-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Listings */}
        <Card>
          <CardHeader>
            <CardTitle>Your Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {listings.map((listing) => (
                <div
                  key={listing.id}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={imageMapping[listing.images[0]]}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{listing.title}</h3>
                        <p className="text-gray-600">{listing.location}</p>
                      </div>
                      {listing.availability === 'Available' ? (
                        <Badge className="bg-green-500">Available</Badge>
                      ) : (
                        <Badge variant="secondary">Not Available</Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-gray-600">Price</p>
                        <p className="font-semibold">Rs. {listing.price.toLocaleString()}/mo</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Room Type</p>
                        <p className="font-semibold">{listing.roomType}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Gender</p>
                        <p className="font-semibold">{listing.gender}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Rating</p>
                        <p className="font-semibold">⭐ {listing.rating}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(listing.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {listings.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Home className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p className="text-lg">No listings yet</p>
                  <p className="text-sm">Click "Add New Listing" to create your first listing</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
