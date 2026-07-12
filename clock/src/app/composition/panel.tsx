import type { ReactNode } from 'react';

import { Button } from '@shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';

interface PanelProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Panel({ title, onClose, children }: PanelProps): JSX.Element {
  return (
    <Card className="mt-3">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <Button type="button" variant="secondary" size="sm" onClick={onClose}>
          Close
        </Button>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
