import { fileColumns } from './file-data-table/files.colums';
import { FileDataTable } from './file-data-table/files.data-table';
import { Spinner } from '@/components/ui/spinner';
import { useEffect, useState } from 'react';
import { AppErrorCode, getToastErrorMessage, selectUserRole } from '../../app';
import toast from 'react-hot-toast';
import { useLocation, useParams } from 'react-router-dom';
import { DataTableFile } from '../types/files.types';
import { getChildren } from '../api';
import { toDataTableFiles } from '../utils';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { useAppSelector } from '@/hooks';

export function Files() {
  const { accountId, bucketId } = useParams();
  const userRole = useAppSelector(selectUserRole);
  const location = useLocation();
  const { search } = location;
  const query = new URLSearchParams(search);
  const [loading, setLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<DataTableFile[]>([]);

  const prefix = query.get('prefix');
  const region = query.get('region');

  async function loadData(ignoreCache?: boolean) {
    setLoading(true);
    try {
      const result = await getChildren(
        accountId!,
        region,
        bucketId!,
        prefix,
        ignoreCache
      );
      if (!result.success) {
        toast.error(`Coudn't load files.`, {
          className: 'bg-background text-foreground',
        });
        return;
      }
      setFiles(toDataTableFiles(result.data));
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
  }, [prefix]);

  return (
    <section className="mt-4 flex flex-col flex-1 overflow-hidden gap-4">
      <Breadcrumbs />
      <div className="bg-background flex-1 flex flex-col overflow-hidden relative">
        {loading ? (
          <Spinner />
        ) : (
          <FileDataTable
            loading={loading}
            columns={
              userRole == 'viewer'
                ? fileColumns.filter((x) => x.id !== 'select')
                : fileColumns
            }
            data={files}
            reload={loadData}
          />
        )}
      </div>
    </section>
  );
}
