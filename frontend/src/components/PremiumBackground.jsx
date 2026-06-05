import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

function PremiumBackground({ dark = false }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 22 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 22 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className={dark ? "premium-bg premium-bg-dark" : "premium-bg"}>
      <motion.div
        className="premium-cursor-glow"
        style={{
          left: smoothX,
          top: smoothY,
        }}
      />

      <motion.div
        className="premium-orb premium-orb-1"
        animate={{ y: [0, -30, 0], x: [0, 18, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="premium-orb premium-orb-2"
        animate={{ y: [0, 35, 0], x: [0, -22, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="premium-orb premium-orb-3"
        animate={{ y: [0, -22, 0], rotate: [0, 20, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="premium-grid" />
    </div>
  );
}

export default PremiumBackground;