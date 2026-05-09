import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { transitions } from "@/lib/design-system";

interface OverlayProps {
  isOpen: boolean;
  onClose?: () => void;
  blur?: "sm" | "md" | "lg" | "heavy";
  children?: React.ReactNode;
}

export const Overlay: React.FC<OverlayProps> = ({ 
  isOpen, 
  onClose, 
  blur = "md",
  children 
}) => {
  const shouldReduceMotion = useReducedMotion();
  const blurClasses = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
    heavy: "backdrop-blur-[40px]",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={shouldReduceMotion ? { duration: 0.1 } : transitions.smooth}
          className={`fixed inset-0 z-50 bg-black/60 ${blurClasses[blur]} flex items-center justify-center p-4`}
          onClick={onClose}
          aria-hidden="true"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
