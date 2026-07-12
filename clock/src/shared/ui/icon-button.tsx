import type { LucideIcon } from 'lucide-react';

import { Button, type ButtonProps } from '@shared/ui/button';
import { IconLabel, type IconMode } from '@shared/ui/icon-label';

export interface IconButtonProps extends ButtonProps {
  icon: LucideIcon;
  label: string;
  mode: IconMode;
}

export function IconButton({ icon, label, mode, ...props }: IconButtonProps): JSX.Element {
  return (
    <Button aria-label={mode === 'iconsOnly' ? label : undefined} {...props}>
      <IconLabel icon={icon} label={label} mode={mode} />
    </Button>
  );
}
