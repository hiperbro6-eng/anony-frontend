"use client";
import { useState } from "react";
import { useStore } from "./store";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function Cart() {
  const { cart, isOpen, toggleCart, removeFromCart, clearCart } = useStore();
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  // --- TOTAL CALCULATION ---
  const total = cart.reduce((sum, item) => {
    if (typeof item.price === 'number') return sum + item.price;
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
      background: 'rgba(15, 15, 15, 0.98)',
      backdropFilter: 'blur(15px)',
      boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
      zIndex: 2000,
      borderLeft: '1px solid rgba(255,255,255,0.1)',
      animation: 'slideIn 0.3s ease-out',
      
      /* ENABLE SCROLLING FOR EVERYTHING */
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto', // Scrollbar for the whole container
      scrollbarWidth: 'thin',
    }}>
      
      {/* HEADER - CHANGED: No longer sticky. It will scroll up. */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '30px 30px 20px 30px', 
        // position: 'sticky' <-- REMOVED THIS
        // top: 0 <-- REMOVED THIS
      }}>
        <h2 style={{ color: 'white', margin: 0 }}>Your Cart</h2>
        <button 
          onClick={toggleCart}
          style={{ background: 'transparent', border: 'none', color: '#888', fontSize: '1.5rem', cursor: 'pointer' }}
        >
          ✕
        </button>
      </div>

      {/* CONTENT WRAPPER */}
      <div style={{ padding: '0 30px 50px 30px' }}> 

        {/* CART ITEMS LIST */}
        <div style={{ marginBottom: '30px' }}>
          {cart.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center', marginTop: '20px' }}>Your cart is empty.</p>
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

        {/* FOOTER & PAYPAL CHECKOUT */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '1.2rem', fontWeight: 'bold' }}>
            <span style={{ color: '#aaa' }}>Total:</span>
            <span style={{ color: 'white' }}>${total.toFixed(2)}</span>
          </div>
          
          {success ? (
             <div style={{ 
               padding: '15px', 
               background: 'rgba(74, 222, 128, 0.2)', 
               color: '#4ade80', 
               borderRadius: '10px', 
               textAlign: 'center',
               fontWeight: 'bold'
             }}>
               🎉 Payment Successful!
             </div>
          ) : (
             total > 0 && (
               <PayPalScriptProvider options={{ 
                 "client-id": "AUUEg0FSQDqZsCwbLu0QzKZdxNDgNWtnVZqanpjYJH9uFzyZouVllWU8jt_g0pVJL87zMMVE8FED6waZ" 
               }}>
                 <PayPalButtons 
                   style={{ layout: "vertical", shape: "rect" }}
                   createOrder={(data, actions) => {
                     return actions.order.create({
                       purchase_units: [{
                         amount: { value: total.toFixed(2), currency_code: "USD" },
                         description: "Digital Download"
                       }],
                       application_context: {
                          shipping_preference: "NO_SHIPPING"
                       }
                     });
                   }}
                   onApprove={(data, actions) => {
                     return actions.order.capture().then((details) => {
                       setSuccess(true);
                       setTimeout(() => {
                          clearCart(); 
                          setSuccess(false); 
                          toggleCart(); 
                       }, 2500);
                     });
                   }}
                   onError={(err) => {
                      console.error("PayPal Error:", err);
                      alert("Payment failed. Please try again.");
                   }}
                 />
               </PayPalScriptProvider>
             )
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        div::-webkit-scrollbar {
          width: 8px;
        }
        div::-webkit-scrollbar-track {
          background: #1a1a1a;
        }
        div::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}