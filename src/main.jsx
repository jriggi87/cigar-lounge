import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import AuthScreen from './AuthScreen.jsx';
import CigarLounge from './CigarLounge.jsx';
import './index.css';

function App() {
  const [user, setUser] = useState(undefined); // undefined = loading, null = not signed in

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
    });
    return () => unsub();
  }, []);

  // Loading state
  if (user === undefined) {
    return (
      <div style={{
        background: "#0f0c08", minHeight: "100vh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&display=swap" rel="stylesheet" />
        <div style={{
          width: 60, height: 60, borderRadius: "50%",
          background: "linear-gradient(135deg, #D4A754, #8B6914)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28, animation: "pulse 1.5s ease-in-out infinite",
        }}>🔥</div>
        <style>{`@keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.8; } }`}</style>
        <p style={{
          color: "#D4A754", fontFamily: "'Playfair Display', serif",
          fontSize: 18, marginTop: 16, fontWeight: 600,
        }}>Cigar Lounge</p>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return <CigarLounge user={user} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
