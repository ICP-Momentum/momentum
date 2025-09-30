import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SidebarProvider } from './components/ui/sidebar';
import { MobileHeader } from './components/dashboard/mobile-header';
import { DashboardSidebar } from './components/dashboard/sidebar';
import Widget from './components/dashboard/widget';
import Notifications from './components/dashboard/notifications';
import { MobileChat } from './components/chat/mobile-chat';
import Chat from './components/chat';
import DashboardOverview from './pages/DashboardOverview';
import Landing from './pages/Landing';
import Connect from './pages/Connect';
import Register from './pages/Register';
import mockDataJson from './mock.json';
import type { MockData } from './types/dashboard';
import { V0Provider } from './lib/ui-context';
import { AuthProvider, useAuth } from './contexts/auth-context';

const mockData = mockDataJson as unknown as MockData;

// Font setup (replaces Next.js font loading)
const fontStyle = {
  fontFamily: 'var(--font-rebels), system-ui, sans-serif',
};

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isConnected, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return <Navigate to="/connect" replace />;
  }

  return <>{children}</>;
}

// Public Route Component (redirects to dashboard if authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isConnected, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isConnected) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

// Dashboard Layout
function DashboardLayout() {
  return (
    <SidebarProvider>
      {/* Mobile Header - only visible on mobile */}
      <MobileHeader mockData={mockData} />

      {/* Desktop Layout */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-gap lg:px-sides">
        <div className="hidden lg:block col-span-2 top-0 relative">
          <DashboardSidebar />
        </div>
        <div className="col-span-1 lg:col-span-7">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            {/* Add more dashboard routes here as needed */}
          </Routes>
        </div>
        <div className="col-span-3 hidden lg:block">
          <div className="space-y-gap py-sides min-h-screen max-h-screen sticky top-0 overflow-clip">
            <Widget widgetData={mockData.widgetData} />
            <Notifications initialNotifications={mockData.notifications} />
            <Chat />
          </div>
        </div>
      </div>

      {/* Mobile Chat - floating CTA with drawer */}
      <MobileChat />
    </SidebarProvider>
  );
}

function App() {
  const isV0 = false; // Set to false for React app (not v0.dev)

  return (
    <V0Provider isV0={isV0}>
      <div style={fontStyle} className="antialiased">
        <Router>
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route
                path="/"
                element={
                  <PublicRoute>
                    <Landing />
                  </PublicRoute>
                }
              />
              <Route path="/connect" element={<Connect />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Dashboard Routes */}
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              />

              {/* Catch all - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </Router>
      </div>
    </V0Provider>
  );
}

export default App;
