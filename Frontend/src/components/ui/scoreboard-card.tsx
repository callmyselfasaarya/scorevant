import React from "react";
import { motion } from "framer-motion";
import { Panel } from "./panel";
import { AnimatedCounter } from "./animated-counter";

interface ScoreboardCardProps {
  playerOneName: string;
  playerTwoName: string;
  playerOneScore: number;
  playerTwoScore: number;
  isLive?: boolean;
}

export const ScoreboardCard: React.FC<ScoreboardCardProps> = ({
  playerOneName,
  playerTwoName,
  playerOneScore,
  playerTwoScore,
  isLive = false
}) => {
  return (
    <Panel 
      variant="heavy" 
      glow={isLive} 
      className="p-6 w-full max-w-md mx-auto"
      role="region"
      aria-label={`Match score between ${playerOneName} and ${playerTwoName}`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-display uppercase text-white tracking-widest" aria-hidden="true">Match Score</h3>
        {isLive && (
          <div className="flex items-center gap-2" role="status" aria-label="Match is currently live">
            <span className="relative flex h-3 w-3" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-gold-primary"></span>
            </span>
            <span className="text-gold-primary text-sm font-medium tracking-widest uppercase">Live</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-3 items-center gap-4">
        <div className="text-center space-y-2">
          <p className="text-sm text-white/70 uppercase tracking-wider truncate" aria-label={`Player 1: ${playerOneName}`}>{playerOneName}</p>
          <div className="text-5xl font-display text-white" aria-label={`Score: ${playerOneScore}`}>
            <AnimatedCounter value={playerOneScore} />
          </div>
        </div>
        
        <div className="text-center" aria-hidden="true">
          <span className="text-gold-primary/50 text-2xl font-display">VS</span>
        </div>
        
        <div className="text-center space-y-2">
          <p className="text-sm text-white/70 uppercase tracking-wider truncate" aria-label={`Player 2: ${playerTwoName}`}>{playerTwoName}</p>
          <div className="text-5xl font-display text-white" aria-label={`Score: ${playerTwoScore}`}>
            <AnimatedCounter value={playerTwoScore} />
          </div>
        </div>
      </div>
      
      {/* Screen reader only live score update */}
      <div className="sr-only" aria-live="polite">
        Current score is {playerOneScore} to {playerTwoScore}.
      </div>
    </Panel>
  );
};
