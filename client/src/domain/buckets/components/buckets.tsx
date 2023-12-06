import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBuckets } from '../api';
import toast from 'react-hot-toast';
import { toDataTableBuckets } from '../utils';
import { AppErrorCode, getToastErrorMessage } from '../../app';
import { DataTableBucket } from '../types';
import { BucketDataTable } from './bucket-data-table/bucket.data-table';
import { Spinner } from '@/components/ui/spinner';
import { bucketColumns } from './bucket-data-table/bucket.columns';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

export function Buckets() {
  const { accountId } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [buckets, setBuckets] = useState<DataTableBucket[]>([]);

  async function loadData(ingoreCache: boolean = false) {
    setLoading(true);
    try {
      const result = await getBuckets(accountId!, ingoreCache);

      if (!result.success) {
        toast.error(`Coudn't load buckets.`, {
          className: 'bg-background text-foreground',
        });
        return;
      }
      setBuckets(toDataTableBuckets(result.data));
    } catch (error) {
      const e = error as AppErrorCode;
      toast.error(getToastErrorMessage(e), {
        className: 'bg-background text-foreground',
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <section className="mt-4 flex flex-col flex-1 overflow-hidden gap-4">
      <Breadcrumbs />
      <div className="bg-background flex-1 flex flex-col overflow-hidden relative">
        {loading ? (
          <Spinner />
        ) : (
          <BucketDataTable
            loading={loading}
            reload={loadData}
            columns={bucketColumns}
            data={buckets}
          />
        )}
      </div>
    </section>
  );
}
