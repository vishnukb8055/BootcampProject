import React, { useState, useEffect } from "react";
import "../styles/ThankYou.css";
import Confetti from "react-confetti"; // Import Confetti
import { useWindowSize } from "react-use"; // Hook for window size

const ThankYou = () => {
  // Get window dimensions for the confetti effect
  const { width, height } = useWindowSize();

  // State to control confetti visibility
  const [showConfetti, setShowConfetti] = useState(true);

  // Optional: Turn off confetti after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false); // Stop confetti after 5 seconds
    }, 5000);

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {/* Display confetti when the page loads */}
      {showConfetti && <Confetti 
       width={width}
       height={height}
       numberOfPieces={200} 
       gravity={0.10}        
       />}
      
      <div className="thank-you-container">
        <div className="thank-you-content">
          <div className="tick">✔</div>
          <div className="message">
            Thank You for choosing Us: You will receive a confirmation email
            shortly.
          </div>
          <div className="message">
            We are Thankful for Your Choice – TelConnect: Crafting the Future of
            Communication.
          </div>
          <a href="/" className="button">
            Return to Homepage
          </a>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
