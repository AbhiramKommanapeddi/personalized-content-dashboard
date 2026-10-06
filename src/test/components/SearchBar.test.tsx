import { describe, it, expect } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../testUtils';
import { SearchBar } from '@/components/dashboard/SearchBar';

describe('SearchBar Component', () => {
  it('renders input with search placeholder', () => {
    renderWithProviders(<SearchBar />);

    const input = screen.getByLabelText('Search content feed');
    expect(input).toBeInTheDocument();
  });

  it('updates input value on typing and dispatches query', async () => {
    const { store } = renderWithProviders(<SearchBar />);

    const input = screen.getByLabelText('Search content feed') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Quantum' } });

    expect(input.value).toBe('Quantum');
    expect(store.getState().search.query).toBe('Quantum');

    // Debounce wait
    await waitFor(
      () => {
        expect(store.getState().search.debouncedQuery).toBe('Quantum');
      },
      { timeout: 600 }
    );
  });

  it('clears input when clear button is clicked', () => {
    const { store } = renderWithProviders(<SearchBar />);

    const input = screen.getByLabelText('Search content feed') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Synthetica' } });

    const clearBtn = screen.getByTitle('Clear search');
    fireEvent.click(clearBtn);

    expect(input.value).toBe('');
    expect(store.getState().search.query).toBe('');
  });
});
