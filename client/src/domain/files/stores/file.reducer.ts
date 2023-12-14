import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { DataTableFile } from '../types/files.types';
import { RootState } from '@/store';

interface FileOperationsState {
  currentFile: DataTableFile | null;
  prevIndex: number;
  prevKeys: (string | undefined)[];
  done: boolean;
}

const initialState: FileOperationsState = {
  currentFile: null,
  prevIndex: -2,
  prevKeys: [],
  done: true,
};

const fileOpsSlice = createSlice({
  name: 'file-operations',
  initialState,
  reducers: {
    setCurrentFile: (state, action: PayloadAction<DataTableFile>) => {
      state.currentFile = action.payload;
    },
    clearCurrentFile: (state) => {
      state.currentFile = null;
    },
    clearBeforeInitialLoad: (state) => {
      state.prevIndex = -2;
      state.done = true;
      state.prevKeys = [];
    },
    nextPageLoaded: (
      state,
      action: PayloadAction<{ lastKey?: string; done: boolean }>
    ) => {
      const { lastKey, done } = action.payload;
      state.prevIndex++;
      state.prevKeys.push(lastKey);
      state.done = done;
    },
    prevPageLoaded: (state, action: PayloadAction<boolean>) => {
      state.done = action.payload;
      state.prevIndex--;
      state.prevKeys = state.prevKeys.slice(0, state.prevKeys.length - 1);
    },
  },
});

export const fileOpsReducer = fileOpsSlice.reducer;

export const {
  setCurrentFile,
  clearCurrentFile,
  nextPageLoaded,
  prevPageLoaded,
  clearBeforeInitialLoad,
} = fileOpsSlice.actions;

export const selectCurrentFile = (state: RootState) =>
  state.fileOperationsStor.currentFile;

export const selectIsNoNext = (state: RootState) =>
  state.fileOperationsStor.done;
export const selectPrevKey = (state: RootState) =>
  state.fileOperationsStor.prevKeys[state.fileOperationsStor.prevIndex];
export const selectIsNoPrev = (state: RootState) =>
  state.fileOperationsStor.prevIndex < 0;
