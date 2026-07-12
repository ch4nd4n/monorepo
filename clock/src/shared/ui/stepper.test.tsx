import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Stepper } from '@shared/ui/stepper';

describe('Stepper', () => {
  it('renders the label and current value', () => {
    render(<Stepper label="Work" value={30} isLightTheme={false} onMinus={() => {}} onPlus={() => {}} />);

    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
  });

  it('calls onMinus and onPlus when the respective buttons are clicked', () => {
    const onMinus = vi.fn();
    const onPlus = vi.fn();
    render(<Stepper label="Rest" value={10} isLightTheme={false} onMinus={onMinus} onPlus={onPlus} />);

    fireEvent.click(screen.getByRole('button', { name: 'Decrease Rest' }));
    fireEvent.click(screen.getByRole('button', { name: 'Increase Rest' }));

    expect(onMinus).toHaveBeenCalledTimes(1);
    expect(onPlus).toHaveBeenCalledTimes(1);
  });
});
