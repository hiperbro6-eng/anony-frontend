"use client";
import { useState, useEffect, useRef } from "react";
import { getAudioContext } from "./sounds";

export default function BackgroundSound() {
  const [status, setStatus] = useState("STANDBY"); // STANDBY | ONLINE | MUTED
  const oscillatorsRef = useRef([]);
  const gainNodeRef = useRef(null);
  const isStartedRef = useRef(false);

  const startDrone = () => {
    const ctx = getAudioContext();
    if (!ctx) return;

    // 1. Resume Context (Unlocks audio)
    ctx.resume().then(() => {
      if (isStartedRef.current) return;
      isStartedRef.current = true;
      setStatus("ONLINE");

      // 2. Master Volume (Very Low Ambient)
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.0, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 4); // Soft fade in
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // 3. Sci-Fi Drone Generation
      const freqs = [55, 57, 110]; 
      const oscillators = [];

      freqs.forEach(freq => {
        const osc = ctx.createOscillator();
        osc.type = "sawtooth"; 
        osc.frequency.value = freq;
        
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 120; // Very muffled and dark

        osc.connect(filter);
        filter.connect(masterGain);
        osc.start();
        oscillators.push(osc);
      });

      oscillatorsRef.current = oscillators;
    }).catch(err => console.log("Audio waiting for interaction..."));
  };

  const stopDrone = () => {
    const ctx = getAudioContext();
    if (gainNodeRef.current && ctx) {
      gainNodeRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
      
      setTimeout(() => {
        oscillatorsRef.current.forEach(osc => osc.stop());
        oscillatorsRef.current = [];
        isStartedRef.current = false;
        setStatus("MUTED");
      }, 500);
    } else {
        setStatus("MUTED");
    }
  };

  const toggleSound = () => {
    if (status === "ONLINE") {
      stopDrone();
    } else {
      startDrone();
    }
  };

  // AUTO-START LOGIC
  useEffect(() => {
    // 1. Try starting immediately (Works in some browsers)
    startDrone();

    // 2. If blocked, wait for the FIRST CLICK anywhere on the page
    const handleFirstInteraction = () => {
      if (!isStartedRef.current) {
        startDrone();
      }
      // Clean up listeners
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      stopDrone();
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      zIndex: 2000
    }}>
      <button 
        onClick={(e) => {
          e.stopPropagation(); 
          toggleSound();
        }}
        style={{
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: status === "ONLINE" ? '#00ff88' : '#666',
          padding: '12px 24px',
          borderRadius: '4px', // Cyberpunk sharp edges
          fontSize: '0.7rem',
          fontWeight: '900',
          letterSpacing: '2px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: status === "ONLINE" ? '0 0 30px rgba(0, 255, 136, 0.15)' : 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          textTransform: 'uppercase'
        }}
      >
        {/* Animated Equalizer Bars */}
        <div style={{
          display: 'flex', gap: '3px', alignItems: 'flex-end', height: '12px'
        }}>
          <div style={{ width: '2px', background: status === "ONLINE" ? '#00ff88' : '#444', height: '100%', animation: status === "ONLINE" ? 'eq 0.5s infinite alternate' : 'none' }}/>
          <div style={{ width: '2px', background: status === "ONLINE" ? '#00ff88' : '#444', height: '60%', animation: status === "ONLINE" ? 'eq 0.7s infinite alternate' : 'none' }}/>
          <div style={{ width: '2px', background: status === "ONLINE" ? '#00ff88' : '#444', height: '80%', animation: status === "ONLINE" ? 'eq 0.6s infinite alternate' : 'none' }}/>
        </div>

        {status === "ONLINE" ? "SYSTEM ONLINE" : "SYSTEM STANDBY"}
      </button>
      
      <style jsx>{`
        @keyframes eq {
          0% { height: 30%; opacity: 0.5; }
          100% { height: 100%; opacity: 1; }
        }
      `}</style>
    </div>
  );
}