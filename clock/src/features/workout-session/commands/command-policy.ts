import type {
  CommandPolicyResult,
  NormalizedCommand,
  WorkoutContext,
} from '@features/workout-session/commands/command-types';

export interface CommandPolicyInput {
  command: NormalizedCommand;
  workout: WorkoutContext;
  minConfidence: number;
}

export function evaluateCommandPolicy(input: CommandPolicyInput): CommandPolicyResult {
  const { command, workout, minConfidence } = input;

  if (command.source === 'voice' && typeof command.confidence === 'number') {
    if (command.confidence < minConfidence) {
      return { decision: 'rejected', reason: 'Rejected: low confidence' };
    }
  }

  if (command.type === 'START' && workout.state === 'running') {
    return { decision: 'rejected', reason: 'Already running' };
  }

  if (command.type === 'RESET') {
    return { decision: 'accepted', reason: 'Reset allowed' };
  }

  return { decision: 'accepted', reason: 'Accepted' };
}
