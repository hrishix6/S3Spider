import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { initAppDataAsync } from './app.async.actions';
import { RootState } from '@/store';
import { AppState, UserInfo } from '../types/app.types';

const initialState: AppState = {
  awsAccounts: [],
  noAccounts: false,
  loading: false,
  error: false,
  mobileSidebar: false,
  role: 'none',
  errorMessage: '',
  isAuthenticated: false,
  userId: -1,
  sessionEnded: false,
  userName: '',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleMobileSidebar: (state, action: PayloadAction<boolean>) => {
      state.mobileSidebar = action.payload;
    },
    setSessionEnded: (state) => {
      state.sessionEnded = true;
    },
    sessionEndedConfirmation: (state) => {
      localStorage.removeItem('token');
      state.awsAccounts = [];
      state.noAccounts = false;
      state.loading = false;
      state.error = false;
      state.mobileSidebar = false;
      state.role = 'none';
      state.errorMessage = '';
      state.isAuthenticated = false;
      state.userId = -1;
      state.sessionEnded = false;
      state.userName = '';
    },
    loginSuccess: (state, action: PayloadAction<UserInfo>) => {
      const { id, role, verified, accounts, username } = action.payload;
      if (!verified) {
        state.error = true;
        state.errorMessage = 'Your account is pending verification by admin.';
      } else {
        state.isAuthenticated = true;
        state.userId = id;
        state.role = role;
        state.userName = username;

        if (accounts.length) {
          state.awsAccounts = accounts;
        } else {
          state.noAccounts = true;
        }
      }
    },
    logout: (state) => {
      localStorage.removeItem('token');
      state.awsAccounts = [];
      state.noAccounts = false;
      state.loading = false;
      state.error = false;
      state.mobileSidebar = false;
      state.role = 'none';
      state.errorMessage = '';
      state.isAuthenticated = false;
      state.userId = -1;
      state.userName = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initAppDataAsync.rejected, (state) => {
        state.error = true;
        state.loading = false;
      })
      .addCase(initAppDataAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(initAppDataAsync.pending, (state) => {
        state.loading = true;
      });
  },
});
export const appReducer = appSlice.reducer;
export const {
  sessionEndedConfirmation,
  setSessionEnded,
  toggleMobileSidebar,
  logout,
  loginSuccess,
} = appSlice.actions;

export const selectUserRole = (state: RootState) => state.app.role;
export const selectAppLoading = (state: RootState) => state.app.loading;
export const selectAppError = (state: RootState) => state.app.error;
export const selectErrorMessage = (state: RootState) => state.app.errorMessage;
export const selectIsAuthenticated = (state: RootState) =>
  state.app.isAuthenticated;
export const selectUserAwsAccounts = (state: RootState) =>
  state.app.awsAccounts;
export const selectIfNoaccounts = (state: RootState) => state.app.noAccounts;
export const selectAppSessionEnded = (state: RootState) =>
  state.app.sessionEnded;
export const selectUsername = (state: RootState) => state.app.userName;
