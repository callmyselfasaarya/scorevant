import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useMatchState } from '../hooks/useMatchState';
import { useMatchHistory } from '../hooks/useMatchHistory';
import { getTennisScoreDisplay } from '../lib/scoring';
import { Button } from '@/components/ui/button';
import { RotateCcw, Trophy, Home as HomeIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
const scorevantLogomark = '/logo-mark.png';

export default function Scoreboard() {
  const [, setLocation] = useLocation();
  const { state, startMatch, scoreP1, scoreP2, undo } = useMatchState();
  const { saveMatch } = useMatchHistory();

  useEffect(() => {
    const setup = sessionStorage.getItem('match_setup');
    if (setup) {
      const data = JSON.parse(setup);
      startMatch(data);
      sessionStorage.removeItem('match_setup');
    } else if (state.status === 'setup') {
      setLocation('/');
    }
  }, [startMatch, setLocation, state.status]);

  const handleFinish = () => {
    if (state.winner) {
      saveMatch({
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        sport: state.sport,
        player1: state.player1,
        player2: state.player2,
        format: state.format,
        sets: state.sets,
        winner: state.winner,
        p1Sets: state.p1Sets,
        p2Sets: state.p2Sets
      });
    }
    setLocation('/');
  };

  if (state.status === 'setup') return null;

  const isTennis = state.sport === 'tennis';

  let p1Display = state.currentGame.p1Points.toString();
  let p2Display = state.currentGame.p2Points.toString();

  // Handle tennis scoring display
  if (isTennis && state.p1Sets !== 6 && state.p2Sets !== 6) { // rough check for not tiebreak
    [p1Display, p2Display] = getTennisScoreDisplay(state.currentGame.p1Points, state.currentGame.p2Points);
  }

  if (state.status === 'finished') {
    const winnerName = state.winner === 1 ? state.player1 : state.player2;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-panel p-12 rounded-3xl text-center space-y-8 max-w-md w-full glow-border"
        >
          <Trophy className="w-24 h-24 mx-auto text-[var(--sport-accent)] glow-text" />
          <div>
            <h2 className="text-4xl font-display uppercase tracking-wider">Winner</h2>
            <p className="text-5xl font-display text-[var(--sport-accent)] mt-2">{winnerName}</p>
          </div>
          
          <div className="flex justify-center gap-4 text-2xl font-display text-muted-foreground">
            {state.sets.map((set, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className={state.winner === 1 ? 'text-foreground' : ''}>{set.p1}</span>
                <span className="w-4 h-[1px] bg-white/20 my-1" />
                <span className={state.winner === 2 ? 'text-foreground' : ''}>{set.p2}</span>
              </div>
            ))}
          </div>

          <Button 
            onClick={handleFinish}
            className="w-full h-14 text-lg font-bold bg-[var(--sport-accent)] text-black hover:bg-[var(--sport-accent)] hover:brightness-110"
          >
            SAVE & RETURN
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] w-full flex flex-col p-2 md:p-6 overflow-hidden max-w-4xl mx-auto relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 md:mb-8">
        <Button variant="ghost" size="icon" onClick={() => setLocation('/')} className="text-white/50 hover:text-white">
          <HomeIcon className="w-5 h-5" />
        </Button>
        <div className="flex flex-col items-center gap-1">
          <img
            src={scorevantLogomark}
            alt="Scorevant"
            className="h-9 w-auto object-contain"
            style={{ filter: 'drop-shadow(0 0 8px rgba(245,201,66,0.45))' }}
            data-testid="logo-mark-scoreboard"
          />
          <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--sport-accent)] glow-text">
            {state.sport.replace('-', ' ')} • Best of {state.format.bestOf}
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={undo} disabled={state.history.length === 0} className="text-white/50 hover:text-white">
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>

      {/* Main Scoreboard */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-8">
        
        {/* Player 1 Card */}
        <button 
          onClick={scoreP1}
          className="flex-1 relative group rounded-3xl overflow-hidden glass-panel border-white/5 active:scale-[0.98] transition-transform"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
          <div className="relative h-full flex flex-col justify-center items-center p-6">
            <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
              <span className="text-xl md:text-3xl font-display tracking-wider text-white/90">{state.player1}</span>
              {state.currentGame.server === 1 && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-[var(--sport-accent)] glow-border"
                />
              )}
            </div>

            <div className="flex-1 flex items-center justify-center">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={p1Display}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="text-[12rem] md:text-[18rem] leading-none font-display tracking-tighter text-[var(--sport-accent)] glow-text"
                >
                  {p1Display}
                </motion.span>
              </AnimatePresence>
            </div>
            
            <div className="absolute bottom-6 flex gap-2 text-2xl font-display text-white/50">
              {state.sets.map((s, i) => (
                <span key={i} className={s.p1 > s.p2 ? 'text-white' : ''}>{s.p1}</span>
              ))}
            </div>
          </div>
        </button>

        {/* Divider / Info */}
        <div className="md:w-16 flex md:flex-col justify-center items-center gap-4 py-2">
          <div className="w-full md:w-[1px] h-[1px] md:h-full bg-white/10" />
          <div className="font-display text-xl text-white/30 tracking-widest transform md:-rotate-90">VS</div>
          <div className="w-full md:w-[1px] h-[1px] md:h-full bg-white/10" />
        </div>

        {/* Player 2 Card */}
        <button 
          onClick={scoreP2}
          className="flex-1 relative group rounded-3xl overflow-hidden glass-panel border-white/5 active:scale-[0.98] transition-transform"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
          <div className="relative h-full flex flex-col justify-center items-center p-6">
            <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
              <span className="text-xl md:text-3xl font-display tracking-wider text-white/90">{state.player2}</span>
              {state.currentGame.server === 2 && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-[var(--sport-accent)] glow-border"
                />
              )}
            </div>

            <div className="flex-1 flex items-center justify-center">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={p2Display}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="text-[12rem] md:text-[18rem] leading-none font-display tracking-tighter text-[var(--sport-accent)] glow-text"
                >
                  {p2Display}
                </motion.span>
              </AnimatePresence>
            </div>
            
            <div className="absolute bottom-6 flex gap-2 text-2xl font-display text-white/50">
              {state.sets.map((s, i) => (
                <span key={i} className={s.p2 > s.p1 ? 'text-white' : ''}>{s.p2}</span>
              ))}
            </div>
          </div>
        </button>

      </div>
    </div>
  );
}
