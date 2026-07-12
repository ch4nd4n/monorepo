import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';

interface DebugCardProps {
  lastHeard: string;
  eventLog: string[];
}

export function DebugCard({ lastHeard, eventLog }: DebugCardProps): JSX.Element {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Debug</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-2 text-sm text-muted-foreground">Last heard: {lastHeard || '—'}</p>
        <pre className="max-h-56 overflow-auto whitespace-pre-wrap rounded-lg bg-muted p-3 font-mono text-xs text-foreground">
          {eventLog.join('\n')}
        </pre>
      </CardContent>
    </Card>
  );
}
