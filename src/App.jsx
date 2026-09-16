import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CreatePage from './pages/CreatePage';
import DistributePage from './pages/DistributePage';
import SettingsPage from './pages/SettingsPage';

import PagesManager from './components/settings/PagesManager';
import GroupsManager from './components/settings/GroupsManager';
import ConnectionStatus from './components/settings/ConnectionStatus';

export const App = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/create" element={<CreatePage />} />
              <Route path="/distribute" element={<DistributePage />} />

              <Route path="/settings" element={<SettingsPage />}>
                <Route index element={<Navigate to="pages" replace />} />
                <Route path="pages" element={<PagesManager />} />
                <Route path="groups" element={<GroupsManager />} />
                <Route path="connection" element={<ConnectionStatus />} />
              </Route>

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4500,
              style: {
                background: '#0f172a',
                color: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #1e293b',
                padding: '12px 16px',
                fontSize: '13px',
                fontWeight: 500,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
              },
              success: {
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
              },
            }}
          />
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
};

export default App;
