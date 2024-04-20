import useSWR from "swr";
import { League } from "../types/league";
import { Match } from "../types/match";
import { useParams } from "next/navigation";

const extractLeagueId = (leagueSlug: string | string[] | undefined): number | null => {
  if (typeof leagueSlug !== 'string') return null;
  
  const possibleId = leagueSlug.split('-').pop();
  const leagueId = Number(possibleId);
  
  return !isNaN(leagueId) && leagueId > 0 ? leagueId : null;
};

export function useAuth() {
  return useSWR("/auth/status");
}

export function useLeagues() {
  return useSWR<League[]>("/leagues");
}

export function useLeague() {
  const { leagueSlug } = useParams();
  const leagueId = extractLeagueId(leagueSlug);
  return useSWR<League>(leagueId ? `/league/${leagueId}` : null);
}

export function useTeams() {
  const { leagueSlug } = useParams();
  const leagueId = extractLeagueId(leagueSlug);  
  return useSWR(leagueId ? `/teams/${leagueId}` : null);
}

export function useSchedule() {
  const { leagueSlug } = useParams();
  const leagueId = extractLeagueId(leagueSlug); 
  return useSWR(leagueId ? `/league/${leagueId}/schedule` : null);
}
