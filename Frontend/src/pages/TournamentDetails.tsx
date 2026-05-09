import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, Tournament, Entrant, TournamentMatch } from "@/lib/api";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Play, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function TournamentDetails() {
  const [match, setLocation] = useLocation();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<{ tournament: Tournament; entrants: Entrant[]; matches: TournamentMatch[] }>({
    queryKey: ["tournament", id],
    queryFn: () => api.tournaments.getDetails(id!),
    enabled: !!id,
    refetchInterval: 5000, // Poll every 5s for updates
  });

  const generateMutation = useMutation({
    mutationFn: () => api.tournaments.generateBracket(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournament", id] });
    },
  });

  if (isLoading) return <div className="p-8 text-center">Loading tournament details...</div>;
  if (!data) return <div className="p-8 text-center text-red-500">Tournament not found</div>;

  const { tournament, entrants, matches } = data;

  // Group matches by round
  const rounds = matches.reduce((acc, match) => {
    if (!acc[match.round]) acc[match.round] = [];
    acc[match.round].push(match);
    return acc;
  }, {} as Record<number, TournamentMatch[]>);

  const getEntrantName = (entrantOrId: any) => {
    if (!entrantOrId) return "TBD";
    if (typeof entrantOrId === 'string') {
        const found = entrants.find(e => e._id === entrantOrId);
        return found ? found.name : "TBD";
    }
    return entrantOrId.name || "TBD";
  };

  return (
    <div className="container mx-auto py-8">
      <Button variant="ghost" onClick={() => setLocation("/tournaments")} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tournaments
      </Button>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{tournament.name}</h1>
          <p className="text-muted-foreground">{tournament.sportType} • {entrants.length} Entrants • Status: {tournament.status}</p>
        </div>
        {tournament.status === 'Upcoming' && (
          <Button onClick={() => generateMutation.mutate()} disabled={generateMutation.isPending || entrants.length < 2}>
            {generateMutation.isPending ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
            Generate Bracket
          </Button>
        )}
      </div>

      <div className="overflow-x-auto pb-8">
        <div className="flex gap-8 min-w-max">
          {Object.keys(rounds).map(roundStr => {
            const roundNum = parseInt(roundStr);
            const roundMatches = rounds[roundNum];
            return (
              <div key={roundNum} className="flex flex-col gap-4 min-w-[250px]">
                <h3 className="font-semibold text-lg border-b pb-2">Round {roundNum}</h3>
                <div className="flex flex-col gap-6 flex-1 justify-center">
                  {roundMatches.map(match => (
                    <Card 
                      key={match._id} 
                      className={`w-full group ${match.status === 'Live' ? 'border-primary shadow-md' : ''} ${match.status !== 'Completed' && match.entrant1Id && match.entrant2Id ? 'cursor-pointer hover:border-primary transition-colors' : ''}`}
                      onClick={() => {
                        if (match.status !== 'Completed' && match.entrant1Id && match.entrant2Id) {
                          sessionStorage.setItem('match_setup', JSON.stringify({
                            id: match._id,
                            sport: tournament.sportType.toLowerCase().replace(' ', '-'),
                            player1: getEntrantName(match.entrant1Id),
                            player2: getEntrantName(match.entrant2Id),
                            bestOf: tournament.maxSets || 3
                          }));
                          setLocation('/scoreboard');
                        }
                      }}
                    >
                      <CardContent className="p-4 flex flex-col gap-2 relative">
                        <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
                          <span>Match {match.matchNumber}</span>
                          <Badge variant={match.status === 'Completed' ? 'secondary' : match.status === 'Live' ? 'default' : 'outline'}>
                            {match.status}
                          </Badge>
                        </div>
                        <div className={`p-2 rounded flex justify-between ${match.winnerId === (typeof match.entrant1Id === 'object' ? (match.entrant1Id as any)._id : match.entrant1Id) ? 'bg-primary/10 font-bold' : 'bg-muted/50'}`}>
                          <span>{getEntrantName(match.entrant1Id)}</span>
                        </div>
                        <div className={`p-2 rounded flex justify-between ${match.winnerId === (typeof match.entrant2Id === 'object' ? (match.entrant2Id as any)._id : match.entrant2Id) ? 'bg-primary/10 font-bold' : 'bg-muted/50'}`}>
                          <span>{getEntrantName(match.entrant2Id)}</span>
                        </div>
                        {match.status !== 'Completed' && match.entrant1Id && match.entrant2Id && (
                           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                             <Button variant="default" size="sm">
                               <Play className="w-4 h-4 mr-2" /> Officiate Match
                             </Button>
                           </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        {Object.keys(rounds).length === 0 && tournament.status !== 'Upcoming' && (
             <div className="text-center py-12 text-muted-foreground">
                 No matches found.
             </div>
        )}
      </div>
    </div>
  );
}
