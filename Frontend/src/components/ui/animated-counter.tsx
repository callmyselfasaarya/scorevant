import React, { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  direction?: "up" | "down";
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  direction = "up",
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 250,
  });
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      if (shouldReduceMotion) {
        if (ref.current) {
          ref.current.textContent = Intl.NumberFormat("en-US").format(value);
        }
      } else {
        motionValue.set(value);
      }
    }
  }, [motionValue, isInView, value, shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat("en-US").format(
          Math.floor(latest)
        );
      }
    });
  }, [springValue, shouldReduceMotion]);

  return <span ref={ref}>{shouldReduceMotion ? Intl.NumberFormat("en-US").format(value) : (direction === "down" ? value : 0)}</span>;
};
