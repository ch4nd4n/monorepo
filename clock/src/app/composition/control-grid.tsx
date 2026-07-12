import { Pause, Play, RotateCcw, SkipForward, Square } from 'lucide-react';

import type { IconDisplayMode } from '@features/settings/domain/settings-types';

import { IconButton } from '@shared/ui/icon-button';

interface ControlGridProps {
  primaryLabel: string;
  isLightTheme: boolean;
  iconMode: IconDisplayMode;
  onPrimary: () => void;
  onNext: () => void;
  onStop: () => void;
  onReset: () => void;
}

const PRIMARY_ICONS: Record<string, typeof Play> = {
  Start: Play,
  Continue: Play,
  Pause: Pause,
};

export function ControlGrid({
  primaryLabel,
  isLightTheme,
  iconMode,
  onPrimary,
  onNext,
  onStop,
  onReset,
}: ControlGridProps): JSX.Element {
  return (
    <section className="mx-auto grid w-full max-w-2xl grid-cols-2 gap-2 md:gap-3">
      <IconButton
        icon={PRIMARY_ICONS[primaryLabel] ?? Play}
        label={primaryLabel}
        mode={iconMode}
        size="lg"
        className="h-12"
        onClick={onPrimary}
      />
      <IconButton
        icon={SkipForward}
        label="Next"
        mode={iconMode}
        size="lg"
        className={isLightTheme ? 'h-12 border border-light-border-strong bg-light-surface text-light-text hover:bg-light-surface-2' : 'h-12 border border-border/60 bg-transparent text-foreground/85 hover:bg-muted/50'}
        variant="ghost"
        onClick={onNext}
      />
      <IconButton
        icon={Square}
        label="Stop"
        mode={iconMode}
        size="lg"
        className={isLightTheme ? 'h-12 border border-light-danger/30 bg-light-danger/10 text-light-danger hover:bg-light-danger/20' : 'h-12 border border-border/60 bg-transparent text-foreground/85 hover:bg-muted/50'}
        variant="ghost"
        onClick={onStop}
      />
      <IconButton
        icon={RotateCcw}
        label="Reset"
        mode={iconMode}
        size="lg"
        className={isLightTheme ? 'h-12 border border-light-border-strong bg-light-surface text-light-text hover:bg-light-surface-2' : 'h-12 border border-border/60 bg-transparent text-foreground/85 hover:bg-muted/50'}
        variant="ghost"
        onClick={onReset}
      />
    </section>
  );
}
