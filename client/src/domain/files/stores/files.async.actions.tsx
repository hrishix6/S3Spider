import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  addBreadCrumb,
  setAfterBucketClick,
  setBreadCrumbs,
  setDatatableBuckets,
  setDatatableFiles,
  setError,
} from './files.reducer';
import { RootState } from '@/store';
import {
  BreadCrumb,
  DataTableBucket,
  DataTableFile,
} from '../types/files.types';
import { getBuckets, getChildren } from '../api';
import { toDataTableBuckets, toDataTableFiles } from '../utils';

export const handleCrumbClickAsync = createAsyncThunk<void, string>(
  'files/handleCrumbClickAsync',
  async (key, thunkAPI) => {
    const { getState, dispatch } = thunkAPI;

    const rootState = getState() as RootState;
    const { currentAccount } = rootState.app;
    const { breadCrumbs, currentBucket } = rootState.files;

    if (!currentAccount) {
      return;
    }

    const clickedCrumbIndex = breadCrumbs.findIndex((x) => x.key === key);

    if (clickedCrumbIndex < 0) {
      return;
    }

    const clickedCrumb = breadCrumbs[clickedCrumbIndex];

    const newCrumbs = breadCrumbs.slice(0, clickedCrumbIndex + 1);

    const { target } = clickedCrumb;

    if (target == 'root') {
      const buckets = await getBuckets(currentAccount);
      if (buckets) {
        dispatch(setBreadCrumbs(newCrumbs));
        dispatch(setDatatableBuckets(toDataTableBuckets(buckets)));
      } else {
        dispatch(setError("Couldn't load buckets under this account"));
      }
    } else {
      if (target == 'bucket') {
        const results = await getChildren(currentAccount, currentBucket);
        if (results) {
          dispatch(setBreadCrumbs(newCrumbs));
          dispatch(setDatatableFiles(toDataTableFiles(results)));
        } else {
          dispatch(setError("Couldn't load files under this bucket"));
        }
      } else if (target == 'folder') {
        const results = await getChildren(currentAccount, currentBucket, key);
        if (results) {
          dispatch(setBreadCrumbs(newCrumbs));
          dispatch(setDatatableFiles(toDataTableFiles(results)));
        } else {
          dispatch(setError("Couldn't load files under this folder"));
        }
      }
    }
  }
);

export const handleFolderClickAsync = createAsyncThunk<void, DataTableFile>(
  'files/handleCellClickAsync',
  async (folder, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;

    const { app, files: fileState } = getState() as RootState;

    const { currentAccount } = app;
    const { currentBucket } = fileState;

    if (!currentAccount) {
      return;
    }

    const { key, name } = folder;

    const files = await getChildren(currentAccount, currentBucket, key);

    const newBreadCrumb: BreadCrumb = {
      key,
      target: 'folder',
      text: name,
    };

    if (files) {
      dispatch(setDatatableFiles(toDataTableFiles(files)));
      dispatch(addBreadCrumb(newBreadCrumb));
    } else {
      dispatch(setError("Couldn't load files under this folder"));
    }
  }
);

export const handleBucketClickAsync = createAsyncThunk<void, DataTableBucket>(
  'files/handleBucketClickAsync',
  async (bucket, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;

    const { app } = getState() as RootState;

    const { currentAccount } = app;

    if (!currentAccount) {
      return;
    }

    const { id, name } = bucket;

    const newBreadCrumb: BreadCrumb = {
      key: id,
      text: name,
      target: 'bucket',
    };

    const files = await getChildren(currentAccount, id);

    if (files) {
      dispatch(
        setAfterBucketClick({
          bucket,
          newCrumb: newBreadCrumb,
          files: toDataTableFiles(files),
        })
      );
    } else {
      dispatch(setError("Couldn't load files under this bucket"));
    }
  }
);

export const loadBucketsAsync = createAsyncThunk<void, void>(
  'files/loadBucketsAsync',
  async (_, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;

    const rootstate = getState() as RootState;

    const { currentAccount } = rootstate.app;

    if (!currentAccount) {
      return;
    }

    const buckets = await getBuckets(currentAccount);

    if (!buckets) {
      dispatch(setDatatableBuckets([]));
      dispatch(setError("Couldn't load buckets under this account"));
      return;
    }

    dispatch(setDatatableBuckets(toDataTableBuckets(buckets)));
  }
);
