import { useAuth } from '../contexts/AuthContext';
import { FadeIn, StaggerContainer } from '../components/MotionWrappers';
import { Trophy, Plus, Activity, ChevronRight } from 'lucide-react';
import { useLocation } from 'wouter';

export default function Dashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Placeholder data for recent matches
  const recentMatches: any[] = [];

  const userName =
    user?.fullName || user?.email?.split('@')[0] || 'Official';

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#F4C542]/30 pt-24 px-6 md:px-12 pb-20">
      
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-[#F4C542]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-white/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <FadeIn className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">
              Welcome back, <span className="text-[#F4C542]">{userName}</span>.
            </h1>
            <p className="text-white/40 font-medium">
              Manage your tournaments, courts, and matches from your command center.
            </p>
          </div>
          <button
            onClick={() => setLocation('/tournaments')}
            className="group flex items-center gap-3 px-6 py-4 bg-[#F4C542] text-black rounded-xl font-black uppercase tracking-widest text-xs hover:bg-white transition-all shadow-[0_0_20px_rgba(244,197,66,0.2)] hover:shadow-[0_0_30px_rgba(244,197,66,0.4)]"
          >
            <Plus className="w-4 h-4" />
            Start New Match
            <ChevronRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
          </button>
        </FadeIn>

        {/* Quick Stats */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Active Tournaments', value: '0', icon: Trophy },
            { label: 'Live Matches', value: '0', icon: Activity },
            { label: 'Total Officiated', value: '0', icon: ChevronRight }
          ].map((stat, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="glass-panel-heavy p-6 rounded-2xl border border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</div>
                  <div className="text-3xl font-black">{stat.value}</div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-[#F4C542]" />
                </div>
              </div>
            </FadeIn>
          ))}
        </StaggerContainer>

        {/* Recent Matches */}
        <FadeIn delay={0.3} className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-lg font-black tracking-tight">Recent Matches</h2>
            <button 
              onClick={() => setLocation('/tournaments')}
              className="text-xs font-bold uppercase tracking-widest text-[#F4C542] hover:text-white transition-colors"
            >
              View All
            </button>
          </div>

          {recentMatches.length === 0 ? (
            <div className="glass-panel-heavy rounded-2xl border border-white/5 p-16 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
                <Trophy className="w-8 h-8 text-white/20" />
              </div>
              <h3 className="text-xl font-bold">No Matches Yet</h3>
              <p className="text-white/40 text-sm max-w-sm">
                You haven't officiated any matches. Start a new tournament or setup a quick match to begin recording scores.
              </p>
              <button 
                onClick={() => setLocation('/tournaments')}
                className="mt-4 px-6 py-3 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-colors"
              >
                Create Tournament
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Future matches map here */}
            </div>
          )}
        </FadeIn>
      </div>
      
      <style>{`
        .glass-panel-heavy {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
        }
      `}</style>
    </div>
  );
}
