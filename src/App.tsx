import React, { useEffect, useState } from 'react';
import { Dashboard } from './pages/Dashboard';
import './index.css';
import { SplashScreen } from './components/SplashScreen';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      setShowDashboard(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App">
      {showSplash && <SplashScreen />}
      {showDashboard && (
        <div className="page-enter page-enter-active">
          <Dashboard />
        </div>
      )}
    </div>
  );
}

export default App;