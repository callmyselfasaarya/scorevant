import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, FileText, Activity, Trophy, Database, Radio, Layout, Smartphone, Lock, Search } from 'lucide-react';
import { useLocation } from 'wouter';

const SECTIONS = [
  { id: 'overview', title: 'Overview', icon: FileText },
  { id: 'architecture', title: 'Match Engine Architecture', icon: Activity },
  { id: 'realtime', title: 'Realtime Synchronization', icon: Radio },
  { id: 'tournaments', title: 'Tournament Management', icon: Trophy },
  { id: 'persistence', title: 'Offline Persistence', icon: Database },
  { id: 'accessibility', title: 'Accessibility (A11y)', icon: Layout },
];

export default function Documentation() {
  const [, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSections = SECTIONS.filter(section => 
    section.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = SECTIONS.map(s => document.getElementById(s.id));
      const scrollPosition = window.scrollY + 200; // offset for header

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i];
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(SECTIONS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white/80 font-sans selection:bg-gold-primary/30">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] rounded-full bg-gold-primary/5 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[5%] w-[40%] h-[40%] rounded-full bg-white/5 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/5 px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setLocation('/')}>
          <div className="w-8 h-8 rounded-lg bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center">
            <span className="text-gold-primary font-black">S</span>
          </div>
          <span className="font-display tracking-widest text-sm uppercase hidden sm:block">Scorevant Docs</span>
        </div>
        <div className="relative max-w-md w-full hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input 
            type="text" 
            placeholder="Search documentation..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-gold-primary/50 transition-colors"
          />
        </div>
        <button 
          onClick={() => setLocation('/dashboard')}
          className="text-xs font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors"
        >
          Open App
        </button>
      </header>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row relative z-10 pt-8 pb-20 px-4 md:px-8 gap-10">
        
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 shrink-0 hidden md:block space-y-1 md:sticky md:top-24 h-max">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4 px-3">Contents</div>
          {filteredSections.map(section => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                  isActive ? 'bg-gold-primary/10 text-gold-primary font-bold' : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-gold-primary' : 'text-white/40'}`} />
                {section.title}
              </button>
            );
          })}
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0 glass-panel p-6 md:p-12 rounded-3xl border border-white/5 relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-24"
          >
            {/* Overview Section */}
            <div id="overview" className="scroll-mt-24 space-y-6">
              <h1 className="text-3xl md:text-4xl font-display uppercase tracking-widest text-white border-b border-white/10 pb-4">Scorevant Platform</h1>
              <p className="text-lg text-white/60 leading-relaxed">
                Scorevant is a professional-grade officiating assistant, tournament manager, and live scoring platform designed for racket sports. It provides a sleek, high-performance interface for tracking matches in Badminton, Tennis, Table Tennis, Squash, and Pickleball.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3 hover:bg-white/10 transition-colors">
                  <Smartphone className="w-6 h-6 text-gold-primary" />
                  <h3 className="font-display tracking-wider text-white">Mobile Optimized</h3>
                  <p className="text-sm text-white/50">Fully responsive UI that feels native on tablets, phones, and desktops. Perfect for courtside officiating.</p>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3 hover:bg-white/10 transition-colors">
                  <Lock className="w-6 h-6 text-gold-primary" />
                  <h3 className="font-display tracking-wider text-white">Secure & Reliable</h3>
                  <p className="text-sm text-white/50">Powered by enterprise-grade infrastructure with Supabase Auth and isolated tournament networks.</p>
                </div>
              </div>
            </div>

            {/* Architecture Section */}
            <div id="architecture" className="scroll-mt-24 space-y-6">
              <h1 className="text-3xl md:text-4xl font-display uppercase tracking-widest text-white border-b border-white/10 pb-4">Match Engine</h1>
              <p className="text-white/60 leading-relaxed">
                The core of Scorevant is its immutable, pure-function match engine (`lib/scoring.ts`) integrated via React's `useReducer`.
              </p>
              <ul className="space-y-4 text-white/70">
                <li className="flex gap-3">
                  <ChevronRight className="w-5 h-5 text-gold-primary shrink-0" />
                  <span><strong>Multi-Sport Logic:</strong> Handles complex states such as Tennis Deuce/Ad logic, Tiebreaks, and Rally Scoring caps (Badminton to 30, Table Tennis deuce by 2).</span>
                </li>
                <li className="flex gap-3">
                  <ChevronRight className="w-5 h-5 text-gold-primary shrink-0" />
                  <span><strong>State Machine:</strong> Utilizing `useReducer` guarantees 0 edge-case bugs and allows instant, reliable `O(1)` state rollbacks (Undo) without side-effects.</span>
                </li>
                <li className="flex gap-3">
                  <ChevronRight className="w-5 h-5 text-gold-primary shrink-0" />
                  <span><strong>Performance:</strong> Components only re-render precisely when match state updates, using Framer Motion layout IDs for 120fps transitions.</span>
                </li>
              </ul>
            </div>

            {/* Realtime Section */}
            <div id="realtime" className="scroll-mt-24 space-y-6">
              <h1 className="text-3xl md:text-4xl font-display uppercase tracking-widest text-white border-b border-white/10 pb-4">Realtime Synchronization</h1>
              <p className="text-white/60 leading-relaxed">
                Scorevant leverages Supabase Realtime Channels to push live updates across the globe with sub-second latency.
              </p>
              <div className="p-6 rounded-2xl bg-black/50 border border-white/10 font-mono text-sm text-white/60 overflow-x-auto shadow-inner">
                <code>
                  <span className="text-pink-400">const</span> channel = supabase.channel(`match:${'{'}activeMatchId{'}'}`);<br/><br/>
                  <span className="text-white/40">// Umpire broadcasts state change</span><br/>
                  channel.send({'{'}<br/>
                  &nbsp;&nbsp;type: <span className="text-green-400">'broadcast'</span>,<br/>
                  &nbsp;&nbsp;event: <span className="text-green-400">'match_update'</span>,<br/>
                  &nbsp;&nbsp;payload: state<br/>
                  {'}'});
                </code>
              </div>
              <p className="text-white/60 leading-relaxed mt-4">
                Spectators navigating to the `/spectate/:id` route automatically subscribe to this channel. The `Spectate.tsx` component receives the broadcast payload and updates its local React state, rendering the exact same live Scoreboard the umpire sees.
              </p>
            </div>

            {/* Tournaments Section */}
            <div id="tournaments" className="scroll-mt-24 space-y-6">
              <h1 className="text-3xl md:text-4xl font-display uppercase tracking-widest text-white border-b border-white/10 pb-4">Tournament Management</h1>
              <p className="text-white/60 leading-relaxed">
                Tournaments are powered by a robust NestJS backend and MongoDB, seamlessly queried on the frontend via React Query.
              </p>
              <div className="grid gap-4">
                <div className="p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors">
                  <h4 className="text-gold-primary font-bold mb-2">Bracket Generation</h4>
                  <p className="text-sm text-white/60">Automated bracket creation and seeding logic based on entrant lists. Handles byes and round tracking.</p>
                </div>
                <div className="p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors">
                  <h4 className="text-gold-primary font-bold mb-2">Deep Integration</h4>
                  <p className="text-sm text-white/60">Clicking on any live or pending match directly from the `TournamentDetails` view instantly launches the Scoreboard, pre-populating players and match metadata via secure session storage.</p>
                </div>
              </div>
            </div>

            {/* Persistence Section */}
            <div id="persistence" className="scroll-mt-24 space-y-6">
              <h1 className="text-3xl md:text-4xl font-display uppercase tracking-widest text-white border-b border-white/10 pb-4">Offline Persistence</h1>
              <p className="text-white/60 leading-relaxed">
                To guarantee no data loss during live events, Scorevant implements a resilient offline-first strategy for the active match state.
              </p>
              <ul className="space-y-4 text-white/70">
                <li className="flex gap-3">
                  <ChevronRight className="w-5 h-5 text-gold-primary shrink-0" />
                  <span><strong>State Hydration:</strong> Upon mounting, `useMatchState` automatically attempts to rehydrate from `localStorage` (`scorevant_active_match`), preventing accidental data loss if the browser tab is closed.</span>
                </li>
                <li className="flex gap-3">
                  <ChevronRight className="w-5 h-5 text-gold-primary shrink-0" />
                  <span><strong>Network Resilience:</strong> Because points are tracked locally and broadcast optimally, intermittent network failure on the umpire's device does not stop the match. State will sync immediately upon reconnection.</span>
                </li>
              </ul>
            </div>

            {/* Accessibility Section */}
            <div id="accessibility" className="scroll-mt-24 space-y-6">
              <h1 className="text-3xl md:text-4xl font-display uppercase tracking-widest text-white border-b border-white/10 pb-4">Accessibility First</h1>
              <p className="text-white/60 leading-relaxed">
                Scorevant's Liquid Gold UI is engineered to be as accessible as it is beautiful, natively responding to OS-level accessibility flags.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white/5 border-l-2 border-gold-primary rounded-r-xl hover:bg-white/10 transition-colors">
                  <h4 className="font-bold text-white mb-2">High Contrast Mode</h4>
                  <p className="text-sm text-white/60">Using `@media (prefers-contrast: more)`, glassmorphic layers and blurs are instantly disabled and replaced with high-contrast `#000` backgrounds and thick, solid white/gold borders for maximum legibility.</p>
                </div>
                <div className="p-6 bg-white/5 border-l-2 border-gold-primary rounded-r-xl hover:bg-white/10 transition-colors">
                  <h4 className="font-bold text-white mb-2">Reduced Motion</h4>
                  <p className="text-sm text-white/60">Framer Motion's `useReducedMotion()` hook disables all cinematic tweens, parallax backgrounds, and spring physics, instantly snapping UI elements to their final resting state.</p>
                </div>
                <div className="p-6 bg-white/5 border-l-2 border-gold-primary rounded-r-xl md:col-span-2 hover:bg-white/10 transition-colors">
                  <h4 className="font-bold text-white mb-2">Screen Reader Support</h4>
                  <p className="text-sm text-white/60">Live match scores are broadcast securely via invisible `aria-live="polite"` regions. Modals strictly enforce focus trapping and Escape key resolution per WAI-ARIA guidelines.</p>
                </div>
              </div>
            </div>
            
          </motion.div>
        </main>
      </div>
    </div>
  );
}