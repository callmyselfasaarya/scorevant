import { getAccessToken } from './auth-api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export interface Entrant {
  _id: string;
  name: string;
  seed?: number;
  tournamentId: string;
}

export interface Tournament {
  _id: string;
  name: string;
  sportType: string;
  maxSets: number;
  status: string;
  createdAt: string;
  userId?: string;
}

export interface TournamentMatch {
  _id: string;
  tournamentId: string;
  round: number;
  matchNumber: number;
  entrant1Id?: Entrant | string | null;
  entrant2Id?: Entrant | string | null;
  winnerId?: Entrant | string | null;
  score: any;
  status: string;
  courtId?: Court | string | null;
  umpireId?: string | null;
  nextMatchId?: string | null;
}

export interface Court {
  _id: string;
  name: string;
  status: string;
  currentMatchId?: TournamentMatch | string | null;
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = getAccessToken();

  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  tournaments: {
    list: async (): Promise<Tournament[]> => {
      return fetchWithAuth('/tournaments');
    },
    create: async (data: { name: string; sportType: string; maxSets: number; entrants: { name: string; seed?: number }[] }) => {
      return fetchWithAuth('/tournaments', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    getDetails: async (id: string): Promise<{ tournament: Tournament; entrants: Entrant[]; matches: TournamentMatch[] }> => {
      return fetchWithAuth(`/tournaments/${id}`);
    },
    generateBracket: async (id: string) => {
      return fetchWithAuth(`/tournaments/${id}/generate-bracket`, {
        method: 'POST',
      });
    },
    updateMatch: async (matchId: string, data: { score?: any; winnerId?: string; status?: string }) => {
      return fetchWithAuth(`/tournaments/matches/${matchId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    }
  },
  courts: {
    list: async (): Promise<Court[]> => {
      return fetchWithAuth('/courts');
    },
    create: async (name: string) => {
      return fetchWithAuth('/courts', {
        method: 'POST',
        body: JSON.stringify({ name }),
      });
    },
    getQueue: async (): Promise<TournamentMatch[]> => {
      return fetchWithAuth('/courts/queue');
    },
    assignMatch: async (courtId: string, matchId: string) => {
      return fetchWithAuth(`/courts/${courtId}/assign`, {
        method: 'PUT',
        body: JSON.stringify({ matchId }),
      });
    },
    freeCourt: async (courtId: string) => {
      return fetchWithAuth(`/courts/${courtId}/free`, {
        method: 'PUT',
      });
    }
  }
};
