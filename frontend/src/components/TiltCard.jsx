import { useState } from "react";

function TiltCard({ children, className = "" }) {
  const [style, setStyle] = useState({});

  const handleMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;

    setStyle({
      transform: `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`,
      "--spot-x": `${x}px`,
      "--spot-y": `${y}px`,
    });
  };

  const reset = () => {
    setStyle({
      transform: "perspective(900px) rotateX(0deg) rotateY(0deg)",
    });
  };

  return (
    <div
      className={`tilt-card ${className}`}
      style={style}
      onMouseMove={handleMove}
      onMouseLeave={reset}
    >
      {children}
    </div>
  );
}

export default TiltCard;