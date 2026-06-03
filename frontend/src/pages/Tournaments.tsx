import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, Tournament } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Plus, Trophy, Activity, ArrowRight, Loader2 } from "lucide-react";
import { PageTransition, StaggerContainer, FadeIn } from "@/components/MotionWrappers";
import { motion } from "framer-motion";

export default function Tournaments() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [sportType, setSportType] = useState("Tennis");
  const [entrantsText, setEntrantsText] = useState("");

  const { data: tournaments, isLoading } = useQuery<Tournament[]>({
    queryKey: ["tournaments"],
    queryFn: api.tournaments.list,
  });

  const createMutation = useMutation({
    mutationFn: api.tournaments.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      setName("");
      setEntrantsText("");
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const entrantsList = entrantsText
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map((name, index) => ({ name, seed: index + 1 }));

    createMutation.mutate({
      name,
      sportType,
      maxSets: sportType === "Badminton" ? 3 : sportType === "Tennis" ? 3 : 5, // Example default
      entrants: entrantsList,
    });
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-black text-white selection:bg-[#F4C542]/30 p-6 md:p-12 relative overflow-hidden">
        
        {/* Background Layers */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-[#F4C542]/5 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-white/5 blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <FadeIn direction="down" duration={0.6}>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <h1 className="text-5xl md:text-6xl font-display font-bold uppercase tracking-tight text-white mb-2">
                  Tournaments
                </h1>
                <p className="text-white/60 text-sm md:text-base max-w-xl font-medium">
                  Manage your active brackets, track ongoing matches, and create new competitive events with precision.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[#F4C542] bg-[#F4C542]/10 px-4 py-2 rounded-full border border-[#F4C542]/20">
                <Trophy className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">{tournaments?.length || 0} Active</span>
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            
            {/* Create Tournament Form */}
            <div className="lg:col-span-1">
              <FadeIn direction="left" delay={0.2}>
                <div className="glass-panel-heavy rounded-3xl p-6 md:p-8 relative overflow-hidden">
                  {/* Decorative corner glow */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#F4C542]/20 rounded-full blur-[40px]" />
                  
                  <div className="mb-6 relative z-10">
                    <h2 className="text-2xl font-bold mb-2">New Event</h2>
                    <p className="text-white/50 text-xs uppercase tracking-wider font-bold">Generate a Bracket</p>
                  </div>
                  
                  <form onSubmit={handleCreate} className="space-y-5 relative z-10">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 ml-1">Event Name</label>
                      <input 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        placeholder="e.g. Summer Open 2026" 
                        required 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F4C542]/50 focus:bg-white/10 transition-all placeholder:text-white/20"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 ml-1">Sport Type</label>
                      <select 
                        value={sportType} 
                        onChange={e => setSportType(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F4C542]/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                      >
                        <option value="Badminton" className="bg-zinc-900">Badminton</option>
                        <option value="Tennis" className="bg-zinc-900">Tennis</option>
                        <option value="Table Tennis" className="bg-zinc-900">Table Tennis</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 ml-1 flex justify-between">
                        <span>Entrants</span>
                        <span className="text-[#F4C542]">{entrantsText.split("\n").filter(l => l.trim()).length} players</span>
                      </label>
                      <textarea 
                        value={entrantsText}
                        onChange={e => setEntrantsText(e.target.value)}
                        placeholder="Player 1&#10;Player 2&#10;Player 3"
                        required
                        className="w-full min-h-[140px] bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F4C542]/50 focus:bg-white/10 transition-all resize-y placeholder:text-white/20 font-mono"
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={createMutation.isPending} 
                      className="w-full flex items-center justify-center gap-2 mt-4 px-6 py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] bg-[#F4C542] text-black hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(244,197,66,0.2)] hover:shadow-[0_0_30px_rgba(244,197,66,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {createMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Create Bracket
                          <Plus className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </FadeIn>
            </div>

            {/* Tournaments List */}
            <div className="lg:col-span-2">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-white/50 space-y-4">
                  <Loader2 className="w-8 h-8 animate-spin text-[#F4C542]" />
                  <p className="text-xs uppercase tracking-[0.2em] font-bold">Loading Data...</p>
                </div>
              ) : tournaments?.length === 0 ? (
                <FadeIn delay={0.3} className="h-full">
                  <div className="liquid-glass rounded-3xl p-12 h-full flex flex-col items-center justify-center text-center space-y-6 border-dashed border-white/20">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                      <Trophy className="w-10 h-10 text-white/20" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">No Tournaments Yet</h3>
                      <p className="text-white/50 max-w-sm mx-auto">
                        Create your first tournament using the panel on the left to start organizing matches and tracking scores.
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ) : (
                <StaggerContainer delay={0.3} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {tournaments?.map((tournament) => (
                    <motion.div
                      key={tournament._id}
                      whileHover={{ scale: 1.02, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setLocation(`/tournaments/${tournament._id}`)}
                      className="group cursor-pointer"
                    >
                      <div className="liquid-glass rounded-2xl p-6 h-full border border-white/10 group-hover:border-[#F4C542]/50 transition-colors relative overflow-hidden">
                        {/* Hover Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#F4C542]/0 to-[#F4C542]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="flex justify-between items-start mb-6 relative z-10">
                          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-[#F4C542]/10 group-hover:border-[#F4C542]/30 transition-colors">
                            {tournament.sportType === 'Tennis' ? (
                              <Activity className="w-5 h-5 text-white/70 group-hover:text-[#F4C542] transition-colors" />
                            ) : (
                              <Trophy className="w-5 h-5 text-white/70 group-hover:text-[#F4C542] transition-colors" />
                            )}
                          </div>
                          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                            tournament.status === 'Upcoming' ? 'bg-white/10 text-white' :
                            tournament.status === 'Live' ? 'bg-[#F4C542]/20 text-[#F4C542] border border-[#F4C542]/30' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {tournament.status}
                          </span>
                        </div>
                        
                        <div className="relative z-10 space-y-1">
                          <h3 className="text-xl font-bold text-white group-hover:text-[#F4C542] transition-colors line-clamp-1">
                            {tournament.name}
                          </h3>
                          <div className="flex items-center gap-2 text-white/50 text-sm font-medium">
                            <span>{tournament.sportType}</span>
                            <span>•</span>
                            <span>Best of {tournament.maxSets}</span>
                          </div>
                        </div>

                        <div className="absolute bottom-6 right-6 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                          <div className="w-8 h-8 rounded-full bg-[#F4C542] flex items-center justify-center">
                            <ArrowRight className="w-4 h-4 text-black" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </StaggerContainer>
              )}
            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
}
