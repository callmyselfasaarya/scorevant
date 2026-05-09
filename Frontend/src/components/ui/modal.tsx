import React, { useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Overlay } from "./overlay";
import { Panel } from "./panel";
import { transitions } from "@/lib/design-system";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const shouldReduceMotion = useReducedMotion();

  // Focus trapping setup could go here, or we can use standard autoFocus
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  return (
    <Overlay isOpen={isOpen} onClose={onClose} blur="heavy">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
            transition={shouldReduceMotion ? { duration: 0.1 } : transitions.cinematic}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg focus:outline-none"
            tabIndex={-1}
          >
            <Panel variant="heavy" className="p-6">
              {title && (
                <div className="mb-6 pb-4 border-b border-white/10">
                  <h2 id="modal-title" className="text-2xl font-display tracking-widest text-gold-primary uppercase">
                    {title}
                  </h2>
                </div>
              )}
              <div className="text-white/80">
                {children}
              </div>
            </Panel>
          </motion.div>
        )}
      </AnimatePresence>
    </Overlay>
  );
};
