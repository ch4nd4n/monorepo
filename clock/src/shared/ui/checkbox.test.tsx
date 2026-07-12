import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Checkbox } from '@shared/ui/checkbox';

describe('Checkbox', () => {
  it('reflects the checked state', () => {
    render(<Checkbox checked readOnly />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('reflects the unchecked state', () => {
    render(<Checkbox checked={false} readOnly />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('calls onChange when toggled', () => {
    const onChange = vi.fn();
    render(<Checkbox checked={false} onChange={onChange} />);

    fireEvent.click(screen.getByRole('checkbox'));

    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
