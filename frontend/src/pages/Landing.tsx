import { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Menu, X, ChevronRight, Play, Trophy, Activity, Target, Zap, Clock, Github, Home, User, LogOut, ChevronDown } from 'lucide-react';
import { FadeIn, MagneticButton, StaggerContainer } from '../components/MotionWrappers';
import { useAuth } from '../contexts/AuthContext';

const scorevantHorizontal = '/logo-horizontal.png';
const scorevantBadge = '/brand/logo-badge.png';
const scorevantMark = '/brand/logomark.png';

const NAV_LINKS = [
  { name: 'Home', href: '#home', icon: Home },
  { name: 'Features', href: '#features', icon: Zap },
  { name: 'Sports', href: '#sports', icon: Target },
  { name: 'History', href: '#history', icon: Clock },
  { name: 'Tournaments', href: '/tournaments', icon: Trophy },
  { name: 'Courts', href: '/courts', icon: Activity },
];

const GITHUB_URL = 'https://github.com/callmyselfasaarya/scorevant';

const SCORE_TICKS = [
  { p1: 15, p2: 18, set: 2, status: 'Rally' },
  { p1: 15, p2: 19, set: 2, status: 'Point P2' },
  { p1: 16, p2: 19, set: 2, status: 'Service Over' },
  { p1: 17, p2: 19, set: 2, status: 'Rally' },
  { p1: 17, p2: 20, set: 2, status: 'Game Point' },
  { p1: 18, p2: 20, set: 2, status: 'Rally' },
];

export default function Landing() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scoreIdx, setScoreIdx] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href.startsWith('#')) {
      const id = href.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      setLocation(href);
    }
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parallax movement
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX / innerWidth - 0.5) * 50);
      mouseY.set((clientY / innerHeight - 0.5) * 50);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const id = setInterval(() => {
      setScoreIdx(i => (i + 1) % SCORE_TICKS.length);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const score = SCORE_TICKS[scoreIdx];

  return (
    <div id="home" className="relative min-h-screen w-full overflow-hidden bg-black text-white font-sans selection:bg-[#F4C542]/30">
      
      {/* === BACKGROUND LAYERS === */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Animated Gradient Orbs */}
        <motion.div 
          style={{ x: springX, y: springY }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#F4C542]/10 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-white/5 blur-[120px]" />
          <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-[#F4C542]/5 blur-[100px]" />
        </motion.div>

        {/* Mesh Grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        {/* Cinematic Scanlines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,255,255,0.02),rgba(244,197,66,0.02),rgba(255,255,255,0.02))] bg-[length:100%_4px,3px_100%] pointer-events-none z-10 opacity-20" />
        
        {/* Large Background Logomark */}
        <motion.div 
          style={{ x: useTransform(springX, (v) => v * -0.5), y: useTransform(springY, (v) => v * -0.5) }}
          className="absolute -right-24 top-1/4 opacity-[0.04] scale-150 pointer-events-none"
        >
          <img 
            src={scorevantMark} 
            alt="" 
            className="w-[800px] h-auto grayscale mix-blend-screen" 
            style={{
              WebkitMaskImage: 'radial-gradient(circle, black 60%, transparent 100%)',
              maskImage: 'radial-gradient(circle, black 60%, transparent 100%)'
            }}
          />
        </motion.div>
      </div>

      {/* === NAVBAR === */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'py-3' : 'py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className={`rounded-full px-6 py-3 flex justify-between items-center border border-white/5 backdrop-blur-xl transition-all duration-500 ${isScrolled ? 'bg-black/60 shadow-2xl' : 'bg-black/40'}`}>
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <img
                src={scorevantHorizontal}
                alt="Scorevant"
                className="h-9 w-auto object-contain mix-blend-screen"
              />
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="group relative flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/50 hover:text-[#F4C542] transition-all duration-300 py-1"
                >
                  <link.icon className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:text-[#F4C542] transition-all" />
                  {link.name}
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#F4C542] origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </a>
              ))}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-5">
              <a 
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full border border-white/10 hover:border-[#F4C542]/50 hover:bg-[#F4C542]/5 transition-all text-white/40 hover:text-[#F4C542]"
              >
                <Github className="w-5 h-5" />
              </a>
              
              <div className="hidden sm:flex gap-3 relative">
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="group flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 hover:border-white/30 bg-black/40 hover:bg-white/5 transition-all duration-300"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#F4C542]/20 flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-[#F4C542]" />
                      </div>
                      <span className="text-xs font-bold text-white/80 group-hover:text-white transition-colors">
                        {user?.fullName?.split(' ')[0] || user?.email?.split('@')[0] || 'Official'}
                      </span>
                      <ChevronDown className={`w-3 h-3 text-white/40 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-3 w-48 rounded-2xl border border-white/10 bg-black/80 backdrop-blur-3xl shadow-2xl overflow-hidden"
                        >
                          <div className="p-2 space-y-1">
                            <button
                              onClick={() => { setLocation('/dashboard'); setUserMenuOpen(false); }}
                              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-white/70 hover:text-[#F4C542] hover:bg-white/5 transition-all"
                            >
                              <Activity className="w-4 h-4" />
                              Dashboard
                            </button>
                            <button
                              onClick={() => { setShowLogoutModal(true); setUserMenuOpen(false); }}
                              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-red-400/70 hover:text-red-400 hover:bg-red-400/10 transition-all"
                            >
                              <LogOut className="w-4 h-4" />
                              Log Out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setLocation('/register')}
                      className="px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-[#F4C542] text-black hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(244,197,66,0.2)] hover:shadow-[0_0_30px_rgba(244,197,66,0.4)]"
                    >
                      Get Started
                    </button>
                  </div>
                )}
              </div>
              <button
                className="lg:hidden text-white/70 hover:text-white"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-black/95 backdrop-blur-2xl border-b border-white/5 overflow-hidden"
            >
              <div className="flex flex-col gap-4 p-8 items-center">
                {NAV_LINKS.map((link) => (
                  <a 
                    key={link.name} 
                    href={link.href} 
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-lg font-bold uppercase tracking-widest text-white/70 hover:text-[#F4C542]"
                  >
                    {link.name}
                  </a>
                ))}
                <button
                  onClick={() => setLocation(user ? '/tournaments' : '/login')}
                  className="mt-4 w-full py-4 rounded-xl bg-[#F4C542] text-black font-black uppercase tracking-tighter"
                >
                  Start Match
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* === HERO CONTENT === */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-32 lg:pt-40 pb-20 min-h-screen flex flex-col lg:flex-row items-center gap-20 lg:gap-16">
        
        {/* Left Side: Text */}
        <div className="flex-1 text-center lg:text-left space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="liquid-glass px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase text-[#F4C542] mb-8 inline-flex items-center gap-3 bg-[#F4C542]/10 border border-[#F4C542]/20"
          >
            <img 
              src={scorevantBadge} 
              alt="" 
              className="h-6 w-auto brightness-125 mix-blend-screen drop-shadow-[0_0_8px_rgba(244,197,66,0.6)]" 
              style={{
                WebkitMaskImage: 'radial-gradient(circle, black 70%, transparent 100%)',
                maskImage: 'radial-gradient(circle, black 70%, transparent 100%)'
              }}
            />
            Live Scorekeeping for Racket Sports
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl xl:text-8xl font-black leading-[0.9] tracking-tighter"
          >
            Real-Time <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F4C542] to-white">Scoring.</span> <br />
            Zero Errors. <br />
            Total <span className="italic font-light opacity-90">Control.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/50 text-base md:text-lg max-w-xl leading-relaxed font-medium"
          >
            Scorevant is a professional officiating assistant built for racket sports — 
            delivering precision scoring, live updates, and a premium match experience.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-5 pt-4"
          >
            <MagneticButton>
              <button
                onClick={() => setLocation(user ? '/tournaments' : '/login')}
                className="group relative px-10 py-5 rounded-2xl bg-[#F4C542] text-black font-black uppercase tracking-widest text-sm hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(244,197,66,0.3)] hover:shadow-[0_0_50px_rgba(244,197,66,0.6)] flex items-center gap-3"
              >
                Start a Match
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </MagneticButton>
          </motion.div>

          {/* Stats / Trust */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex items-center justify-center lg:justify-start gap-12 pt-12 border-t border-white/5"
          >
            <div>
              <div className="text-2xl font-black text-white">60FPS</div>
              <div className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Real-time Data</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">0.02s</div>
              <div className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Latency</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">100%</div>
              <div className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Precision</div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Live Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 50 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 w-full max-w-xl"
        >
          <div className="relative group">
            {/* Background Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#F4C542] to-white rounded-[2.5rem] blur opacity-10 group-hover:opacity-30 transition duration-1000" />
            
            <div className="relative glass-panel-heavy rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl backdrop-blur-3xl bg-black/60">
              {/* Card Header */}
              <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#F4C542] animate-pulse shadow-[0_0_10px_#F4C542]" />
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#F4C542]">Live Scoring</span>
                </div>
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full border border-white/5">
                  Badminton • Final
                </div>
              </div>

              {/* Main Score Area */}
              <div className="p-8 space-y-12">
                {/* Status Badge */}
                <div className="flex justify-center">
                  <motion.div 
                    key={score.status}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-4 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-white/60"
                  >
                    {score.status}
                  </motion.div>
                </div>

                <div className="flex justify-between items-center gap-8">
                  {/* Player 1 */}
                  <div className="flex-1 flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center relative overflow-hidden">
                      <img src={scorevantMark} alt="" className="w-10 h-10 opacity-40 grayscale mix-blend-screen" />
                      {/* Server Indicator */}
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F4C542] border-2 border-black shadow-[0_0_10px_#F4C542]" />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-black uppercase tracking-tighter">Sam</div>
                      <div className="text-[10px] text-white/30 uppercase font-bold"></div>
                    </div>
                  </div>

                  {/* Score Numbers */}
                  <div className="flex items-center gap-4">
                    <AnimatePresence mode="popLayout">
                      <motion.div
                        key={`p1-${score.p1}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-7xl md:text-8xl font-black tracking-tighter text-[#F4C542] drop-shadow-[0_0_30px_rgba(244,197,66,0.3)]"
                      >
                        {score.p1}
                      </motion.div>
                    </AnimatePresence>
                    <div className="w-[2px] h-12 bg-white/10 rotate-12" />
                    <AnimatePresence mode="popLayout">
                      <motion.div
                        key={`p2-${score.p2}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-7xl md:text-8xl font-black tracking-tighter text-white/90"
                      >
                        {score.p2}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Player 2 */}
                  <div className="flex-1 flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center overflow-hidden">
                      <img src={scorevantMark} alt="" className="w-10 h-10 opacity-20 grayscale mix-blend-screen" />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-black uppercase tracking-tighter">Arsath</div>
                      <div className="text-[10px] text-white/30 uppercase font-bold"></div>
                    </div>
                  </div>
                </div>

                {/* Set Tracking */}
                <div className="flex justify-center items-center gap-6 pt-6 border-t border-white/5">
                  <div className="flex gap-2">
                    {[1, 2, 3].map(i => (
                      <div 
                        key={i} 
                        className={`w-10 h-1.5 rounded-full transition-all duration-500 ${
                          i === 1 ? 'bg-[#F4C542]' : i === 2 ? 'bg-white/40 animate-pulse' : 'bg-white/10'
                        }`} 
                      />
                    ))}
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-white/30">
                    Set {score.set}
                  </div>
                </div>
              </div>

              {/* Data Feed */}
              <div className="bg-black/40 px-8 py-4 flex justify-between items-center text-[9px] font-bold tracking-widest text-white/30 uppercase">
                <div className="flex items-center gap-2">
                  <Activity className="w-3 h-3 text-[#F4C542]" />
                  Processing Match Logic...
                </div>
                <div>Server: 10.0.4.2</div>
              </div>
            </div>

            {/* Floating Accents */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-6 -right-6 w-16 h-16 glass-panel rounded-2xl border border-white/10 flex items-center justify-center shadow-2xl"
            >
              <Target className="w-6 h-6 text-[#F4C542]" />
            </motion.div>
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -bottom-10 -left-10 w-24 h-24 glass-panel rounded-3xl border border-white/10 flex flex-col items-center justify-center shadow-2xl p-4 gap-2"
            >
              <Trophy className="w-8 h-8 text-white/50" />
              <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Leaderboard</span>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* === SCROLL INDICATOR === */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-[#F4C542] to-transparent" />
        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Scroll to Explore</span>
      </motion.div>

      {/* === FEATURES SECTION === */}
      <section id="features" className="relative z-10 py-32 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-20">
            <h2 className="text-sm font-black uppercase tracking-[0.5em] text-[#F4C542] mb-4">Core Capabilities</h2>
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter">Precision Built for <br /> Competitive <span className="text-white/40">Athletics.</span></h3>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Zero Latency', desc: 'Real-time synchronization ensures every point is reflected instantly across all connected devices.', icon: Activity },
              { title: 'Smart Officiating', desc: 'Automated set tracking, side changes, and service rotation logic tailored for professional play.', icon: Target },
              { title: 'Match Analytics', desc: 'Deep insights into rally lengths, point distributions, and momentum shifts throughout the match.', icon: Zap },
              { title: 'Broadcast Ready', desc: 'Clean, high-contrast UI designed for easy capture and live streaming integration.', icon: Play },
              { title: 'History Archives', desc: 'Comprehensive match storage with detailed breakdowns of every set and game point.', icon: Trophy },
              { title: 'Global Standards', desc: 'Strict adherence to international tournament rules for Badminton, Tennis, and Table Tennis.', icon: Target }
            ].map((f, i) => (
              <FadeIn key={i} delay={i * 0.1} className="group p-10 rounded-[2.5rem] glass-panel-heavy border-white/5 hover:border-[#F4C542]/20 transition-all duration-500">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:bg-[#F4C542]/10 transition-all">
                  <f.icon className="w-7 h-7 text-[#F4C542]" />
                </div>
                <h4 className="text-xl font-black tracking-tight mb-4">{f.title}</h4>
                <p className="text-white/40 text-sm leading-relaxed font-medium">{f.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* === SPORTS SECTION === */}
      <section id="sports" className="relative z-10 py-32 px-6 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
            <FadeIn className="max-w-2xl">
              <h2 className="text-sm font-black uppercase tracking-[0.5em] text-[#F4C542] mb-4">Supported Disciplines</h2>
              <h3 className="text-4xl md:text-6xl font-black tracking-tighter">Master Every <br /> <span className="text-white/40">Racket Sport.</span></h3>
            </FadeIn>
            <FadeIn direction="left">
              <button onClick={() => setLocation(user ? '/tournaments' : '/login')} className="px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:border-[#F4C542] text-xs font-black uppercase tracking-widest transition-all">
                Configure Your Game
              </button>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Tennis', players: 'Singles / Doubles', rules: 'ITF Pro Standards', color: '#F4C542', img: '🎾' },
              { name: 'Badminton', players: 'Singles / Doubles', rules: 'BWF Official Scoring', color: '#F4C542', img: '🏸' },
              { name: 'Table Tennis', players: '11-Point Formats', rules: 'ITTF Regulations', color: '#F4C542', img: '🏓' }
            ].map((s, i) => (
              <FadeIn key={i} delay={i * 0.15} direction="up" className="relative h-[450px] rounded-[3rem] overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
                <div className="absolute inset-0 bg-white/5 group-hover:bg-[#F4C542]/5 transition-all duration-700" />
                
                <div className="absolute inset-0 flex items-center justify-center text-9xl opacity-20 grayscale group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-40 transition-all duration-1000">
                  {s.img}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-10 z-20 space-y-4">
                  <div className="text-xs font-black uppercase tracking-[0.3em] text-[#F4C542]">{s.rules}</div>
                  <h4 className="text-4xl font-black tracking-tighter">{s.name}</h4>
                  <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-white/40">
                    <Activity className="w-3 h-3" /> {s.players}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* === HISTORY SECTION === */}
      <section id="history" className="relative z-10 py-32 px-6 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
            <FadeIn className="max-w-2xl">
              <h2 className="text-sm font-black uppercase tracking-[0.5em] text-[#F4C542] mb-4">Match History</h2>
              <h3 className="text-4xl md:text-6xl font-black tracking-tighter">
                Replay Every <br /> <span className="text-white/40">Point & Decision.</span>
              </h3>
              <p className="mt-6 text-white/45 text-sm md:text-base leading-relaxed font-medium">
                Review completed matches, audit set-by-set progress, and recover from mistakes with a clean undo trail.
                Built for officials who need confidence after the rally ends.
              </p>
            </FadeIn>
            <FadeIn direction="left">
              <button
                onClick={() => setLocation(user ? '/tournaments' : '/login')}
                className="px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:border-[#F4C542] text-xs font-black uppercase tracking-widest transition-all"
              >
                Start Recording
              </button>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Point Timeline',
                desc: 'A chronological feed of points, rallies, and key events so you can reconstruct what happened instantly.',
                icon: Clock,
              },
              {
                title: 'Undo / Redo Trail',
                desc: 'Correct scoring errors confidently with a robust history stack that preserves intent and context.',
                icon: Activity,
              },
              {
                title: 'Set-by-Set Breakdown',
                desc: 'Jump to any set and verify service, side changes, and win conditions without manual math.',
                icon: Trophy,
              },
              {
                title: 'Shareable Summaries',
                desc: 'Generate clean match recaps ready for coaches, players, or livestream overlays.',
                icon: ChevronRight,
              },
              {
                title: 'Fast Search',
                desc: 'Find matches by sport, player, or date and get to the exact moment you need in seconds.',
                icon: Target,
              },
              {
                title: 'Audit-Ready',
                desc: 'Clear visibility into scoring logic and state transitions for transparent officiating.',
                icon: Zap,
              },
            ].map((h, i) => (
              <FadeIn
                key={h.title}
                delay={i * 0.1}
                className="group p-10 rounded-[2.5rem] glass-panel-heavy border border-white/5 hover:border-[#F4C542]/20 transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:bg-[#F4C542]/10 transition-all">
                  <h.icon className="w-7 h-7 text-[#F4C542]" />
                </div>
                <h4 className="text-xl font-black tracking-tight mb-4">{h.title}</h4>
                <p className="text-white/40 text-sm leading-relaxed font-medium">{h.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="relative z-10 py-20 px-6 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col items-center md:items-start gap-6">
            <img 
              src={scorevantHorizontal} 
              alt="Scorevant" 
              className="h-8 w-auto mix-blend-screen opacity-50 grayscale hover:grayscale-0 transition-all" 
              style={{ filter: 'contrast(1.1) brightness(1.1)' }}
            />
            <p className="text-white/20 text-xs font-medium tracking-wide">© 2026 Scorevant. Official Scoring Technology.</p>
          </div>
          
          <div className="flex gap-12">
            <div className="space-y-4">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F4C542]">Resources</div>
              <div className="flex flex-col gap-2">
                <button onClick={() => setLocation('/docs')} className="text-xs text-left text-white/30 hover:text-white transition-colors">Documentation</button>
                <a href="#" className="text-xs text-white/30 hover:text-white transition-colors">API Reference</a>
                <a href="#" className="text-xs text-white/30 hover:text-white transition-colors">Support</a>
              </div>
            </div>
            <div className="space-y-4">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F4C542]">Connect</div>
              <div className="flex flex-col gap-2">
                <a href="#" className="text-xs text-white/30 hover:text-white transition-colors">Twitter</a>
                <a href={GITHUB_URL} className="text-xs text-white/30 hover:text-white transition-colors">GitHub</a>
                <a href="#" className="text-xs text-white/30 hover:text-white transition-colors">LinkedIn</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="w-full max-w-sm overflow-hidden border rounded-3xl border-white/10 bg-zinc-900 shadow-2xl"
            >
              <div className="p-6 text-center space-y-6">
                <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                  <LogOut className="w-6 h-6 text-red-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Log Out</h3>
                  <p className="text-sm text-white/60">
                    Are you sure you want to log out of your account?
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="flex-1 px-4 py-3 text-xs font-bold uppercase tracking-widest text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setShowLogoutModal(false);
                    }}
                    className="flex-1 px-4 py-3 text-xs font-bold uppercase tracking-widest text-white bg-red-500/80 hover:bg-red-500 rounded-xl transition-all"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glassmorphism Styles */}
      <style>{`
        .glass-panel-heavy {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
        }
        .liquid-glass {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>

    </div>
  );
}
