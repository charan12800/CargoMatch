import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardLayout } from './layouts/DashboardLayout';

// Customer Pages
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { SendCargoPage } from './pages/customer/SendCargoPage';
import { MyBookingsPage } from './pages/customer/MyBookingsPage';
import { TrackingPage } from './pages/customer/TrackingPage';

// Driver Pages
import { DriverDashboard } from './pages/driver/DriverDashboard';
import { PostTripPage } from './pages/driver/PostTripPage';
import { DriverRequestsPage } from './pages/driver/DriverRequestsPage';
import { DriverTripsPage } from './pages/driver/DriverTripsPage';
import { DriverEarningsPage } from './pages/driver/DriverEarningsPage';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Auth Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* Customer Portal Routes wrapped in DashboardLayout */}
          <Route
            path="/customer"
            element={
              <DashboardLayout>
                <CustomerDashboard />
              </DashboardLayout>
            }
          />
          <Route
            path="/customer/send-cargo"
            element={
              <DashboardLayout>
                <SendCargoPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/customer/bookings"
            element={
              <DashboardLayout>
                <MyBookingsPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/customer/track"
            element={
              <DashboardLayout>
                <TrackingPage />
              </DashboardLayout>
            }
          />

          {/* Driver Portal Routes wrapped in DashboardLayout */}
          <Route
            path="/driver"
            element={
              <DashboardLayout>
                <DriverDashboard />
              </DashboardLayout>
            }
          />
          <Route
            path="/driver/post-trip"
            element={
              <DashboardLayout>
                <PostTripPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/driver/requests"
            element={
              <DashboardLayout>
                <DriverRequestsPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/driver/trips"
            element={
              <DashboardLayout>
                <DriverTripsPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/driver/earnings"
            element={
              <DashboardLayout>
                <DriverEarningsPage />
              </DashboardLayout>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
