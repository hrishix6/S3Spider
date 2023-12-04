import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { initAppDataAsync } from './app.async.actions';
import { RootState } from '@/store';
import { AppState, UserInfo } from '../types/app.types';

const initialState: AppState = {
  awsAccounts: [],
  noAccounts: false,
  currentAccount: '',
  loading: false,
  error: false,
  mobileSidebar: false,
  role: 'none',
  errorMessage: '',
  isAuthenticated: false,
  userId: -1,
  sessionEnded: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleMobileSidebar: (state, action: PayloadAction<boolean>) => {
      state.mobileSidebar = action.payload;
    },
    setSessionEnded: (state)=> {
      state.sessionEnded = true;
    },
    sessionEndedConfirmation: (state)=> {
      localStorage.removeItem('token');
      state.awsAccounts = [];
      state.noAccounts = false;
      state.currentAccount = '';
      state.loading = false;
      state.error = false;
      state.mobileSidebar = false;
      state.role = 'none';
      state.errorMessage = '';
      state.isAuthenticated = false;
      state.userId = -1;
      state.sessionEnded = false;
    },
    loginSuccess: (state, action: PayloadAction<UserInfo>) => {
      const { id, role, verified, accounts } = action.payload;
      if (!verified) {
        state.error = true;
        state.errorMessage = 'Your account is pending verification by admin.';
      } else {
        state.isAuthenticated = true;
        state.userId = id;
        state.role = role;

        if (accounts.length) {
          state.awsAccounts = accounts;
          state.currentAccount = accounts[0].aws_id;
        } else {
          state.noAccounts = true;
        }
      }
    },
    logout: (state) => {
      localStorage.removeItem('token');
      state.awsAccounts = [];
      state.noAccounts = false;
      state.currentAccount = '';
      state.loading = false;
      state.error = false;
      state.mobileSidebar = false;
      state.role = 'none';
      state.errorMessage = '';
      state.isAuthenticated = false;
      state.userId = -1;
    },
    setCurrentAwsAccount: (state, action: PayloadAction<string>) => {
      state.currentAccount = action.payload;
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
  setCurrentAwsAccount,
} = appSlice.actions;

export const selectUserRole = (state: RootState) => state.app.role;
export const selectCurrentAwsAccount = (state: RootState) =>
  state.app.currentAccount;
export const selectAppLoading = (state: RootState) => state.app.loading;
export const selectAppError = (state: RootState) => state.app.error;
export const selectErrorMessage = (state: RootState) => state.app.errorMessage;
export const selectIsAuthenticated = (state: RootState) =>
  state.app.isAuthenticated;
export const selectUserAwsAccounts = (state: RootState) =>
  state.app.awsAccounts;
export const selectIfNoaccounts = (state: RootState) => state.app.noAccounts;
export const selectAppSessionEnded = (state: RootState)=> state.app.sessionEnded;
