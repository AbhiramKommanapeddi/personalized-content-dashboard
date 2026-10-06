import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../testUtils';
import { Header } from '@/components/dashboard/Header';

describe('Header Component', () => {
  const mockProps = {
    onOpenSettings: vi.fn(),
    onOpenProfile: vi.fn(),
    onToggleSidebar: vi.fn(),
  };

  it('renders header elements and user profile', () => {
    const { store } = renderWithProviders(<Header {...mockProps} />);

    expect(screen.getByTitle('Notifications')).toBeInTheDocument();
    expect(screen.getByTitle(/Current theme:/i)).toBeInTheDocument();

    const userName = store.getState().auth.user.name.split(' ')[0];
    expect(screen.getByText(userName)).toBeInTheDocument();
  });

  it('cycles theme when theme toggle button is clicked', () => {
    const { store } = renderWithProviders(<Header {...mockProps} />);

    expect(store.getState().preferences.theme).toBe('dark');

    const themeBtn = screen.getByTitle(/Current theme: dark/i);
    fireEvent.click(themeBtn);

    expect(store.getState().preferences.theme).toBe('light');
  });

  it('triggers onOpenSettings when settings icon is clicked', () => {
    renderWithProviders(<Header {...mockProps} />);

    const settingsBtn = screen.getByTitle('Dashboard Settings');
    fireEvent.click(settingsBtn);

    expect(mockProps.onOpenSettings).toHaveBeenCalledTimes(1);
  });
});
