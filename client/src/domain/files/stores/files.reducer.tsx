import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import {
  BreadCrumb,
  DataTableBucket,
  DataTableFile,
  DataTableType,
  FilesState,
  defaultBreadcrumbs,
} from '../types/files.types';
import {
  handleBucketClickAsync,
  handleCrumbClickAsync,
  handleFolderClickAsync,
  loadBucketsAsync,
} from './files.async.actions';

const initialState: FilesState = {
  loading: false,
  error: false,
  errorMsg: '',
  breadCrumbs: defaultBreadcrumbs,
  currentBucket: '',
  dataTable: 'idle',
  buckets: [],
  files: [],
};

const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    addBreadCrumb: (state, action: PayloadAction<BreadCrumb>) => {
      state.breadCrumbs.push(action.payload);
    },
    setBreadCrumbs: (state, action: PayloadAction<BreadCrumb[]>) => {
      state.breadCrumbs = action.payload;
    },
    setDatatableType: (state, action: PayloadAction<DataTableType>) => {
      state.dataTable = action.payload;
    },
    setDatatableBuckets: (state, action: PayloadAction<DataTableBucket[]>) => {
      state.breadCrumbs = defaultBreadcrumbs;
      state.files = [];
      state.currentBucket = '';
      state.dataTable = 'buckets';
      state.buckets = action.payload;
    },
    setDatatableFiles: (state, action: PayloadAction<DataTableFile[]>) => {
      state.dataTable = 'files';
      state.files = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = true;
      state.errorMsg = action.payload;
    },
    dismissError: (state) => {
      state.error = false;
      state.errorMsg = '';
    },
    setAfterBucketClick: (
      state,
      action: PayloadAction<{
        bucket: DataTableBucket;
        files: DataTableFile[];
        newCrumb: BreadCrumb;
      }>
    ) => {
      const { bucket, files, newCrumb } = action.payload;
      state.currentBucket = bucket.id;
      state.dataTable = 'files';
      state.breadCrumbs.push(newCrumb);
      state.files = files;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(handleCrumbClickAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(handleCrumbClickAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(handleCrumbClickAsync.rejected, (state) => {
        state.loading = false;
      })
      .addCase(handleFolderClickAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(handleFolderClickAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(handleFolderClickAsync.rejected, (state) => {
        state.loading = false;
      })
      .addCase(loadBucketsAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadBucketsAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(loadBucketsAsync.rejected, (state) => {
        state.loading = false;
      })
      .addCase(handleBucketClickAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(handleBucketClickAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(handleBucketClickAsync.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const filesReducer = filesSlice.reducer;

export const {
  setError,
  dismissError,
  addBreadCrumb,
  setBreadCrumbs,
  setDatatableType,
  setDatatableBuckets,
  setDatatableFiles,
  setAfterBucketClick,
} = filesSlice.actions;

export const selectFilesLoading = (state: RootState) => state.files.loading;
export const selectFilesError = (state: RootState) => state.files.error;
export const selectFilesErrorMsg = (state: RootState) => state.files.errorMsg;
export const selectBreadCrumbs = (state: RootState) => state.files.breadCrumbs;
export const selectDatatableType = (state: RootState) => state.files.dataTable;
export const selectFiles = (state: RootState) => state.files.files;
export const selectBuckets = (state: RootState) => state.files.buckets;
export const selectCurrentBucket = (state: RootState) =>
  state.files.currentBucket;
