import React from "react";
import CustomerForm from "./components/CustomerForm";
import "./App.css";

function App() {
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

export default App;