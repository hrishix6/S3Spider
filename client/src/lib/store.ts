import { configureStore } from '@reduxjs/toolkit'
import { themeReducer } from '../domain/theme/redux/theme.reducer';
import { appReducer } from '../domain/app/redux/app.reducer';
import { filesReducer } from '../domain/files/redux/files.reducer';

export const store = configureStore({
    reducer: {
        themeStore: themeReducer,
        app: appReducer,
        files: filesReducer
    }
});


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch