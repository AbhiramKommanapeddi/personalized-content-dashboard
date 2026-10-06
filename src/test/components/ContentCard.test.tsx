import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../testUtils';
import { ContentCard } from '@/components/feed/ContentCard';
import { INITIAL_NEWS_ITEMS, INITIAL_RECOMMENDATIONS } from '@/utils/apiData';

describe('ContentCard Component', () => {
  const newsItem = INITIAL_NEWS_ITEMS[0];
  const movieItem = INITIAL_RECOMMENDATIONS[0];

  it('renders news card with title, source, and description', () => {
    renderWithProviders(<ContentCard item={newsItem} />);

    expect(screen.getByText(newsItem.title)).toBeInTheDocument();
    expect(screen.getByText(newsItem.description)).toBeInTheDocument();
    expect(screen.getByText(newsItem.source)).toBeInTheDocument();
  });

  it('renders recommendation card with rating and title', () => {
    renderWithProviders(<ContentCard item={movieItem} />);

    expect(screen.getByText(movieItem.title)).toBeInTheDocument();
    expect(screen.getByText(`★ ${movieItem.rating}/10`)).toBeInTheDocument();
  });

  it('handles clicking the favorite button', () => {
    const { store } = renderWithProviders(<ContentCard item={newsItem} />);

    const favButton = screen.getByLabelText('Add to favorites');
    expect(favButton).toBeInTheDocument();

    fireEvent.click(favButton);

    // Verify favorite added to store
    expect(store.getState().favorites.items).toHaveLength(1);
    expect(store.getState().favorites.items[0].id).toBe(newsItem.id);
  });
});
