import { configureStore } from '@reduxjs/toolkit';
import preferencesReducer from './slices/preferencesSlice';
import contentReducer from './slices/contentSlice';
import favoritesReducer from './slices/favoritesSlice';
import searchReducer from './slices/searchSlice';
import authReducer from './slices/authSlice';
import notificationsReducer from './slices/notificationsSlice';
import { localStorageMiddleware } from './middleware/localStorageMiddleware';

export const makeStore = () => {
  return configureStore({
    reducer: {
      preferences: preferencesReducer,
      content: contentReducer,
      favorites: favoritesReducer,
      search: searchReducer,
      auth: authReducer,
      notifications: notificationsReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(localStorageMiddleware),
  });
};

export const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
