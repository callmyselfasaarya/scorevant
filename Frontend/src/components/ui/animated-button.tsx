import React from "react";
import { motion, HTMLMotionProps, useReducedMotion } from "framer-motion";
import { transitions } from "@/lib/design-system";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "ghost" | "glow";
  size?: "sm" | "md" | "lg" | "icon";
  isMagnetic?: boolean;
  "aria-label"?: string;
}

export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, variant = "primary", size = "md", isMagnetic = false, "aria-label": ariaLabel, children, ...props }, ref) => {
    const shouldReduceMotion = useReducedMotion();
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      primary: "bg-gold-primary text-black hover:bg-[#d6a935] shadow-[0_0_15px_rgba(244,197,66,0.2)]",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      glow: "bg-black text-gold-primary border border-gold-primary shadow-[0_0_15px_rgba(244,197,66,0.3)] hover:shadow-[0_0_25px_rgba(244,197,66,0.5)]",
    };

    const sizes = {
      sm: "h-8 rounded-md px-3 text-xs",
      md: "h-10 rounded-md px-8",
      lg: "h-12 rounded-lg px-10 text-base",
      icon: "h-9 w-9",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
        whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
        transition={shouldReduceMotion ? { duration: 0 } : transitions.smooth}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        aria-label={ariaLabel}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
AnimatedButton.displayName = "AnimatedButton";
