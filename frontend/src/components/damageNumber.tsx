import React, { useEffect, useState } from "react";


interface FloatingDamageEffectProps {
  damage: number|null;
  onAnimationEnd: () => void;
}

const FloatingDamageEffect: React.FC<FloatingDamageEffectProps> = ({
  damage,
  onAnimationEnd,
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const randomLeft = Math.random() * 20 - 10; // Random left offset between -10 and 10
    const randomTop = Math.random() * 20 - 10; // Random top offset between -10 and 10
    setPosition({ top: randomTop, left: randomLeft });

    const timer = setTimeout(() => {
      onAnimationEnd();
    }, 1000); // Animation duration in milliseconds

    return () => clearTimeout(timer);
  }, [onAnimationEnd]);

  return (
    <div
      className="floating-damage"
      style={{ transform: `translate(${position.left}px, ${position.top}px)` }}
    >
      {damage}
    </div>
  );
};

export default FloatingDamageEffect;
