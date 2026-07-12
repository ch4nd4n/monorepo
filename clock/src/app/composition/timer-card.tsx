import { Card, CardContent } from '@shared/ui/card';

interface TimerCardProps {
  timerText: string;
  phase: string;
  round: number;
  totalRounds: number;
  lastMessage: string;
}

export function TimerCard({ timerText, phase, round, totalRounds, lastMessage }: TimerCardProps): JSX.Element {
  return (
    <Card className="mb-4 bg-background">
      <CardContent className="space-y-2 p-6">
        <div
          data-testid="timer-display"
          className="text-center font-mono text-7xl font-semibold tracking-tight text-foreground md:text-8xl"
        >
          {timerText}
        </div>
        <p className="text-center font-mono text-lg tracking-[0.12em] text-accent">
          Phase: <strong>{phase}</strong> · Round {round}/{totalRounds}
        </p>
        <p className="text-center text-sm text-muted-foreground">{lastMessage}</p>
      </CardContent>
    </Card>
  );
}
