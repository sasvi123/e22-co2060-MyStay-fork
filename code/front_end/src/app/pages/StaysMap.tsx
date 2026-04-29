import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router'; // Changed from 'react-router-dom' to match your project
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Card } from '../components/ui/card';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons not showing in React
const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [38, 38],
    iconAnchor: [19, 38], // Anchors the tip of the icon to the coordinate
});

interface Stay {
    stay_id: number;
    title: string;
    price: number;
    latitude: number;
    longitude: number;
    address?: string;
}

export function StaysMap() {
    const navigate = useNavigate();
    const [stays, setStays] = useState<Stay[]>([]);
    const [loading, setLoading] = useState(true);
    const center: [number, number] = [6.9271, 79.8612]; // Colombo coordinates

    useEffect(() => {
        const fetchStays = async () => {
            try {
                const token = localStorage.getItem('token');

                // If no token, redirect to login immediately
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await fetch('http://localhost:3000/api/stays', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                });

                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('token'); // Clear invalid token
                    navigate('/login');
                    return;
                }

                if (!response.ok) throw new Error('Failed to fetch stays');

                const data = await response.json();
                setStays(data);
            } catch (error) {
                console.error("Map Fetch Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStays();
    }, [navigate]);

    if (loading) {
        return (
            <Card className="w-full h-[500px] flex items-center justify-center bg-gray-50">
                <p className="text-gray-500 animate-pulse">Loading boarding places...</p>
            </Card>
        );
    }

    return (
        <Card className="w-full h-[500px] overflow-hidden rounded-xl shadow-lg border-none">
            <MapContainer
                center={center}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {stays.map((stay) => (
                    <Marker
                        key={stay.stay_id}
                        position={[Number(stay.latitude), Number(stay.longitude)]}
                        icon={customIcon}
                    >
                        <Popup>
                            <div className="p-2 min-w-[150px]">
                                <h3 className="font-bold text-blue-600 text-base">{stay.title}</h3>
                                <p className="text-sm font-semibold text-gray-900 mt-1">
                                    Rs. {Number(stay.price).toLocaleString()}
                                </p>
                                {stay.address && (
                                    <p className="text-xs text-gray-500 mt-1">{stay.address}</p>
                                )}
                                <button
                                    onClick={() => navigate(`/listing/${stay.stay_id}`)}
                                    className="mt-3 w-full text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 rounded transition-colors"
                                >
                                    View Details
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </Card>
    );
}