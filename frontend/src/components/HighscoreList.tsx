import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Clock, User, ArrowLeft, Calendar } from 'lucide-react';
import { useTopHighscores } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '../hooks/useTranslation';

interface HighscoreListProps {
  onBack: () => void;
}

interface GroupedEntry {
  playerName: string;
  time: bigint;
  timestamp: bigint;
  dayRank: number;
}

interface DayGroup {
  date: string;
  displayDate: string;
  entries: GroupedEntry[];
}

export function HighscoreList({ onBack }: HighscoreListProps) {
  const { t } = useTranslation();
  const { data: highscores, isLoading, error } = useTopHighscores();

  const formatTime = (milliseconds: bigint) => {
    const ms = Number(milliseconds);
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000); // Convert nanoseconds to milliseconds
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateOnly = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateKey = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format for grouping
  };

  const formatDisplayDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateKey = date.toDateString();
    const todayKey = today.toDateString();
    const yesterdayKey = yesterday.toDateString();

    if (dateKey === todayKey) {
      return 'Heute';
    } else if (dateKey === yesterdayKey) {
      return 'Gestern';
    } else {
      return date.toLocaleDateString('de-DE', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  };

  const getRankIcon = (dayRank: number) => {
    switch (dayRank) {
      case 1:
        return <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />;
      case 3:
        return <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />;
      default:
        return <span className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs font-bold text-muted-foreground">#{dayRank}</span>;
    }
  };

  // Group entries by day
  const groupedEntries: DayGroup[] = React.useMemo(() => {
    if (!highscores || highscores.length === 0) return [];

    const groups: { [key: string]: DayGroup } = {};

    highscores.forEach((entry) => {
      const dateKey = formatDateKey(entry.timestamp);
      
      if (!groups[dateKey]) {
        groups[dateKey] = {
          date: dateKey,
          displayDate: formatDisplayDate(entry.timestamp),
          entries: []
        };
      }

      groups[dateKey].entries.push({
        ...entry,
        dayRank: groups[dateKey].entries.length + 1
      });
    });

    // Convert to array and sort by date (most recent first)
    return Object.values(groups).sort((a, b) => b.date.localeCompare(a.date));
  }, [highscores]);

  return (
    <div className="w-full max-w-4xl px-2 sm:px-4">
      <Card className="game-card">
        <CardHeader className="text-center px-3 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.back}
            </Button>
            
            <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold game-title flex items-center">
              <Trophy className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-yellow-500 mr-2 sm:mr-3" />
              {t.highscoreList}
            </CardTitle>

            <div className="w-8"></div> {/* Spacer for alignment */}
          </div>
          
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
            {t.fastestWins}
          </p>
        </CardHeader>

        <CardContent className="px-3 sm:px-6">
          {isLoading && (
            <div className="space-y-3">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="flex items-center space-x-4 p-3 rounded-lg border">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-destructive">Fehler beim Laden der Bestenliste</p>
            </div>
          )}

          {!isLoading && !error && (!highscores || highscores.length === 0) && (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">{t.noEntries}</h3>
              <p className="text-sm text-muted-foreground">
                {t.noEntriesDesc}
              </p>
            </div>
          )}

          {!isLoading && !error && groupedEntries.length > 0 && (
            <div className="space-y-6">
              {groupedEntries.map((dayGroup, dayIndex) => (
                <div key={dayGroup.date} className="day-group">
                  {/* Day Header */}
                  <div className="flex items-center mb-3 sm:mb-4">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary mr-2" />
                    <h3 className="text-lg sm:text-xl font-bold text-foreground">
                      {dayGroup.displayDate}
                    </h3>
                    <div className="flex-1 ml-3">
                      <div className="h-px bg-gradient-to-r from-border to-transparent"></div>
                    </div>
                  </div>

                  {/* Day Entries */}
                  <div className="day-entries space-y-2 sm:space-y-3 pl-2 sm:pl-4 border-l-2 border-primary/20">
                    {dayGroup.entries.map((entry, entryIndex) => {
                      // Calculate overall rank for styling
                      let overallRank = 0;
                      for (let i = 0; i < dayIndex; i++) {
                        overallRank += groupedEntries[i].entries.length;
                      }
                      overallRank += entryIndex;

                      return (
                        <div
                          key={`${entry.playerName}-${entry.timestamp}`}
                          className={`flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                            overallRank === 0 
                              ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-700' 
                              : overallRank === 1
                              ? 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/20 dark:to-gray-700/20 border-gray-200 dark:border-gray-600'
                              : overallRank === 2
                              ? 'bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-700'
                              : 'bg-card hover:bg-muted/50'
                          }`}
                        >
                          <div className="flex-shrink-0">
                            {getRankIcon(entry.dayRank)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <User className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                              <span className="font-semibold text-sm sm:text-base truncate">
                                {entry.playerName}
                              </span>
                              {overallRank < 3 && (
                                <Badge variant="outline" className="text-xs">
                                  #{overallRank + 1} gesamt
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground">
                              {formatDate(entry.timestamp)}
                            </div>
                          </div>

                          <div className="flex-shrink-0 text-right">
                            <div className="flex items-center space-x-1 sm:space-x-2">
                              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                              <Badge 
                                variant={overallRank < 3 ? 'default' : 'secondary'}
                                className="font-mono text-xs sm:text-sm"
                              >
                                {formatTime(entry.time)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 sm:mt-8 text-center">
            <Button onClick={onBack} variant="outline" size="lg" className="game-button">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.backToGame}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
