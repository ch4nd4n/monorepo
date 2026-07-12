import type { LucideIcon } from 'lucide-react';

import { cn } from '@shared/utils/cn';

export type IconMode = 'text' | 'iconsWithText' | 'iconsOnly';

interface IconLabelProps {
  icon: LucideIcon;
  label: string;
  mode: IconMode;
  className?: string;
}

export function IconLabel({ icon: Icon, label, mode, className }: IconLabelProps): JSX.Element {
  if (mode === 'text') {
    return <>{label}</>;
  }

  const iconSize = mode === 'iconsOnly' ? 20 : 16;

  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <Icon size={iconSize} aria-hidden focusable="false" />
      {mode === 'iconsWithText' && <span>{label}</span>}
    </span>
  );
}
