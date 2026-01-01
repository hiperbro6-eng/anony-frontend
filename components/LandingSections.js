"use client";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { playHover, playClick } from "./sounds";
import { useStore } from "./store";

export default function LandingSections() {
  const { addToCart } = useStore();

  useEffect(() => {
    // Optimized AOS initialization
    AOS.init({ 
      duration: 1000, 
      once: false, 
      offset: 100,
      easing: 'ease-out-back' // Smoother "pop" effect
    });
  }, []);

  const handleAddToCart = (planName, price) => {
    playClick();
    addToCart({ 
      name: planName, 
      price: price, 
      id: Date.now() 
    });
  };

  return (
    <div style={{ position: 'relative', zIndex: 10, marginTop: '100vh', background: 'transparent' }}>
      
      {/* --- FEATURES SECTION --- */ }
      <section id="features" className="section features">
        <div className="container">
          <h2 className="section-title" data-aos="fade-down">Powerful Features</h2>
          <div className="grid-3">
            {/* Added: data-aos-delay to create a staggered entrance effect */}
            <div className="feature-card animated-card" data-aos="fade-right" data-aos-delay="100" onMouseEnter={playHover}>
              <h3>Our Mission</h3>
              <p>Get immediate solutions to questions with our AI-powered answer system. Perfect for exams and quizzes.</p>
            </div>
            
            <div className="feature-card animated-card" data-aos="fade-up" data-aos-delay="200" onMouseEnter={playHover}>
              <h3>AI Chat Assistant</h3>
              <p>Access our smart AI chat box anytime for explanations, help with concepts, and learning support.</p>
            </div>
            
            <div className="feature-card animated-card" data-aos="fade-left" data-aos-delay="300" onMouseEnter={playHover}>
              <h3>Smart Shortcuts</h3>
              <p>Use keyboard shortcuts to quickly access features without interrupting your workflow.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SHORTCUTS SECTION --- */ }
      <section id="shortcuts" className="section" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="container">
          <h2 className="section-title" data-aos="zoom-in">Smart Shortcuts</h2>
          <div className="grid-3">
            
            <div className="shortcut-card" data-aos="flip-left" data-aos-delay="100" onMouseEnter={playHover}>
              <div className="keys">
                <div className="keycap"><div className="letter">Alt</div></div>
                <div className="keycap"><div className="letter">S</div></div>
              </div>
              <h3>Quick Answers</h3>
              <p>Select question and get instant answers.</p>
            </div>

            <div className="shortcut-card" data-aos="flip-left" data-aos-delay="200" onMouseEnter={playHover}>
              <div className="keys">
                <div className="keycap"><div className="letter">Alt</div></div>
                <div className="keycap"><div className="letter">X</div></div>
              </div>
              <h3>Copy Answers</h3>
              <p>Auto-copy generated answers to clipboard.</p>
            </div>

            <div className="shortcut-card" data-aos="flip-left" data-aos-delay="300" onMouseEnter={playHover}>
              <div className="keys">
                <div className="keycap"><div className="letter">Alt</div></div>
                <div className="keycap"><div className="letter">Q</div></div>
              </div>
              <h3>Snapping Tool</h3>
              <p>Capture diagrams and get AI analysis instantly.</p>
            </div>

          </div>
        </div>
      </section>

      {/* --- PRICING SECTION --- */ }
      <section id="pricing" className="section">
        <div className="container">
          <h2 className="section-title" data-aos="fade-up">Choose Your Plan</h2>
          <div className="grid-3">
            
            <div className="pricing-card" data-aos="fade-up" data-aos-delay="100" onMouseEnter={playHover}>
              <h3>Basic Plan</h3>
              <div className="price">$4.99<span>/mo</span></div>
              <ul className="features-list">
                <li>50 AI queries per day</li>
                <li>Basic text selection</li>
                <li>Standard speed</li>
              </ul>
              <button className="btn btn-outline glow-on-hover" onClick={() => handleAddToCart('Basic Plan', 4.99)}>Buy Basic</button>
            </div>

            {/* Popular card gets a special 'zoom-in' animation */}
            <div className="pricing-card popular" data-aos="zoom-in" data-aos-delay="200" onMouseEnter={playHover}>
              <div className="popular-badge">MOST POPULAR</div>
              <h3>Pro Plan</h3>
              <div className="price">$9.99<span>/mo</span></div>
              <ul className="features-list">
                <li>Unlimited AI queries</li>
                <li>Priority support</li>
                <li>Custom highlights</li>
              </ul>
              <button className="btn glow-on-hover" onClick={() => handleAddToCart('Pro Plan', 9.99)}>Buy Pro</button>
            </div>

            <div className="pricing-card" data-aos="fade-up" data-aos-delay="300" onMouseEnter={playHover}>
              <h3>Lifetime</h3>
              <div className="price">$49.99<span>/once</span></div>
              <ul className="features-list">
                <li>Unlimited forever</li>
                <li>All Pro features</li>
                <li>Early access</li>
              </ul>
              <button className="btn btn-outline glow-on-hover" onClick={() => handleAddToCart('Lifetime Plan', 49.99)}>Buy Lifetime</button>
            </div>

          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer style={{ padding: '60px 40px', textAlign: 'center', borderTop: '1px solid #333', background: '#0a0a0a' }}>
        <h2 style={{ color: 'white', marginBottom: '10px' }} data-aos="fade-in">ANONY</h2>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>© 2025 ANONY EXTENSION • Powered by Intelligence</p>
      </footer>

      {/* NEW CSS ANIMATIONS INJECTED HERE */}
      <style jsx>{`
        .animated-card {
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease;
        }
        .animated-card:hover {
          transform: translateY(-15px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }
        .glow-on-hover {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .glow-on-hover:hover {
          box-shadow: 0 0 20px rgba(255,255,255,0.2);
          transform: scale(1.05);
        }
        .popular-badge {
          background: white;
          color: black;
          font-size: 0.7rem;
          padding: 4px 12px;
          border-radius: 20px;
          font-weight: 900;
          display: inline-block;
          margin-bottom: 15px;
        }
      `}</style>

    </div>
  );
}