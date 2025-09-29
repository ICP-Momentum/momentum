import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SidebarProvider } from './components/ui/sidebar';
import { MobileHeader } from './components/dashboard/mobile-header';
import { DashboardSidebar } from './components/dashboard/sidebar';
import Widget from './components/dashboard/widget';
import Notifications from './components/dashboard/notifications';
import { MobileChat } from './components/chat/mobile-chat';
import Chat from './components/chat';
import DashboardOverview from './pages/DashboardOverview';
import mockDataJson from './mock.json';
import type { MockData } from './types/dashboard';
import { V0Provider } from './lib/v0-context';

const mockData = mockDataJson as MockData;

// Font setup (replaces Next.js font loading)
const fontStyle = {
  fontFamily: 'var(--font-rebels), system-ui, sans-serif',
};

function App() {
  const isV0 = false; // Set to false for React app (not v0.dev)

  return (
    <V0Provider isV0={isV0}>
      <div style={fontStyle} className="antialiased">
        <Router>
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
                  {/* Add more routes here as needed */}
                </Routes>
              </div>
              <div className="col-span-3 hidden lg:block">
                <div className="space-y-gap py-sides min-h-screen max-h-screen sticky top-0 overflow-clip">
                  <Widget widgetData={mockData.widgetData} />
                  <Notifications
                    initialNotifications={mockData.notifications}
                  />
                  <Chat />
                </div>
              </div>
            </div>

            {/* Mobile Chat - floating CTA with drawer */}
            <MobileChat />
          </SidebarProvider>
        </Router>
      </div>
    </V0Provider>
  );
}

export default App;