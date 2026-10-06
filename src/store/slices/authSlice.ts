import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from '@/types/user';

interface AuthState {
  user: UserProfile;
  isAuthenticated: boolean;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr-101',
  name: 'Alex Rivera',
  email: 'alex.rivera@synthetica.io',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  role: 'Principal Systems Architect',
  bio: 'Building autonomous distributed intelligence and spatial rendering systems. Open-source maintainer.',
  location: 'San Francisco, CA',
  joinedDate: 'March 2024',
};

const initialState: AuthState = {
  user: DEFAULT_USER,
  isAuthenticated: true,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ name: string; email: string }>) => {
      state.user.name = action.payload.name;
      state.user.email = action.payload.email;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { login, logout, updateProfile } = authSlice.actions;

export default authSlice.reducer;
