import {fileColumns, bucketColumns} from "./file-browser/colums";
import {DataTable} from "./file-browser/data-table";
import { Breadcrumbs } from "./breadcrumbs";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectBuckets, selectDatatableType, selectFiles, selectFilesLoading } from "./redux/files.reducer";
import { FileSpinner } from "./file.spinner";
import { useEffect } from "react";
import { loadBucketsAsync } from "./redux/files.async.actions";

export function Files() {
    const dispatch = useAppDispatch();
    const dataLoading = useAppSelector(selectFilesLoading);
    const dataTableType = useAppSelector(selectDatatableType);
    const files = useAppSelector(selectFiles);
    const buckets = useAppSelector(selectBuckets);

    let tableComp;

    useEffect(()=> {
        dispatch(loadBucketsAsync());
    },[]);

    switch(dataTableType)
    {
        case "idle":
            tableComp = <></>;
            break;
        case "files":
            tableComp = <DataTable columns={fileColumns} data={files} />;
            break;
        case "buckets":
            tableComp = <DataTable columns={bucketColumns} data={buckets} />
            break;
        default:
            tableComp = <></>;
            break;
    }

    return (
        <section className="mt-4 flex flex-col flex-1 overflow-hidden gap-4">
        <Breadcrumbs />
        <div className="bg-background flex-1 flex flex-col overflow-hidden relative">
            {dataLoading? (<FileSpinner />): (tableComp)}
        </div>
        </section>
    )
}
