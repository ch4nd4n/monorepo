import { Minus, Plus } from 'lucide-react';

import { Button } from '@shared/ui/button';
import { cn } from '@shared/utils/cn';

export interface StepperProps {
  label: string;
  value: number;
  isLightTheme: boolean;
  onMinus: () => void;
  onPlus: () => void;
  className?: string;
}

export function Stepper({ label, value, isLightTheme, onMinus, onPlus, className }: StepperProps): JSX.Element {
  return (
    <div className={className}>
      <p className={cn('mb-2 text-xs uppercase tracking-[0.22em]', isLightTheme ? 'text-light-faint' : 'text-muted-foreground')}>
        {label}
      </p>
      <div
        className={cn(
          'flex items-center justify-between rounded-lg border px-4 py-3',
          isLightTheme ? 'border-light-border bg-light-surface' : 'border-border bg-card',
        )}
      >
        <Button type="button" size="sm" variant="ghost" aria-label={`Decrease ${label}`} onClick={onMinus}>
          <Minus size={16} aria-hidden focusable="false" />
        </Button>
        <span className={cn('text-4xl font-semibold', isLightTheme ? 'text-light-text' : 'text-foreground')}>{value}</span>
        <Button type="button" size="sm" variant="ghost" aria-label={`Increase ${label}`} onClick={onPlus}>
          <Plus size={16} aria-hidden focusable="false" />
        </Button>
      </div>
    </div>
  );
}
