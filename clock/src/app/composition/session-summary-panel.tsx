import { CalendarClock, CheckCircle2, Hourglass, ListChecks, type LucideIcon } from 'lucide-react';

import { Panel } from '@app/composition/panel';

import type { IconDisplayMode } from '@features/settings/domain/settings-types';
import type { SessionSummary } from '@features/workout-session/workout-controller';

import { cn } from '@shared/utils/cn';
import { formatDuration } from '@shared/utils/format-duration';

interface SessionSummaryPanelProps {
  summary: SessionSummary | null;
  isLightTheme: boolean;
  iconMode: IconDisplayMode;
  onClose: () => void;
}

interface SummaryStat {
  label: string;
  value: string;
  icon: LucideIcon;
}

export function SessionSummaryPanel({ summary, isLightTheme, iconMode, onClose }: SessionSummaryPanelProps): JSX.Element {
  return (
    <Panel title="Session Summary" isLightTheme={isLightTheme} iconMode={iconMode} onClose={onClose}>
      {summary ? <SummaryStats summary={summary} isLightTheme={isLightTheme} /> : <EmptyState isLightTheme={isLightTheme} />}
    </Panel>
  );
}

function SummaryStats({ summary, isLightTheme }: { summary: SessionSummary; isLightTheme: boolean }): JSX.Element {
  const stats: SummaryStat[] = [
    { label: 'Elapsed', value: formatDuration(summary.elapsedMs), icon: Hourglass },
    { label: 'Rounds completed', value: String(summary.roundsCompleted), icon: ListChecks },
    { label: 'Started', value: new Date(summary.startedAtMs).toLocaleTimeString(), icon: CalendarClock },
    { label: 'Ended', value: new Date(summary.endedAtMs).toLocaleTimeString(), icon: CalendarClock },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div
        className={cn(
          'flex items-center gap-3 rounded-lg border px-4 py-3',
          isLightTheme ? 'border-light-border bg-light-surface-2' : 'border-border bg-muted/40',
        )}
      >
        <span
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-md',
            isLightTheme ? 'bg-light-surface text-light-positive' : 'bg-card text-positive',
          )}
        >
          <CheckCircle2 size={18} aria-hidden focusable="false" />
        </span>
        <p className={cn('text-sm font-medium', isLightTheme ? 'text-light-text' : 'text-foreground')}>Workout complete</p>
      </div>

      <ul className="grid grid-cols-2 gap-2">
        {stats.map((stat) => (
          <li
            key={stat.label}
            className={cn(
              'flex items-center gap-2.5 rounded-lg border px-3 py-2.5',
              isLightTheme ? 'border-light-border bg-light-surface-2' : 'border-border bg-muted/40',
            )}
          >
            <span
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-md',
                isLightTheme ? 'bg-light-surface text-light-accent' : 'bg-card text-accent',
              )}
            >
              <stat.icon size={16} aria-hidden focusable="false" />
            </span>
            <div className="flex min-w-0 flex-col gap-0.5">
              <span
                className={cn(
                  'text-[10px] uppercase tracking-[0.1em]',
                  isLightTheme ? 'text-light-faint' : 'text-muted-foreground',
                )}
              >
                {stat.label}
              </span>
              <span className={cn('truncate font-mono text-sm', isLightTheme ? 'text-light-text' : 'text-foreground')}>
                {stat.value}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EmptyState({ isLightTheme }: { isLightTheme: boolean }): JSX.Element {
  return (
    <p className={cn('text-sm', isLightTheme ? 'text-light-muted' : 'text-muted-foreground')}>
      No summary yet. Stop or complete a session to view stats.
    </p>
  );
}
