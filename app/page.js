"use client";

import { useRef, useEffect, useState } from "react"; // <--- Added imports
import { Canvas } from "@react-three/fiber";
import Experience from "../components/Experience";
import Navbar from "../components/Navbar";
import Cart from "../components/Cart";
import UIEffects from "../components/UIEffects";
import LandingSections from "../components/LandingSections";
import BackgroundSound from "../components/BackgroundSound"; 
import StartScreen from "../components/StartScreen"; 
import { useStore } from "../components/store";
import { playClick } from "../components/sounds";

export default function Home() {
  const addToCart = useStore((state) => state.addToCart);
  const product = { id: 99, name: "ANONY PRO", price: "$9.99", color: "#ffffff", roughness: 0.1 };
  
  // 1. We create a reference to the main container
  const mainRef = useRef(null);

  return (
    // 2. Attach the ref to the main wrapper
    <main 
      ref={mainRef}
      style={{ width: "100%", minHeight: "100vh", position: "relative", background: "transparent" }}
    >
      
      {/* GLOBAL LAYERS */}
      <StartScreen />
      <UIEffects />
      <BackgroundSound /> 
      <Navbar />
      <Cart />

      {/* 3. THE 3D DRONE (Fixed Layer) */}
      <div style={{ 
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', 
        zIndex: 50,           
        pointerEvents: 'none' /* <--- CRITICAL: Lets clicks pass through to buttons */
      }}>
        {/* 4. THE MAGIC: eventSource 
            This tells the 3D scene: "Ignore the fact that I am unclickable. 
            Listen to the mouse on the 'main' div instead!" 
        */}
        <Canvas eventSource={mainRef} eventPrefix="client">
          <group position={[2, 0, 0]}>
             <Experience color={product.color} roughness={product.roughness} />
          </group>
        </Canvas>
      </div>

      {/* 4. SCROLLABLE CONTENT */}
      {/* Hero Text */}
      <div style={{ 
        height: '100vh', 
        width: '100%', 
        position: 'relative', 
        zIndex: 10,
        display: 'flex', 
        alignItems: 'center',
        marginBottom: '-120vh', // Your aggressive fix (keep it if it works!)
        paddingLeft: '10%'
      }}>
        <div style={{ maxWidth: '600px' }}>
          <h1 style={{ 
            fontSize: '6rem', lineHeight: 1, fontWeight: '900', color: 'white', 
            textShadow: '0 0 30px rgba(0,0,0,0.5)', margin: 0 
          }}>
            ANONY<br/>EXTENSION
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#ccc', margin: '20px 0', lineHeight: 1.6 }}>
            Your intelligent learning companion. Study smarter with AI assistance.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <button 
              className="btn" 
              style={{ pointerEvents: 'auto' }} // Extra safety
              onClick={() => {
                playClick(); 
                document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Buy Now
            </button>
            <button 
            className="btn btn-outline" 
            style={{ pointerEvents: 'auto' }} 
            onClick={() => window.open('https://www.youtube.com/@anony4048', '_blank')}
            >
                Watch Demo
            </button>
            <button 
            className="btn btn-outline" 
            style={{ pointerEvents: 'auto' }} 
            onClick={() => window.open('https://wa.me/94710865862', '_blank')}
            >
                Contact Me
            </button>
          </div>
        </div>
      </div>

      {/* Features & Pricing */}
      <LandingSections />

    </main>
  );
}