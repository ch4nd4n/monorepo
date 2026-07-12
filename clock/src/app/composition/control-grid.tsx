import { Button } from '@shared/ui/button';

interface ControlGridProps {
  primaryLabel: string;
  onPrimary: () => void;
  onNext: () => void;
  onStop: () => void;
  onReset: () => void;
}

export function ControlGrid({ primaryLabel, onPrimary, onNext, onStop, onReset }: ControlGridProps): JSX.Element {
  return (
    <section className="mx-auto grid w-full max-w-2xl grid-cols-2 gap-2 md:gap-3">
      <Button size="lg" className="h-12" onClick={onPrimary}>
        {primaryLabel}
      </Button>
      <Button size="lg" className="h-12" variant="secondary" onClick={onNext}>
        Next
      </Button>
      <Button size="lg" className="h-12" variant="secondary" onClick={onStop}>
        Stop
      </Button>
      <Button size="lg" className="h-12" variant="secondary" onClick={onReset}>
        Reset
      </Button>
    </section>
  );
}
