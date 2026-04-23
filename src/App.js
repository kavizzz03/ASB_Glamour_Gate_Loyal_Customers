import React, { useState, useEffect } from "react";
import CustomerForm from "./components/CustomerForm";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("Initializing");

  useEffect(() => {
    // Premium loading messages
    const messages = [
      "Initializing System",
      "Loading Secure Portal",
      "Verifying Credentials",
      "Preparing Dashboard",
      "Welcome to Glamour Gate"
    ];
    
    let progress = 0;
    let mounted = true;
    let messageIndex = 0;
    
    const interval = setInterval(() => {
      if (!mounted) return;
      
      progress += 8;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          if (mounted) {
            setLoading(false);
          }
        }, 500);
      }
      
      setLoadingProgress(Math.min(progress, 100));
      
      // Update message based on progress
      const newMessageIndex = Math.floor(progress / 20);
      if (newMessageIndex < messages.length && newMessageIndex !== messageIndex) {
        messageIndex = newMessageIndex;
        setLoadingMessage(messages[messageIndex]);
      }
    }, 180);

    // Cleanup function
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []); // Empty dependency array - no missing dependencies

  // If loading is false, show the main app
  if (!loading) {
    return (
      <div className="App relative min-h-screen overflow-hidden">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[80px] animate-float-bg"></div>
          <div className="absolute bottom-[-15%] left-[-5%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[80px] animate-float-bg" style={{ animationDelay: '-5s' }}></div>
          <div className="absolute top-[40%] right-[30%] w-[300px] h-[300px] bg-pink-500/8 rounded-full blur-[80px] animate-float-bg" style={{ animationDelay: '-10s' }}></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          
          {/* Floating Stars */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-pulse"
              style={{
                width: Math.random() * 3 + 1 + 'px',
                height: Math.random() * 3 + 1 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animationDuration: Math.random() * 5 + 3 + 's',
                animationDelay: Math.random() * 5 + 's',
                opacity: Math.random() * 0.5 + 0.2,
              }}
            ></div>
          ))}
        </div>

        {/* Main Component */}
        <CustomerForm />
      </div>
    );
  }

  // Show loading screen while loading is true
  return (
    <div className="loading-screen-premium">
      {/* Animated Background Gradients */}
      <div className="loading-bg-1"></div>
      <div className="loading-bg-2"></div>
      <div className="loading-bg-3"></div>
      
      {/* Grid Pattern Overlay */}
      <div className="loading-grid"></div>
      
      {/* Main Loading Container */}
      <div className="loading-container-premium">
        {/* Logo Section - Square with Rounded Corners */}
        <div className="logo-section">
          <div className="logo-wrapper">
            <div className="logo-glow"></div>
            <div className="logo-border"></div>
            <div className="logo-square">
              <img 
                src="/assets/logo.png" 
                alt="Glamour Gate Logo"
                className="logo-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<i class="fas fa-gem logo-fallback"></i>';
                }}
              />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <div className="welcome-section">
          <h1 className="premium-title">
            <span className="title-gradient">GLAMOUR GATE</span>
          </h1>
          <p className="premium-subtitle">LOYALTY CUSTOMER REGISTRATION PORTAL</p>
          <div className="divider"></div>
          <p className="premium-location">Negombo • The Fashion Landmark in Sri Lanka</p>
        </div>

        {/* Loading Progress */}
        <div className="loading-section">
          <div className="loading-status">
            <span className="loading-message-premium">{loadingMessage}</span>
            <span className="loading-percentage">{loadingProgress}%</span>
          </div>
          
          <div className="progress-bar-premium">
            <div 
              className="progress-fill-premium"
              style={{ width: `${loadingProgress}%` }}
            >
              <div className="progress-shimmer"></div>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="loading-footer-premium">
          <p>Secured Registration Portal • Version 1.0</p>
          <p className="footer-copyright">© 2026 Glamour Gate • All Rights Reserved</p>
        </div>
      </div>
    </div>
  );
}

export default App;