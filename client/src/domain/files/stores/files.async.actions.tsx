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
import { AppErrorCode, getToastErrorMessage, setSessionEnded } from '@/domain/app';

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
      try {
        const result = await getBuckets(currentAccount);
        if(!result.success)
        {
          dispatch(setError("something went wrong"));
        }
        else
         {
          dispatch(setBreadCrumbs(newCrumbs));
          dispatch(setDatatableBuckets(toDataTableBuckets(result.data)));
         }
      } catch (error) {
        const e = error as AppErrorCode;
        switch(e)
          {
            case AppErrorCode.TOKEN_EXPIRED:
              dispatch(setSessionEnded());
              break;
            default:
              break;
          }
        dispatch(setError(getToastErrorMessage(e)));
      }
    } else {
      if (target == 'bucket') {
        try {
          const result = await getChildren(currentAccount, currentBucket);
        if (result.success) {
          dispatch(setBreadCrumbs(newCrumbs));
          dispatch(setDatatableFiles(toDataTableFiles(result.data)));
        } else {
          dispatch(setError("Couldn't load files under this bucket"));
        }
        } catch (error) {
          switch(error as AppErrorCode)
          {
            case AppErrorCode.TOKEN_EXPIRED:
              dispatch(setSessionEnded());
              break;
            default:
              break;
          }
          dispatch(setError(getToastErrorMessage(error as AppErrorCode)));
        }
        
      } else if (target == 'folder') {
        try {
          const result = await getChildren(currentAccount, currentBucket, key);
        if (result.success) {
          dispatch(setBreadCrumbs(newCrumbs));
          dispatch(setDatatableFiles(toDataTableFiles(result.data)));
        } else {
          dispatch(setError("Couldn't load files under this folder"));
        }
        } catch (error) {
          switch(error as AppErrorCode)
          {
            case AppErrorCode.TOKEN_EXPIRED:
              dispatch(setSessionEnded());
              break;
            default:
              break;
          }
          dispatch(setError(getToastErrorMessage(error as AppErrorCode)));
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

    try {
      const result = await getChildren(currentAccount, currentBucket, key);
      const newBreadCrumb: BreadCrumb = {
        key,
        target: 'folder',
        text: name,
      };

      if (result.success) {
        dispatch(setDatatableFiles(toDataTableFiles(result.data)));
        dispatch(addBreadCrumb(newBreadCrumb));
      } else {
        dispatch(setError("Couldn't load files under this folder"));
      }

    } catch (error) {
      switch(error as AppErrorCode)
          {
            case AppErrorCode.TOKEN_EXPIRED:
              dispatch(setSessionEnded());
              break;
            default:
              break;
          }
        dispatch(setError(getToastErrorMessage(error as AppErrorCode)));
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

    try {
      const result = await getChildren(currentAccount, id);

    if (result.success) {
      dispatch(
        setAfterBucketClick({
          bucket,
          newCrumb: newBreadCrumb,
          files: toDataTableFiles(result.data),
        })
      );
    } else {
      dispatch(setError("Couldn't load files under this bucket"));
    }
    } catch (error) {
      switch(error as AppErrorCode)
          {
            case AppErrorCode.TOKEN_EXPIRED:
              dispatch(setSessionEnded());
              break;
            default:
              break;
          }
       dispatch(setError(getToastErrorMessage(error as AppErrorCode)));
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

    try {
      const result = await getBuckets(currentAccount);

    if (!result.success) {
      dispatch(setDatatableBuckets([]));
      dispatch(setError("Couldn't load buckets under this account"));
      return;
    }
    else{
      dispatch(setDatatableBuckets(toDataTableBuckets(result.data)));
    }
    
    } catch (error) {
      switch(error as AppErrorCode)
          {
            case AppErrorCode.TOKEN_EXPIRED:
              dispatch(setSessionEnded());
              break;
            default:
              break;
          }
      dispatch(setError(getToastErrorMessage(error as AppErrorCode)));
    } 
    
  }
);
