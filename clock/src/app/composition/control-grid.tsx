import { Button } from '@shared/ui/button';

interface ControlGridProps {
  primaryLabel: string;
  isLightTheme: boolean;
  onPrimary: () => void;
  onNext: () => void;
  onStop: () => void;
  onReset: () => void;
}

export function ControlGrid({
  primaryLabel,
  isLightTheme,
  onPrimary,
  onNext,
  onStop,
  onReset,
}: ControlGridProps): JSX.Element {
  return (
    <section className="mx-auto grid w-full max-w-2xl grid-cols-2 gap-2 md:gap-3">
      <Button size="lg" className="h-12" onClick={onPrimary}>
        {primaryLabel}
      </Button>
      <Button
        size="lg"
        className={isLightTheme ? 'h-12 border border-light-border-strong bg-light-surface text-light-text hover:bg-light-surface-2' : 'h-12 border border-border/60 bg-transparent text-foreground/85 hover:bg-muted/50'}
        variant="ghost"
        onClick={onNext}
      >
        Next
      </Button>
      <Button
        size="lg"
        className={isLightTheme ? 'h-12 border border-light-danger/30 bg-light-danger/10 text-light-danger hover:bg-light-danger/20' : 'h-12 border border-border/60 bg-transparent text-foreground/85 hover:bg-muted/50'}
        variant="ghost"
        onClick={onStop}
      >
        Stop
      </Button>
      <Button
        size="lg"
        className={isLightTheme ? 'h-12 border border-light-border-strong bg-light-surface text-light-text hover:bg-light-surface-2' : 'h-12 border border-border/60 bg-transparent text-foreground/85 hover:bg-muted/50'}
        variant="ghost"
        onClick={onReset}
      >
        Reset
      </Button>
    </section>
  );
}
