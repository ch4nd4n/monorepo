import type { ReactNode } from 'react';

import { Button } from '@shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { cn } from '@shared/utils/cn';

interface PanelProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  isLightTheme?: boolean;
}

export function Panel({ title, onClose, children, isLightTheme = false }: PanelProps): JSX.Element {
  return (
    <Card className={cn('mt-3', isLightTheme && 'border-light-border bg-light-surface text-light-text')}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <Button type="button" variant="secondary" size="sm" onClick={onClose}>
          Close
        </Button>
      </CardHeader>
      <CardContent className={cn(isLightTheme && 'text-light-text')}>{children}</CardContent>
    </Card>
  );
}
