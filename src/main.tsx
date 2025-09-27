import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import { createBrowserRouter, RouterProvider } from 'react-router';
import Home from './pages/Home.tsx';
import ConnectWallet from './pages/ConnectWallet.tsx';
import DashboardLayout from './components/DashboardLayout.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Habits from './pages/Habits.tsx';
import NFTGallery from './pages/NFTGallery.tsx';
import Leaderboard from './pages/Leaderboard.tsx';
import Settings from './pages/Settings.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    Component: Home,
  },
  {
    path: '/connect',
    Component: ConnectWallet,
  },
  {
    path: '/dashboard',
    Component: DashboardLayout,
    children: [
      {
        // path: '/dashboard',
        index: true,
        Component: Dashboard,
      },
      {
        path: '/dashboard/habits',
        Component: Habits,
      },
      {
        path: '/dashboard/gallery',
        Component: NFTGallery,
      },
      {
        path: '/dashboard/leaderboard',
        Component: Leaderboard,
      },
      {
        path: '/dashboard/settings',
        Component: Settings,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
