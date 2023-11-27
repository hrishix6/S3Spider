import { fileColumns, bucketColumns } from './file-data-table/colums';
import { FileDataTable } from './file-data-table/data-table';
import { FileBreadcrumbs } from './breadcrumbs/file.breadcrumbs';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  selectBuckets,
  selectDatatableType,
  selectFiles,
  selectFilesLoading,
} from '../stores/files.reducer';
import { Spinner } from '@/components/ui/spinner';
import { useEffect } from 'react';
import { loadBucketsAsync } from '../stores/files.async.actions';
import { selectCurrentAwsAccount } from '../../app';

export function Files() {
  const dispatch = useAppDispatch();
  const selectedAwsAccount = useAppSelector(selectCurrentAwsAccount);
  const dataLoading = useAppSelector(selectFilesLoading);
  const dataTableType = useAppSelector(selectDatatableType);
  const files = useAppSelector(selectFiles);
  const buckets = useAppSelector(selectBuckets);

  useEffect(() => {
    if (selectedAwsAccount) {
      dispatch(loadBucketsAsync());
    }
  }, [selectedAwsAccount]);

  let tableComp;
  switch (dataTableType) {
    case 'idle':
      tableComp = <></>;
      break;
    case 'files':
      tableComp = <FileDataTable columns={fileColumns} data={files} />;
      break;
    case 'buckets':
      tableComp = <FileDataTable columns={bucketColumns} data={buckets} />;
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
