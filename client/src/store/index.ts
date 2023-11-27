import { configureStore } from '@reduxjs/toolkit'
import { themeReducer } from '../domain/theme/stores/theme.reducer';
import { appReducer } from '../domain/app';
import { filesReducer } from '../domain/files';
import { adminReducer } from '../domain/admin';

export const store = configureStore({
    reducer: {
        themeStore: themeReducer,
        app: appReducer,
        files: filesReducer,
        adminStore: adminReducer
    }
});


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch