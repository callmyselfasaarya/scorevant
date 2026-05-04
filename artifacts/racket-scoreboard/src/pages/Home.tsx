import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Sport } from '../types/match';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MoveRight } from 'lucide-react';
import { MatchHistoryPanel } from '../components/MatchHistoryPanel';
const scorevantFull = '/logo-full.png';
const scorevantHorizontal = '/logo-horizontal.png';

const SPORTS: { id: Sport; name: string; color: string }[] = [
  { id: 'tennis', name: 'Tennis', color: '#c8ff00' },
  { id: 'badminton', name: 'Badminton', color: '#00e5ff' },
  { id: 'squash', name: 'Squash', color: '#ff6b35' },
  { id: 'pickleball', name: 'Pickleball', color: '#ffe135' },
  { id: 'table-tennis', name: 'Table Tennis', color: '#ff2d78' }
];

export default function Home() {
  const [, setLocation] = useLocation();
  const [sport, setSport] = useState<Sport>('tennis');
  const [p1, setP1] = useState('Player 1');
  const [p2, setP2] = useState('Player 2');
  const [bestOf, setBestOf] = useState<'3' | '5'>('3');

  useEffect(() => {
    const activeColor = SPORTS.find(s => s.id === sport)?.color || '#c8ff00';
    document.documentElement.style.setProperty('--sport-accent', activeColor);
    document.documentElement.style.setProperty('--sport-accent-dim', `${activeColor}33`);
  }, [sport]);

  const handleStart = () => {
    sessionStorage.setItem('match_setup', JSON.stringify({ sport, player1: p1, player2: p2, bestOf: parseInt(bestOf) }));
    setLocation('/scoreboard');
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-8 flex flex-col md:flex-row gap-8 items-start max-w-6xl mx-auto">
      <div className="w-full md:w-1/2 space-y-8 md:mt-12">
        <div className="text-center md:text-left space-y-3">
          {/* Full logo with player on desktop, horizontal on mobile */}
          <div className="hidden md:flex items-center gap-4">
            <img
              src={scorevantFull}
              alt="Scorevant"
              className="h-44 w-auto object-contain"
              style={{ filter: 'drop-shadow(0 0 22px rgba(245,201,66,0.45))' }}
              data-testid="logo-full"
            />
          </div>
          <div className="flex md:hidden justify-center">
            <img
              src={scorevantHorizontal}
              alt="Scorevant"
              className="h-16 w-auto object-contain"
              style={{ filter: 'drop-shadow(0 0 14px rgba(245,201,66,0.5))' }}
              data-testid="logo-horizontal"
            />
          </div>
          <p className="text-muted-foreground font-sans tracking-wide text-sm">Settle the score.</p>
        </div>

        <div className="space-y-4">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Select Sport</Label>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {SPORTS.map(s => (
              <button
                key={s.id}
                data-testid={`select-sport-${s.id}`}
                onClick={() => setSport(s.id)}
                className={`px-4 py-2 rounded-full font-sans text-sm font-medium transition-all duration-300 ${
                  sport === s.id 
                    ? 'bg-[var(--sport-accent)] text-black shadow-[0_0_15px_var(--sport-accent-dim)]' 
                    : 'bg-card text-foreground border border-white/5 hover:bg-white/5'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <Card className="glass-panel border-white/10 mt-8">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="p1">Player 1</Label>
                <Input 
                  id="p1" 
                  value={p1} 
                  onChange={e => setP1(e.target.value)}
                  className="bg-black/20 border-white/10 focus-visible:ring-[var(--sport-accent)] text-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="p2">Player 2</Label>
                <Input 
                  id="p2" 
                  value={p2} 
                  onChange={e => setP2(e.target.value)}
                  className="bg-black/20 border-white/10 focus-visible:ring-[var(--sport-accent)] text-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Format</Label>
              <Select value={bestOf} onValueChange={(v: '3' | '5') => setBestOf(v)}>
                <SelectTrigger className="bg-black/20 border-white/10 focus:ring-[var(--sport-accent)]">
                  <SelectValue placeholder="Best of 3" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">Best of 3</SelectItem>
                  <SelectItem value="5">Best of 5</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleStart}
              className="w-full h-14 text-lg font-bold bg-[var(--sport-accent)] text-black hover:bg-[var(--sport-accent)] hover:brightness-110 transition-all glow-border"
              data-testid="start-match-btn"
            >
              START MATCH
              <MoveRight className="ml-2 w-5 h-5" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="w-full md:w-1/2 md:mt-12">
        <MatchHistoryPanel />
      </div>
    </div>
  );
}
