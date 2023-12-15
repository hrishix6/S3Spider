import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { DataTableFile } from '../types/files.types';
import { RootState } from '@/store';

interface FileOperationsState {
  currentFile: DataTableFile | null;
}

const initialState: FileOperationsState = {
  currentFile: null,
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
  },
});

export const fileOpsReducer = fileOpsSlice.reducer;

export const { setCurrentFile, clearCurrentFile } = fileOpsSlice.actions;

export const selectCurrentFile = (state: RootState) =>
  state.fileOperationsStor.currentFile;
