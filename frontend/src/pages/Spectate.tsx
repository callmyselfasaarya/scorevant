import React from "react";
import { useRoute } from "wouter";
import { useMatchState } from "../hooks/useMatchState";
import { ScoreboardCard } from "../components/ui/scoreboard-card";
import { motion } from "framer-motion";
import { getTennisScoreDisplay } from "../lib/scoring";

export default function Spectate() {
  const [, params] = useRoute("/spectate/:id");
  const matchId = params?.id;

  const { state } = useMatchState(true, matchId);

  if (!matchId) {
    return <div className="text-white p-10 text-center">No match ID provided.</div>;
  }

  if (state.status === "setup") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-8 h-8 border-4 border-gold-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white/60 font-display tracking-widest uppercase">
            Connecting to live match stream...
          </p>
        </div>
      </div>
    );
  }

  const isTennis = state.sport === "tennis";
  let p1Display: string | number = state.currentGame.p1Points;
  let p2Display: string | number = state.currentGame.p2Points;

  if (isTennis) {
    [p1Display, p2Display] = getTennisScoreDisplay(
      state.currentGame.p1Points,
      state.currentGame.p2Points
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col p-4 md:p-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-gold-primary/5 blur-[120px] -z-10" />
      
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-display text-white uppercase tracking-widest">
          Scorevant <span className="text-gold-primary">Live Spectator</span>
        </h1>
        <p className="text-white/50 text-sm mt-2 uppercase tracking-widest">
          {state.sport} • Best of {state.format.bestOf}
        </p>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center gap-10">
        <ScoreboardCard
          playerOneName={state.player1}
          playerTwoName={state.player2}
          playerOneScore={p1Display}
          playerTwoScore={p2Display}
          isLive={state.status === "playing"}
        />

        <div className="flex justify-center gap-4 text-xl font-display tracking-widest">
          {state.sets.map((set, i) => (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              key={i}
              className="flex flex-col items-center bg-white/5 px-4 py-2 rounded-xl border border-white/10"
            >
              <span className={set.p1 > set.p2 ? "text-gold-primary" : "text-white/40"}>
                {set.p1}
              </span>
              <span className="w-4 h-[2px] bg-white/10 my-1" />
              <span className={set.p2 > set.p1 ? "text-gold-primary" : "text-white/40"}>
                {set.p2}
              </span>
            </motion.div>
          ))}
          {isTennis && state.status === "playing" && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center bg-gold-primary/10 px-4 py-2 rounded-xl border border-gold-primary/20 animate-pulse"
            >
              <span className="text-gold-primary font-bold">
                {state.p1Games}
              </span>
              <span className="w-4 h-[2px] bg-gold-primary/20 my-1" />
              <span className="text-gold-primary font-bold">
                {state.p2Games}
              </span>
            </motion.div>
          )}
        </div>
        
        {state.status === 'finished' && (
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-center p-6 bg-gold-primary/10 border border-gold-primary/20 rounded-2xl"
           >
             <h2 className="text-2xl font-display tracking-widest text-[#F4C542] uppercase">
               Match Finished
             </h2>
             <p className="text-white mt-2">Winner: {state.winner === 1 ? state.player1 : state.player2}</p>
           </motion.div>
        )}
      </main>
    </div>
  );
}
