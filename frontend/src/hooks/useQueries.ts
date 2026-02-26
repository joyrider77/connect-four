import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { HighscoreEntry } from '../backend';

export function useHighscores() {
  const { actor, isFetching } = useActor();

  return useQuery<HighscoreEntry[]>({
    queryKey: ['highscores'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHighscores();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTopHighscores() {
  const { actor, isFetching } = useActor();

  return useQuery<HighscoreEntry[]>({
    queryKey: ['topHighscores'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTopHighscores();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddHighscore() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ playerName, time }: { playerName: string; time: number }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addHighscore(playerName, BigInt(time));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['highscores'] });
      queryClient.invalidateQueries({ queryKey: ['topHighscores'] });
    },
  });
}
