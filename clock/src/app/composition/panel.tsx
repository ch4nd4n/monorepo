import { X } from 'lucide-react';
import type { ReactNode } from 'react';

import type { IconDisplayMode } from '@features/settings/domain/settings-types';

import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { IconButton } from '@shared/ui/icon-button';
import { cn } from '@shared/utils/cn';

interface PanelProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  isLightTheme?: boolean;
  iconMode?: IconDisplayMode;
}

export function Panel({ title, onClose, children, isLightTheme = false, iconMode = 'iconsWithText' }: PanelProps): JSX.Element {
  return (
    <Card className={cn('mt-3', isLightTheme && 'border-light-border bg-light-surface text-light-text')}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <IconButton icon={X} label="Close" mode={iconMode} type="button" variant="secondary" size="sm" onClick={onClose} />
      </CardHeader>
      <CardContent className={cn(isLightTheme && 'text-light-text')}>{children}</CardContent>
    </Card>
  );
}
