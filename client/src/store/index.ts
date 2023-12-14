import { configureStore } from '@reduxjs/toolkit';
import { themeReducer } from '../domain/theme/stores/theme.reducer';
import { appReducer } from '../domain/app';
import { adminReducer } from '../domain/admin';
import { fileOpsReducer } from '@/domain/files/stores/file.reducer';

export const store = configureStore({
  reducer: {
    themeStore: themeReducer,
    app: appReducer,
    adminStore: adminReducer,
    fileOperationsStor: fileOpsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
