import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface PanelProps extends HTMLMotionProps<"div"> {
  variant?: "glass" | "liquid" | "heavy";
  glow?: boolean;
}

export const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  ({ className, variant = "glass", glow = false, children, ...props }, ref) => {
    
    const variants = {
      glass: "glass-panel",
      liquid: "liquid-glass",
      heavy: "glass-panel-heavy",
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-xl overflow-hidden",
          variants[variant],
          glow && "glow-border",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
Panel.displayName = "Panel";
