import { RouterProvider } from 'react-router';
import { router } from './routes';
import 'leaflet/dist/leaflet.css';

export default function App() {
  return <RouterProvider router={router} />;
}
