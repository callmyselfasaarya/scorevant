import { useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useMatchState } from '../hooks/useMatchState';
import { useMatchHistory } from '../hooks/useMatchHistory';
import { getTennisScoreDisplay } from '../lib/scoring';
import { Button } from '@/components/ui/button';
import { RotateCcw, Trophy, Home as HomeIcon, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

const scorevantHorizontal = '/logo-horizontal.png';

export default function Scoreboard() {
  const [, setLocation] = useLocation();
  const { state, startMatch, scoreP1, scoreP2, undo } = useMatchState();
  const { saveMatch } = useMatchHistory();

  // Parallax movement
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX / innerWidth - 0.5) * 40);
      mouseY.set((clientY / innerHeight - 0.5) * 40);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

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
    setLocation('/setup');
  };

  if (state.status === 'setup') return null;

  const isTennis = state.sport === 'tennis';
  let p1Display = state.currentGame.p1Points.toString();
  let p2Display = state.currentGame.p2Points.toString();

  if (isTennis && state.p1Sets !== 6 && state.p2Sets !== 6) { 
    [p1Display, p2Display] = getTennisScoreDisplay(state.currentGame.p1Points, state.currentGame.p2Points);
  }

  const activeColor = '#F4C542';

  if (state.status === 'finished') {
    const winnerName = state.winner === 1 ? state.player1 : state.player2;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[#F4C542]/5 blur-[120px] -z-10" />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-panel-heavy p-12 rounded-[3rem] text-center space-y-10 max-w-md w-full border border-white/10"
        >
          <div className="relative inline-block">
            <Trophy className="w-32 h-32 mx-auto text-[#F4C542] drop-shadow-[0_0_30px_rgba(244,197,66,0.4)]" />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-2 border-dashed border-[#F4C542]/20 rounded-full scale-125"
            />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-sm font-black uppercase tracking-[0.5em] text-white/30">Match Champion</h2>
            <p className="text-6xl font-black tracking-tighter text-[#F4C542]">{winnerName}</p>
          </div>
          
          <div className="flex justify-center gap-6 text-3xl font-black tracking-tighter">
            {state.sets.map((set, i) => (
              <div key={i} className="flex flex-col items-center bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                <span className={state.winner === 1 ? 'text-[#F4C542]' : 'text-white/40'}>{set.p1}</span>
                <span className="w-4 h-[2px] bg-white/10 my-1" />
                <span className={state.winner === 2 ? 'text-[#F4C542]' : 'text-white/40'}>{set.p2}</span>
              </div>
            ))}
          </div>

          <Button 
            onClick={handleFinish}
            className="w-full h-16 text-xs font-black uppercase tracking-[0.3em] bg-[#F4C542] text-black hover:bg-white rounded-2xl transition-all shadow-2xl"
          >
            Finalize & Return
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col bg-black text-white overflow-hidden font-sans">
      
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div style={{ x: springX, y: springY }} className="absolute inset-0">
          <div className="absolute top-[20%] left-[10%] w-[40%] h-[40%] rounded-full bg-[#F4C542]/5 blur-[120px]" />
          <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-white/5 blur-[120px]" />
        </motion.div>
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full flex-1 flex flex-col p-4 md:p-10">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <Link href="/setup">
            <button className="w-12 h-12 rounded-2xl glass-panel flex items-center justify-center hover:bg-white/10 transition-all border border-white/5">
              <ChevronLeft className="w-5 h-5 text-white/50" />
            </button>
          </Link>
          
          <div className="flex flex-col items-center gap-2">
            <img
              src={scorevantHorizontal}
              alt="Scorevant"
              className="h-10 w-auto object-contain mix-blend-screen"
              style={{ 
                filter: 'drop-shadow(0 0 10px rgba(244,197,66,0.3)) contrast(1.1) brightness(1.1)',
                WebkitMaskImage: 'radial-gradient(circle, black 80%, transparent 100%)',
                maskImage: 'radial-gradient(circle, black 80%, transparent 100%)'
              }}
            />
            <div className="px-4 py-1 rounded-full bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-[0.3em] text-[#F4C542]">
              {state.sport.replace('-', ' ')} • Best of {state.format.bestOf}
            </div>
          </div>

          <button 
            onClick={undo} 
            disabled={state.history.length === 0}
            className="w-12 h-12 rounded-2xl glass-panel flex items-center justify-center hover:bg-white/10 transition-all border border-white/5 disabled:opacity-20"
          >
            <RotateCcw className="w-5 h-5 text-white/50" />
          </button>
        </header>

        {/* Score Area */}
        <div className="flex-1 flex flex-col md:flex-row gap-6 md:gap-10">
          {/* Player 1 Card */}
          <button 
            onClick={scoreP1}
            className="flex-1 relative group rounded-[2.5rem] overflow-hidden glass-panel-heavy border-white/5 active:scale-[0.98] transition-all shadow-2xl p-2"
          >
            <div className="relative h-full flex flex-col justify-between items-center p-8 bg-gradient-to-b from-white/[0.02] to-transparent rounded-[2rem]">
              <div className="w-full flex justify-between items-center">
                <div className="space-y-1 text-left">
                  <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Player One</div>
                  <div className="text-xl md:text-3xl font-black tracking-tighter text-white/90">{state.player1}</div>
                </div>
                {state.currentGame.server === 1 && (
                  <motion.div 
                    layoutId="server"
                    className="w-4 h-4 rounded-full bg-[#F4C542] shadow-[0_0_15px_#F4C542] border-2 border-black"
                  />
                )}
              </div>

              <div className="flex-1 flex items-center justify-center">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={p1Display}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -30, opacity: 0 }}
                    className="text-[14rem] md:text-[20rem] leading-none font-black tracking-tighter text-[#F4C542] drop-shadow-[0_0_40px_rgba(244,197,66,0.25)]"
                  >
                    {p1Display}
                  </motion.span>
                </AnimatePresence>
              </div>
              
              <div className="flex gap-3">
                {state.sets.map((s, i) => (
                  <div key={i} className={`w-12 h-2 rounded-full transition-all duration-500 ${s.p1 > s.p2 ? 'bg-[#F4C542]' : 'bg-white/10'}`} />
                ))}
              </div>
            </div>
          </button>

          {/* Versus Divider */}
          <div className="hidden md:flex flex-col justify-center items-center gap-6 opacity-20">
            <div className="w-[2px] h-full bg-gradient-to-b from-transparent via-white to-transparent" />
            <div className="text-sm font-black tracking-[1em] rotate-90 py-4">VS</div>
            <div className="w-[2px] h-full bg-gradient-to-b from-transparent via-white to-transparent" />
          </div>

          {/* Player 2 Card */}
          <button 
            onClick={scoreP2}
            className="flex-1 relative group rounded-[2.5rem] overflow-hidden glass-panel-heavy border-white/5 active:scale-[0.98] transition-all shadow-2xl p-2"
          >
            <div className="relative h-full flex flex-col justify-between items-center p-8 bg-gradient-to-b from-white/[0.02] to-transparent rounded-[2rem]">
              <div className="w-full flex justify-between items-center">
                <div className="space-y-1 text-left">
                  <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Player Two</div>
                  <div className="text-xl md:text-3xl font-black tracking-tighter text-white/90">{state.player2}</div>
                </div>
                {state.currentGame.server === 2 && (
                  <motion.div 
                    layoutId="server"
                    className="w-4 h-4 rounded-full bg-[#F4C542] shadow-[0_0_15px_#F4C542] border-2 border-black"
                  />
                )}
              </div>

              <div className="flex-1 flex items-center justify-center">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={p2Display}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -30, opacity: 0 }}
                    className="text-[14rem] md:text-[20rem] leading-none font-black tracking-tighter text-white/90"
                  >
                    {p2Display}
                  </motion.span>
                </AnimatePresence>
              </div>
              
              <div className="flex gap-3">
                {state.sets.map((s, i) => (
                  <div key={i} className={`w-12 h-2 rounded-full transition-all duration-500 ${s.p2 > s.p1 ? 'bg-[#F4C542]' : 'bg-white/10'}`} />
                ))}
              </div>
            </div>
          </button>
        </div>

        {/* Match Info Footer */}
        <footer className="mt-8 flex justify-center">
          <div className="px-6 py-3 glass-panel rounded-2xl border border-white/5 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#F4C542] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">In Progress</span>
            </div>
            <div className="w-[1px] h-4 bg-white/10" />
            <div className="text-[10px] font-black uppercase tracking-widest text-white/60">
              Scorevant Official Hub
            </div>
            {state.matchId && (
              <>
                <div className="w-[1px] h-4 bg-white/10" />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/spectate/${state.matchId}`);
                    alert("Spectator link copied to clipboard!");
                  }}
                  className="text-[10px] font-black uppercase tracking-widest text-[#F4C542] hover:text-white transition-colors"
                >
                  Copy Live Link
                </button>
              </>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
