import { createBrowserRouter } from 'react-router';
import { Root } from './pages/Root';
import { Home } from './pages/Home';
import { Browse } from './pages/Browse';
import { ListingDetail } from './pages/ListingDetail';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { LandlordDashboard } from './pages/LandlordDashboard';
import { NotFound } from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'browse', Component: Browse },
      { path: 'listing/:id', Component: ListingDetail },
      { path: 'landlord-dashboard', Component: LandlordDashboard },
      { path: '*', Component: NotFound },
    ],
  },
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/signup',
    Component: Signup,
  },
]);
