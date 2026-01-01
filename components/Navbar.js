"use client";
import { useState, useEffect } from "react";
import { useStore } from "./store";

export default function Navbar() {
  // ✅ JUST GET THE CART DIRECTLY
  const { cart, toggleCart } = useStore();
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 100) {
        setActiveSection('home');
        return;
      }
      const sections = ['features', 'shortcuts', 'pricing'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= -150 && rect.top < 400) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setActiveSection(id);
  };

  const getLinkStyle = (sectionName) => ({
    cursor: 'pointer',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    color: activeSection === sectionName ? '#ffffff' : '#888888',
    textShadow: activeSection === sectionName ? '0 0 10px rgba(255,255,255,0.5)' : 'none',
    borderBottom: activeSection === sectionName ? '2px solid white' : '2px solid transparent',
    paddingBottom: '5px'
  });

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, width: '100%', padding: '20px 50px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      zIndex: 1000, pointerEvents: 'auto',
      background: 'rgba(10, 10, 10, 0.85)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.08)'
    }}>
      
      {/* LOGO */}
      <div onClick={(e) => scrollToSection(e, 'home')} style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }}>
        <div className="logo-container" style={{
          width: "40px", height: "40px", borderRadius: "50%", overflow: "hidden",
          backgroundColor: "white", display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <img src="/logo.gif" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '1px', color: 'white' }}>
          ANONY
        </div>
      </div>

      {/* LINKS */}
      <div style={{ display: 'flex', gap: '40px', fontSize: '0.9rem' }}>
        <a href="#" onClick={(e) => scrollToSection(e, 'home')} style={getLinkStyle('home')}>HOME</a>
        <a href="#features" onClick={(e) => scrollToSection(e, 'features')} style={getLinkStyle('features')}>FEATURES</a>
        <a href="#shortcuts" onClick={(e) => scrollToSection(e, 'shortcuts')} style={getLinkStyle('shortcuts')}>SHORTCUTS</a>
        <a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')} style={getLinkStyle('pricing')}>PRICING</a>
      </div>

      {/* CART BUTTON */}
      <button 
        onClick={toggleCart}
        style={{
          background: 'white', color: 'black', border: 'none', padding: '10px 25px',
          borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', zIndex: 1001,
          boxShadow: '0 0 15px rgba(255,255,255,0.2)',
          transition: 'transform 0.2s'
        }}
        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {/* ✅ SHOW REAL CART LENGTH */}
        Cart ({cart.length})
      </button>

    </nav>
  );
}