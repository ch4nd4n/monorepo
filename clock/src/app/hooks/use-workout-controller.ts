import { useEffect, useRef, useState } from 'react';

import type { UserSettings } from '@features/settings/domain/settings-types';
import type {
  CommandPolicyResult,
  CommandType,
} from '@features/workout-session/commands/command-types';
import {
  createWorkoutController,
  type WorkoutControllerState,
} from '@features/workout-session/workout-controller';

import { nowMs } from '@shared/utils/time';

interface UseWorkoutControllerInput {
  settings: UserSettings;
  hydrated: boolean;
  onCompleted: () => void;
}

interface DispatchResult {
  result: CommandPolicyResult;
  state: WorkoutControllerState;
}

interface UseWorkoutControllerResult {
  view: WorkoutControllerState;
  dispatchCommand: (type: CommandType, source: 'manual' | 'voice', confidence?: number) => DispatchResult;
}

export function useWorkoutController({
  settings,
  hydrated,
  onCompleted,
}: UseWorkoutControllerInput): UseWorkoutControllerResult {
  const controllerRef = useRef(
    createWorkoutController({
      workMs: settings.workMs,
      restMs: settings.restMs,
      rounds: settings.rounds,
      prerollEnabled: settings.prerollEnabled,
      prerollSeconds: settings.prerollSeconds,
      minCommandConfidence: settings.minCommandConfidence,
    }),
  );

  const [view, setView] = useState(controllerRef.current.getState());

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    controllerRef.current = createWorkoutController({
      workMs: settings.workMs,
      restMs: settings.restMs,
      rounds: settings.rounds,
      prerollEnabled: settings.prerollEnabled,
      prerollSeconds: settings.prerollSeconds,
      minCommandConfidence: settings.minCommandConfidence,
    });
    setView(controllerRef.current.getState());
  }, [hydrated, settings]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      controllerRef.current.tick(nowMs());
      const next = controllerRef.current.getState();
      if (next.workoutState === 'completed') {
        onCompleted();
      }
      setView(next);
    }, Math.max(50, Math.floor(1000 / settings.renderFps)));

    return () => window.clearInterval(interval);
  }, [onCompleted, settings.renderFps]);

  function dispatchCommand(type: CommandType, source: 'manual' | 'voice', confidence?: number): DispatchResult {
    const result = controllerRef.current.dispatch({
      type,
      source,
      timestampMs: nowMs(),
      confidence,
    });

    const state = controllerRef.current.getState();
    setView(state);

    return { result, state };
  }

  return {
    view,
    dispatchCommand,
  };
}
