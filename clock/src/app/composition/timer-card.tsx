import { cn } from '@shared/utils/cn';

type TimerMode = 'A' | 'B' | 'C';

interface TimerCardProps {
  timerText: string;
  phase: string;
  round: number;
  totalRounds: number;
  lastMessage: string;
  isLightTheme: boolean;
  mode: TimerMode;
  progress: number;
}

export function TimerCard({
  timerText,
  phase,
  round,
  totalRounds,
  lastMessage,
  isLightTheme,
  mode,
  progress,
}: TimerCardProps): JSX.Element {
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const radialCircumference = 2 * Math.PI * 140;
  const dashOffset = radialCircumference * (1 - clampedProgress);

  return (
    <section className="flex flex-1 flex-col items-center justify-center py-6 md:py-8">
      {mode === 'C' ? (
        <div className="relative mb-3 h-[280px] w-[280px] md:h-[360px] md:w-[360px]">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 320 320" aria-hidden>
            <circle cx="160" cy="160" r="140" strokeWidth="16" fill="none" className={isLightTheme ? 'stroke-light-surface-2' : 'stroke-muted'} />
            <circle
              cx="160"
              cy="160"
              r="140"
              strokeWidth="16"
              fill="none"
              strokeLinecap="round"
              className={isLightTheme ? 'stroke-light-accent' : 'stroke-accent'}
              style={{
                strokeDasharray: radialCircumference,
                strokeDashoffset: dashOffset,
              }}
            />
          </svg>
          <div
            data-testid="timer-display"
            className={cn(
              'absolute inset-0 flex items-center justify-center text-center font-mono text-[4.5rem] font-semibold leading-none tracking-[-0.05em] md:text-[7rem]',
              isLightTheme ? 'text-light-accent' : 'text-accent',
            )}
          >
            {timerText}
          </div>
        </div>
      ) : (
        <>
          <div
            data-testid="timer-display"
            className={cn(
              'text-center font-mono text-[6.25rem] font-semibold leading-[0.92] tracking-[-0.05em] md:text-[13rem]',
              isLightTheme ? 'text-light-accent' : 'text-accent',
            )}
          >
            {timerText}
          </div>
          {mode === 'B' && (
            <div className={cn('mt-4 h-2.5 w-full max-w-xl overflow-hidden rounded-full', isLightTheme ? 'bg-light-surface-2' : 'bg-muted')}>
              <div
                className={cn('h-full rounded-full transition-all duration-300', isLightTheme ? 'bg-light-accent' : 'bg-accent')}
                style={{ width: `${Math.max(2, clampedProgress * 100)}%` }}
              />
            </div>
          )}
        </>
      )}

      <p
        className={cn(
          'mt-5 text-center font-mono text-base tracking-[0.32em] md:text-[1.7rem]',
          isLightTheme ? 'text-light-accent' : 'text-accent',
        )}
      >
        <strong data-testid="phase-value">{String(phase).toUpperCase()}</strong> · {round}/{totalRounds}
      </p>
      <p
        className={cn(
          'mt-3 text-center text-xs uppercase tracking-[0.12em] md:text-sm',
          isLightTheme ? 'text-light-faint' : 'text-muted-foreground',
        )}
      >
        {lastMessage}
      </p>
    </section>
  );
}
