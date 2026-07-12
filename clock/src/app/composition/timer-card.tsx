interface TimerCardProps {
  timerText: string;
  phase: string;
  round: number;
  totalRounds: number;
  lastMessage: string;
}

export function TimerCard({ timerText, phase, round, totalRounds, lastMessage }: TimerCardProps): JSX.Element {
  return (
    <section className="flex flex-1 flex-col items-center justify-center py-6 md:py-8">
      <div
        data-testid="timer-display"
        className="text-center font-mono text-[6.25rem] font-semibold leading-[0.92] tracking-[-0.05em] text-foreground md:text-[13rem]"
      >
        {timerText}
      </div>
      <p className="mt-5 text-center font-mono text-base tracking-[0.32em] text-accent md:text-[1.7rem]">
        Phase: <strong>{phase}</strong> · Round {round}/{totalRounds}
      </p>
      <p className="mt-3 text-center text-xs uppercase tracking-[0.12em] text-muted-foreground md:text-sm">
        {lastMessage}
      </p>
    </section>
  );
}
