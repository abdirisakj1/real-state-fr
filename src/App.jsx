import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Properties from './pages/Properties/Properties';
import Clients from './pages/Clients/Clients';
import AddProperty from './pages/Properties/AddProperty';
import Tenants from './pages/Tenants/Tenants';
import Leases from './pages/Leases/Leases';
import Payments from './pages/Payments/Payments';
import Maintenance from './pages/Maintenance/Maintenance';
import Reports from './pages/Reports/Reports';
import Settings from './pages/Settings/Settings';
import Profile from './pages/Profile/Profile';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                
                {/* Admin and Property Manager Routes */}
                <Route
                  path="properties"
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'property_manager']}>
                      <Properties />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="clients"
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'property_manager']}>
                      <Clients />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="tenants"
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'property_manager']}>
                      <Tenants />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="leases"
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'property_manager']}>
                      <Leases />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="payments"
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'property_manager']}>
                      <Payments />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="reports"
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'property_manager']}>
                      <Reports />
                    </ProtectedRoute>
                  }
                />

                {/* All authenticated users */}
                <Route path="maintenance" element={<Maintenance />} />
                <Route path="properties" element={<Properties />} />
                <Route path="add-property" element={<AddProperty />} />
                <Route path="properties/edit/:id" element={<AddProperty />} />
                
                {/* Admin only */}
                <Route
                  path="settings"
                  element={
                    <ProtectedRoute requiredRoles={['admin']}>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>

            {/* Toast Notifications */}
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
