import { render, screen } from '@testing-library/react';
import { Bug } from 'lucide-react';
import { describe, expect, it } from 'vitest';

import { IconButton } from '@shared/ui/icon-button';

describe('IconButton', () => {
  it('renders only the text label in text mode, with no icon', () => {
    render(<IconButton icon={Bug} label="Show Debug" mode="text" onClick={() => {}} />);

    const button = screen.getByRole('button', { name: 'Show Debug' });
    expect(button).toHaveTextContent('Show Debug');
    expect(button.querySelector('svg')).toBeNull();
  });

  it('renders both icon and text in iconsWithText mode', () => {
    render(<IconButton icon={Bug} label="Show Debug" mode="iconsWithText" onClick={() => {}} />);

    const button = screen.getByRole('button', { name: 'Show Debug' });
    expect(button).toHaveTextContent('Show Debug');
    const icon = button.querySelector('svg');
    expect(icon).not.toBeNull();
    expect(icon).toHaveAttribute('aria-hidden');
    expect(icon).toHaveAttribute('width', '16');
  });

  it('renders icon only in iconsOnly mode, with an aria-label carrying the accessible name', () => {
    render(<IconButton icon={Bug} label="Show Debug" mode="iconsOnly" onClick={() => {}} />);

    const button = screen.getByRole('button', { name: 'Show Debug' });
    expect(button).toHaveAttribute('aria-label', 'Show Debug');
    expect(button.textContent).toBe('');
    const icon = button.querySelector('svg');
    expect(icon).not.toBeNull();
  });

  it('renders a larger icon in iconsOnly mode than in iconsWithText mode', () => {
    const { unmount } = render(<IconButton icon={Bug} label="Show Debug" mode="iconsOnly" onClick={() => {}} />);
    const onlyIcon = screen.getByRole('button').querySelector('svg');
    expect(onlyIcon).toHaveAttribute('width', '20');
    unmount();

    render(<IconButton icon={Bug} label="Show Debug" mode="iconsWithText" onClick={() => {}} />);
    const withTextIcon = screen.getByRole('button').querySelector('svg');
    expect(withTextIcon).toHaveAttribute('width', '16');
  });

  it('does not set an aria-label in text or iconsWithText mode, relying on visible text', () => {
    render(<IconButton icon={Bug} label="Show Debug" mode="iconsWithText" onClick={() => {}} />);
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-label');
  });
});
