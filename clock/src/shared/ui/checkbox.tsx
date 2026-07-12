import { Check } from 'lucide-react';
import * as React from 'react';

import { cn } from '@shared/utils/cn';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  isLightTheme?: boolean;
}

export function Checkbox({ className, isLightTheme = false, checked, ...props }: CheckboxProps): JSX.Element {
  return (
    <span className="relative inline-flex h-5 w-5 shrink-0 items-center justify-center">
      <input
        type="checkbox"
        checked={checked}
        className={cn(
          'peer h-5 w-5 shrink-0 cursor-pointer appearance-none rounded border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70',
          checked
            ? isLightTheme
              ? 'border-light-accent bg-light-accent'
              : 'border-accent bg-accent'
            : isLightTheme
              ? 'border-light-border-strong bg-light-surface'
              : 'border-border-strong bg-card',
          className,
        )}
        {...props}
      />
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100">
        <Check size={14} strokeWidth={3} aria-hidden focusable="false" className={isLightTheme ? 'text-light-on-accent' : 'text-on-accent'} />
      </span>
    </span>
  );
}
