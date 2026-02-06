"use client";
import { useState, useEffect } from "react";
import { useStore } from "./store";

export default function Navbar() {

  const { cart, toggleCart } = useStore();
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

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
    setMenuOpen(false); // close menu on click
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
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      padding: '20px 30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 1000,
      background: 'rgba(10, 10, 10, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.08)'
    }}>

      {/* LOGO */}
      <div
        onClick={(e) => scrollToSection(e, 'home')}
        style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
      >
        <div style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          overflow: "hidden",
          backgroundColor: "white"
        }}>
          <img src="/logo.gif" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>

        <div style={{
          fontSize: '1.4rem',
          fontWeight: '800',
          letterSpacing: '1px',
          color: 'white'
        }}>
          ANONY
        </div>
      </div>

      {/* NAV LINKS */}
      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <a onClick={(e)=>scrollToSection(e,'home')} style={getLinkStyle('home')}>HOME</a>
        <a onClick={(e)=>scrollToSection(e,'features')} style={getLinkStyle('features')}>FEATURES</a>
        <a onClick={(e)=>scrollToSection(e,'shortcuts')} style={getLinkStyle('shortcuts')}>SHORTCUTS</a>
        <a onClick={(e)=>scrollToSection(e,'pricing')} style={getLinkStyle('pricing')}>PRICING</a>
      </div>

      {/* RIGHT SIDE */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>

        {/* HAMBURGER */}
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>

        {/* CART */}
        <button
          onClick={toggleCart}
          style={{
            background: 'white',
            color: 'black',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '30px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Cart ({cart.length})
        </button>

      </div>
    </nav>
  );
}
