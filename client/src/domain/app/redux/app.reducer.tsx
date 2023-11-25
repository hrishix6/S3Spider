import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { initAppDataAsync } from './app.async.actions';
import { RootState } from '@/lib/store';


export interface UserInfo {
  id: number;
  verified: boolean;
  username: string;
  role: "admin" | "viewer" | "user"
}

interface AppState {
  loading: boolean;
  error: boolean;
  mobileSidebar: boolean;
  errorMessage: string;
  isAuthenticated: boolean;
  user: UserInfo | null
}

const initialState: AppState = {
  loading: true,
  error: false,
  mobileSidebar: false,
  errorMessage: "",
  isAuthenticated: false,
  user: null
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleMobileSidebar: (state, action: PayloadAction<boolean>) => {
      state.mobileSidebar = action.payload;
    },
    logout: (state)=> {
      localStorage.removeItem("token");
      state.user = null;
      state.isAuthenticated = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(initAppDataAsync.rejected, (state, action) => {
        const error = action.payload as Error;
        state.error = true;
        state.loading = false;
        state.errorMessage = error?.message;
      })
      .addCase(initAppDataAsync.fulfilled, (state, action) => {
        const {isAuthenticated, info} = action.payload;
        state.isAuthenticated = isAuthenticated;
        if(info)
        {
          state.user = info;
        }
        state.error = false;
        state.loading = false;
      });
  }
});

export const appReducer = appSlice.reducer;
export const { toggleMobileSidebar, logout } = appSlice.actions;

export const selectAppLoading = (state: RootState) => state.app.loading;
export const selectAppError = (state: RootState) => state.app.error;
export const selectShowMobilesidebar = (state: RootState) =>state.app.mobileSidebar;
export const selectErrorMessage = (state: RootState) => state.app.errorMessage;
export const selectIsAuthenticated = (state: RootState) => state.app.isAuthenticated;
export const selectUserInfo = (state: RootState) => state.app.user;