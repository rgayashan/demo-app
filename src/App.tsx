import React, { useEffect, useState } from 'react';
import { Dashboard } from './pages/Dashboard';
import './index.css';
import { SplashScreen } from './components/SplashScreen';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      setShowDashboard(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // Show splash screen and then dashboard if authenticated
  return (
    <div className="App">
      {showSplash && <SplashScreen />}
      {showDashboard && (
        <div className="page-enter page-enter-active">
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;