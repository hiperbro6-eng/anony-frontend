"use client";
import { useEffect, useRef } from "react";

export default function UIEffects() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const moveCursor = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  return (
    <>
      {/* 1. Red Cursor */}
      <div ref={cursorRef} className="custom-cursor" />

      {/* 2. Moving Background Text */}
      <div className="moving-bg-container">
        
        {/* Top Line */}
        <div className="moving-bg" style={{ top: '15%' }}>
          ANONYㅤANONYㅤANONYㅤANONYㅤANONYㅤANONYㅤANONYㅤANONY
        </div>

        {/* Middle Line (Reverse Direction) */}
        <div className="moving-bg" style={{ top: '40%', animationName: 'moveBgReverse' }}>
          ANONYㅤANONYㅤANONYㅤANONYㅤANONYㅤANONYㅤANONYㅤANONY
        </div>

        {/* Bottom Line */}
        <div className="moving-bg" style={{ top: '65%' }}>
          ANONYㅤANONYㅤANONYㅤANONYㅤANONYㅤANONYㅤANONYㅤANONY
        </div>
        
         {/* Very Bottom Line */}
        <div className="moving-bg" style={{ top: '90%', animationName: 'moveBgReverse' }}>
          ANONYㅤANONYㅤANONYㅤANONYㅤANONYㅤANONYㅤANONYㅤANONY
        </div>

      </div>
    </>
  );
}