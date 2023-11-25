import { createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "@/lib/http.client";
import {addBreadCrumb, setAfterBucketClick, setBreadCrumbs, setDatatableBuckets, setDatatableFiles} from "./files.reducer";
import { RootState } from "@/lib/store";
import { BreadCrumb, Bucket, DataTableBucket, DataTableFile, File } from "../types";

async function getBuckets(accountId: string) {

    try {
        const response = await client.get(`s3/${accountId}/buckets`);

        const {success, data} = response.data;

        if(success)
        {
            return data;
        }

        return null;

    } catch (error) {
        console.log(error);
        return null;
    }
}

async function getChildren(accountId: string, bucketId: string, prefix?: string) {
    try {
        const params: Record<string,string> = {bucket: bucketId, key: prefix || ""};

        const q = new URLSearchParams(params).toString();

        const response = await client.get(`s3/${accountId}/files${q ? `?${q}`: ""}`);

        const {success, data} = response.data;
        
        if(success)
        {
            return data;
        }

        return null;

    } catch (error) {
        console.log(error);
        return null;
    }
}

function toDataTableBuckets(buckets: Bucket[]): DataTableBucket[] {
    return buckets.map(x=> ({
        id: x.name,
        name: x.name,
        createdAt: x.createdAt
    }));
}

function toDataTableFiles(files: File[]): DataTableFile[] {
    return files.map(x => ({
             id: x.key,
             name: x.name,
             key: x.key,
             mimeType: x.mimeType,
             lastModifiedAt: x.lastModifiedAt,
             size: x.size,
             kind: x.kind
        }));
}


export const handleCrumbClickAsync = createAsyncThunk<void,string>("files/handleCrumbClickAsync", async (key, thunkAPI) => {
    const  {getState, dispatch} = thunkAPI

    const rootState= getState() as RootState;
    const {breadCrumbs, currentAccount, currentBucket} = rootState.files;

    const clickedCrumbIndex = breadCrumbs.findIndex(x=> x.key === key);
    
    if(clickedCrumbIndex < 0)
    {
        return;
    }

    const clickedCrumb = breadCrumbs[clickedCrumbIndex];

    const newCrumbs = breadCrumbs.slice(0, clickedCrumbIndex + 1);

    dispatch(setBreadCrumbs(newCrumbs));

    const {target} = clickedCrumb;


    if(target == "root")
    {
        const buckets = await getBuckets(currentAccount);
        if(buckets)
        {
            dispatch(setDatatableBuckets(toDataTableBuckets(buckets)));
        }
    }
    else
    {
        if(target == "bucket")
        {
            const results = await getChildren(currentAccount,currentBucket);
            if(results)
            {
                dispatch(setDatatableFiles(toDataTableFiles(results)));
            }
        }
        else if(target == "folder")
        {
           const results = await getChildren(currentAccount, currentBucket, key);
           if(results)
           {
               dispatch(setDatatableFiles(toDataTableFiles(results)));
           }
        }
    }

});


export const handleFolderClickAsync = createAsyncThunk<void, DataTableFile>("files/handleCellClickAsync", async(folder, thunkAPI)=> {

    const {dispatch, getState} = thunkAPI;

    const {files: fileState} = getState() as RootState;

    const {currentAccount, currentBucket} = fileState;

    const {key, name} = folder;

    const files = await getChildren(currentAccount, currentBucket, key);

    const newBreadCrumb: BreadCrumb = {
        key,
        target: "folder",
        text: name
    };

    if(files)
    {
        dispatch(setDatatableFiles(toDataTableFiles(files)));
        dispatch(addBreadCrumb(newBreadCrumb));
    }

});


export const handleBucketClickAsync = createAsyncThunk<void, DataTableBucket>("files/handleBucketClickAsync", async(bucket, thunkAPI)=> {

    const {dispatch, getState} = thunkAPI;

    const {files: fileState} = getState() as RootState;

    const {currentAccount} = fileState;

    const {id, name} = bucket;

    const newBreadCrumb: BreadCrumb = {
        key: id,
        text: name,
        target: "bucket"
    };

    const files = await getChildren(currentAccount,id);

    if(files)
    {
        dispatch(setAfterBucketClick({
            bucket,
            newCrumb: newBreadCrumb,
            files: toDataTableFiles(files)
        }));
    }

});

export const loadBucketsAsync = createAsyncThunk<void,void>("files/loadBucketsAsync", async(_, thunkAPI) => {

    const {dispatch, getState} = thunkAPI;

    const rootstate = getState() as RootState;

    const {currentAccount} = rootstate.files;

    const buckets = await getBuckets(currentAccount);

    if(buckets)
    {
        dispatch(setDatatableBuckets(toDataTableBuckets(buckets)));
    }
});