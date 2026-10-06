import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ContentItem, Category, ContentType } from '@/types/content';
import { ALL_INITIAL_ITEMS } from '@/utils/apiData';

export type DashboardTab = 'feed' | 'trending' | 'favorites' | 'analytics';

interface ContentState {
  items: ContentItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  activeTab: DashboardTab;
  selectedCategory: Category | 'all';
  selectedType: ContentType | 'all';
  page: number;
  hasMore: boolean;
  livePendingItems: ContentItem[];
  userOrderIds: string[];
  activeModalItem: ContentItem | null;
  audioPlayerState: {
    isPlaying: boolean;
    currentTrackTitle?: string;
    audioUrl?: string;
  };
}

const initialState: ContentState = {
  items: ALL_INITIAL_ITEMS,
  status: 'succeeded',
  error: null,
  activeTab: 'feed',
  selectedCategory: 'all',
  selectedType: 'all',
  page: 1,
  hasMore: true,
  livePendingItems: [],
  userOrderIds: [],
  activeModalItem: null,
  audioPlayerState: {
    isPlaying: false,
  },
};

export const fetchUnifiedContent = createAsyncThunk(
  'content/fetchUnifiedContent',
  async (
    params: { category?: Category | 'all'; search?: string } = {},
    { rejectWithValue }
  ) => {
    try {
      const { category, search } = params;
      const queryParams = new URLSearchParams();
      if (category && category !== 'all') queryParams.append('category', category);
      if (search) queryParams.append('search', search);

      const qs = queryParams.toString() ? `?${queryParams.toString()}` : '';

      // Concurrent fetch across the 3 API routes
      const [newsRes, recsRes, socialRes] = await Promise.allSettled([
        fetch(`/api/news${qs}`).then((res) => res.json()),
        fetch(`/api/recommendations${qs}`).then((res) => res.json()),
        fetch(`/api/social${qs}`).then((res) => res.json()),
      ]);

      const newsData: ContentItem[] = newsRes.status === 'fulfilled' && newsRes.value?.data ? newsRes.value.data : [];
      const recsData: ContentItem[] = recsRes.status === 'fulfilled' && recsRes.value?.data ? recsRes.value.data : [];
      const socialData: ContentItem[] = socialRes.status === 'fulfilled' && socialRes.value?.data ? socialRes.value.data : [];

      const combined: ContentItem[] = [...newsData, ...recsData, ...socialData];

      if (combined.length === 0) {
        // Fallback to local curated dataset if server is building or offline
        let local = [...ALL_INITIAL_ITEMS];
        if (category && category !== 'all') {
          local = local.filter((item) => item.category === category);
        }
        if (search) {
          const s = search.toLowerCase();
          local = local.filter((item) => item.title.toLowerCase().includes(s) || item.description.toLowerCase().includes(s));
        }
        return local;
      }

      return combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<DashboardTab>) => {
      state.activeTab = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<Category | 'all'>) => {
      state.selectedCategory = action.payload;
    },
    setSelectedType: (state, action: PayloadAction<ContentType | 'all'>) => {
      state.selectedType = action.payload;
    },
    reorderFeedItems: (state, action: PayloadAction<ContentItem[]>) => {
      state.items = action.payload;
      state.userOrderIds = action.payload.map((item) => item.id);
    },
    resetCustomOrder: (state) => {
      state.userOrderIds = [];
      state.items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    receiveLiveItem: (state, action: PayloadAction<ContentItem>) => {
      // Avoid duplicate IDs
      if (!state.items.some((i) => i.id === action.payload.id) &&
          !state.livePendingItems.some((i) => i.id === action.payload.id)) {
        state.livePendingItems.unshift(action.payload);
      }
    },
    applyPendingLiveItems: (state) => {
      state.items = [...state.livePendingItems, ...state.items];
      state.livePendingItems = [];
    },
    setActiveModalItem: (state, action: PayloadAction<ContentItem | null>) => {
      state.activeModalItem = action.payload;
    },
    setAudioPlayerState: (
      state,
      action: PayloadAction<{ isPlaying: boolean; currentTrackTitle?: string; audioUrl?: string }>
    ) => {
      state.audioPlayerState = action.payload;
    },
    loadMoreItems: (state, action: PayloadAction<ContentItem[]>) => {
      const existingIds = new Set(state.items.map((i) => i.id));
      const newUnique = action.payload.filter((i) => !existingIds.has(i.id));
      state.items.push(...newUnique);
      state.page += 1;
      if (newUnique.length === 0) {
        state.hasMore = false;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnifiedContent.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUnifiedContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        // If user had a custom reorder, prioritize items according to userOrderIds
        if (state.userOrderIds.length > 0) {
          const orderMap = new Map(state.userOrderIds.map((id, idx) => [id, idx]));
          state.items.sort((a, b) => {
            const idxA = orderMap.get(a.id);
            const idxB = orderMap.get(b.id);
            if (idxA !== undefined && idxB !== undefined) return idxA - idxB;
            if (idxA !== undefined) return -1;
            if (idxB !== undefined) return 1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
        }
      })
      .addCase(fetchUnifiedContent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Failed to fetch content';
      });
  },
});

export const {
  setActiveTab,
  setSelectedCategory,
  setSelectedType,
  reorderFeedItems,
  resetCustomOrder,
  receiveLiveItem,
  applyPendingLiveItems,
  setActiveModalItem,
  setAudioPlayerState,
  loadMoreItems,
} = contentSlice.actions;

export default contentSlice.reducer;
