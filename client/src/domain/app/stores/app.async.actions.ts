import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginSuccess } from "./app.reducer";
import { RootState } from "@/store";
import { getUserInfo } from "../api";

export const initAppDataAsync = createAsyncThunk<void, void>("app/initAppDataAsync", async (_, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const rootstate = getState() as RootState;
    const { isAuthenticated } = rootstate.app;
    if (isAuthenticated) {
        return;
    }

    const userInfo = await getUserInfo();

    if (!userInfo) {
        return;
    }

    dispatch(loginSuccess(userInfo));

});

