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
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  clearBeforeInitialLoad,
  nextPageLoaded,
  prevPageLoaded,
  selectIsNoNext,
  selectIsNoPrev,
  selectPrevKey,
} from '../stores/file.reducer';

export function Files() {
  const { accountId, bucketId } = useParams();
  const dispatch = useAppDispatch();
  const userRole = useAppSelector(selectUserRole);
  const location = useLocation();
  const { search } = location;
  const query = new URLSearchParams(search);
  const [loading, setLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<DataTableFile[]>([]);
  const noPrevPage = useAppSelector(selectIsNoPrev);
  const noNextPage = useAppSelector(selectIsNoNext);
  const prevKey = useAppSelector(selectPrevKey);

  const prefix = query.get('prefix');
  const region = query.get('region');

  async function loadData(ignoreCache?: boolean) {
    setLoading(true);
    dispatch(clearBeforeInitialLoad());
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
      const { done, files } = result.data;
      setFiles(toDataTableFiles(files));
      dispatch(nextPageLoaded({ done, lastKey: undefined }));
    } catch (error) {
      const e = error as AppErrorCode;
      toast.error(getToastErrorMessage(e), {
        className: 'bg-background text-foreground',
      });
    } finally {
      setLoading(false);
    }
  }

  async function loadNextPage(ignoreCache?: boolean) {
    setLoading(true);
    const lastKey = files[files.length - 1]?.key;
    try {
      const result = await getChildren(
        accountId!,
        region,
        bucketId!,
        prefix,
        ignoreCache,
        lastKey
      );

      if (!result.success) {
        toast.error(`Coudn't load files.`, {
          className: 'bg-background text-foreground',
        });
        return;
      }
      const { files, done } = result.data;
      setFiles(toDataTableFiles(files));
      dispatch(nextPageLoaded({ done, lastKey }));
    } catch (error) {
      const e = error as AppErrorCode;
      toast.error(getToastErrorMessage(e), {
        className: 'bg-background text-foreground',
      });
    } finally {
      setLoading(false);
    }
  }

  async function loadPrevPage(ignoreCache?: boolean) {
    setLoading(true);
    const lastKey = prevKey;
    try {
      const result = await getChildren(
        accountId!,
        region,
        bucketId!,
        prefix,
        ignoreCache,
        lastKey
      );

      if (!result.success) {
        toast.error(`Coudn't load files.`, {
          className: 'bg-background text-foreground',
        });
        return;
      }
      const { files, done } = result.data;
      setFiles(toDataTableFiles(files));
      dispatch(prevPageLoaded(done));
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
            handleNext={loadNextPage}
            handlePrev={loadPrevPage}
            noPrev={noPrevPage}
            noNext={noNextPage}
          />
        )}
      </div>
    </section>
  );
}
