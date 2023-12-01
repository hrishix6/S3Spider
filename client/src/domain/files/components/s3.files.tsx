import { fileColumns } from './file-data-table/files.colums';
import { FileDataTable } from './file-data-table/files.data-table';
import { FileBreadcrumbs } from './breadcrumbs/file.breadcrumbs';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  dismissError,
  selectBuckets,
  selectDatatableType,
  selectFiles,
  selectFilesError,
  selectFilesErrorMsg,
  selectFilesLoading,
} from '../stores/files.reducer';
import { Spinner } from '@/components/ui/spinner';
import { useEffect } from 'react';
import { loadBucketsAsync } from '../stores/files.async.actions';
import { selectCurrentAwsAccount } from '../../app';
import { BucketDataTable } from './bucket-data-table/bucket.data-table';
import { bucketColumns } from './bucket-data-table/bucket.columns';
import toast from 'react-hot-toast';

export function Files() {
  const dispatch = useAppDispatch();
  const selectedAwsAccount = useAppSelector(selectCurrentAwsAccount);
  const dataLoading = useAppSelector(selectFilesLoading);
  const dataError = useAppSelector(selectFilesError);
  const dataErrorMsg = useAppSelector(selectFilesErrorMsg);
  const dataTableType = useAppSelector(selectDatatableType);
  const files = useAppSelector(selectFiles);
  const buckets = useAppSelector(selectBuckets);

  useEffect(() => {
    if (selectedAwsAccount) {
      dispatch(loadBucketsAsync());
    }
  }, [selectedAwsAccount]);

  useEffect(() => {
    if (dataError) {
      const errorToast = toast.error(dataErrorMsg, {
        className: 'bg-background text-foreground',
      });
      setTimeout(() => {
        dispatch(dismissError());
        toast.dismiss(errorToast);
      }, 4000);
    }
  }, [dataError]);

  let tableComp;
  switch (dataTableType) {
    case 'idle':
      tableComp = <></>;
      break;
    case 'files':
      tableComp = <FileDataTable columns={fileColumns} data={files} />;
      break;
    case 'buckets':
      tableComp = <BucketDataTable columns={bucketColumns} data={buckets} />;
      break;
    default:
      tableComp = <></>;
      break;
  }

  return (
    <section className="mt-4 flex flex-col flex-1 overflow-hidden gap-4">
      <FileBreadcrumbs />
      <div className="bg-background flex-1 flex flex-col overflow-hidden relative">
        {dataLoading ? <Spinner /> : tableComp}
      </div>
    </section>
  );
}
