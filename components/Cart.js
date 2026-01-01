"use client";
import { useStore } from "./store";

export default function Cart() {
  const { cart, isOpen, toggleCart, removeFromCart } = useStore();

  // If the cart is closed, don't render anything
  if (!isOpen) return null;

  // --- FIXED TOTAL CALCULATION ---
  const total = cart.reduce((sum, item) => {
    // 1. If price is already a number (e.g., 9.99), just add it
    if (typeof item.price === 'number') {
      return sum + item.price;
    }
    
    // 2. If price is a string (e.g., "$9.99"), clean it first
    if (typeof item.price === 'string') {
      const cleanPrice = parseFloat(item.price.replace(/[^0-9.]/g, ""));
      return sum + (isNaN(cleanPrice) ? 0 : cleanPrice);
    }

    return sum;
  }, 0);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '100%',
      maxWidth: '400px',
      height: '100vh',
      background: 'rgba(15, 15, 15, 0.95)',
      backdropFilter: 'blur(15px)',
      boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
      zIndex: 2000,
      padding: '30px',
      display: 'flex',
      flexDirection: 'column',
      borderLeft: '1px solid rgba(255,255,255,0.1)',
      animation: 'slideIn 0.3s ease-out'
    }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ color: 'white', margin: 0 }}>Your Cart</h2>
        <button 
          onClick={toggleCart}
          style={{ background: 'transparent', border: 'none', color: '#888', fontSize: '1.5rem', cursor: 'pointer' }}
        >
          ✕
        </button>
      </div>

      {/* CART ITEMS LIST */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {cart.length === 0 ? (
          <p style={{ color: '#666', textAlign: 'center', marginTop: '50px' }}>Your cart is empty.</p>
        ) : (
          cart.map((item, index) => (
            <div key={index} style={{
              background: 'rgba(255,255,255,0.05)',
              padding: '15px',
              borderRadius: '12px',
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h4 style={{ color: 'white', margin: '0 0 5px 0' }}>{item.name}</h4>
                {/* Display price formatted nicely */}
                <p style={{ color: '#4ade80', margin: 0, fontSize: '0.9rem' }}>
                   ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                </p>
              </div>
              <button 
                onClick={() => removeFromCart(index)}
                style={{ 
                  color: '#ff4444', 
                  background: 'transparent', 
                  border: 'none', 
                  cursor: 'pointer',
                  padding: '5px'
                }}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      {/* FOOTER & CHECKOUT */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', marginTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '1.2rem', fontWeight: 'bold' }}>
          <span style={{ color: '#aaa' }}>Total:</span>
          <span style={{ color: 'white' }}>${total.toFixed(2)}</span>
        </div>
        
        <button style={{
          width: '100%',
          padding: '15px',
          background: 'white',
          color: 'black',
          border: 'none',
          borderRadius: '30px',
          fontWeight: 'bold',
          fontSize: '1rem',
          cursor: 'pointer',
          transition: 'transform 0.2s'
        }}
        onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          Checkout Now
        </button>
      </div>

      {/* Simple Slide Animation Style */}
      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}