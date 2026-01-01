"use client";
import { useState } from "react";
import { playClick } from "./sounds"; // Uses your sound engine

export default function StartScreen({ onStart }) {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  const handleStart = () => {
    setFading(true);
    playClick(); // This click UNLOCKS the browser audio!
    
    setTimeout(() => {
      setVisible(false);
      if (onStart) onStart(); // Tell the main page to start music
    }, 800); // Wait for fade out
  };

  if (!visible) return null;

  return (
    <div 
      onClick={handleStart}
      style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        background: '#050505', 
        zIndex: 99999, // On top of everything
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        cursor: 'pointer',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.8s ease-in-out',
        color: 'white',
        fontFamily: 'sans-serif'
      }}
    >
      <h1 style={{ 
        fontSize: '4rem', fontWeight: '900', letterSpacing: '5px', margin: 0,
        textShadow: '0 0 30px rgba(255, 255, 255, 0.5)'
      }}>
        ANONY
      </h1>
      
      <p style={{ 
        marginTop: '20px', color: '#00ff88', letterSpacing: '3px', fontSize: '0.9rem',
        animation: 'pulse 1s infinite alternate' 
      }}>
        [ CLICK TO ENTER ]
      </p>

      <style jsx>{`
        @keyframes pulse {
          from { opacity: 0.5; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}