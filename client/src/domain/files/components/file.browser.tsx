import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { AppErrorCode, getToastErrorMessage } from '@/domain/app';
import { useAppSelector } from '@/hooks';
import { useEffect, useState } from 'react';
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { DataTableFile } from '../types/files.types';
import { copyFile, getChildren, moveFile } from '../api';
import toast from 'react-hot-toast';
import {
  getFileDirectoryPath,
  getFileExtension,
  toDataTableFiles,
} from '../utils';
import { Spinner } from '@/components/ui/spinner';
import { FileTable } from './file-data-table/table';
import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { fileColumns } from './file-data-table/files.colums';
import { Button } from '@/components/ui/button';
import { FileIcon, RotateCw } from 'lucide-react';
import { CopyFileDialogue } from './dialogues/copy.file.dialogue';
import { selectCurrentFile } from '../stores/file.reducer';

export function FileBrowser() {
  const { accountId, bucketId, operation } = useParams();
  const file = useAppSelector(selectCurrentFile);
  const navigate = useNavigate();
  const location = useLocation();
  const { search } = location;
  const query = new URLSearchParams(search);
  const [loading, setLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<DataTableFile[]>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [openCopyDialogue, setOpenCopyDialogue] = useState(false);
  const [disableOp, setDisableOp] = useState(false);

  const prefix = query.get('prefix');
  const region = query.get('region');

  const table = useReactTable({
    data: files,
    columns: fileColumns,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      rowSelection,
    },
  });

  useEffect(() => {
    loadData();
  }, [prefix]);

  useEffect(() => {
    const selected = table.getFilteredSelectedRowModel().rows;
    if (selected.length > 1) {
      setDisableOp(true);
    }
  }, [rowSelection]);

  async function loadData(ignoreCache?: boolean) {
    setLoading(true);
    try {
      const result = await getChildren(
        accountId!,
        region,
        bucketId!,
        prefix,
        ignoreCache,
        undefined,
        true
      );
      if (!result.success) {
        toast.error(`Coudn't load files.`, {
          className: 'bg-background text-foreground',
        });
        return;
      }
      const { files } = result.data;
      setFiles(toDataTableFiles(files));
    } catch (error) {
      const e = error as AppErrorCode;
      toast.error(getToastErrorMessage(e), {
        className: 'bg-background text-foreground',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy(original: DataTableFile, filename: string) {
    setOpenCopyDialogue(false);
    const toastId = toast.loading('Copying...', {
      className: 'bg-background text-foreground',
    });

    let finalDestination = '';

    const selected = table.getFilteredSelectedRowModel().rows[0]?.original;

    if (selected) {
      finalDestination = selected.key;
    } else {
      finalDestination = prefix || '';
    }

    try {
      const result = await copyFile(accountId!, region, bucketId!, {
        key: original.key,
        name: original.name,
        new_name: `${filename}.${getFileExtension(original.name) || ''}`,
        destination: finalDestination,
      });
      if (result) {
        toast.success(
          'Success! , It may take some time for changes to reflect.',
          { className: 'bg-background text-foreground', id: toastId }
        );
      }
    } catch (error) {
      const e = error as AppErrorCode;
      toast.error(getToastErrorMessage(e), {
        className: 'bg-background text-foreground',
        id: toastId,
      });
    } finally {
      handleRedirect();
    }
  }

  function handleCopyDialogue(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setOpenCopyDialogue(true);
  }

  async function handleMove(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setOpenCopyDialogue(false);
    const toastId = toast.loading('Moving...', {
      className: 'bg-background text-foreground',
    });

    let finalDestination = '';

    const selected = table.getFilteredSelectedRowModel().rows[0]?.original;

    if (selected) {
      finalDestination = selected.key;
    } else {
      finalDestination = prefix || '';
    }

    if (finalDestination === getFileDirectoryPath(file!.key)) {
      toast.error("Can't move file to same directory", {
        className: 'bg-background text-foreground',
        id: toastId,
      });
      return;
    }

    try {
      const result = await moveFile(accountId!, region, bucketId!, {
        key: file!.key,
        name: file!.name,
        destination: finalDestination,
      });
      if (result) {
        toast.success(
          'Success! , It may take some time for changes to reflect.',
          { className: 'bg-background text-foreground', id: toastId }
        );
      }
    } catch (error) {
      const e = error as AppErrorCode;
      toast.error(getToastErrorMessage(e), {
        className: 'bg-background text-foreground',
        id: toastId,
      });
    } finally {
      handleRedirect();
    }
  }

  function handleReload() {
    loadData(true);
  }

  function handleRedirect() {
    const encodedAccountId = encodeURIComponent(accountId!);
    const encodedBucketId = encodeURIComponent(bucketId!);
    const q = new URLSearchParams({
      prefix: prefix || '',
      region: region!,
    }).toString();
    const redirecURL = `/s3/${encodedAccountId}/buckets/${encodedBucketId}?${q}`;

    return navigate(redirecURL, { replace: true });
  }

  if (!operation) {
    return <Navigate to={'/404'} replace />;
  }

  if (!file) {
    return <Navigate to={'/404'} replace />;
  }

  if (!['copy', 'move', 'upload'].includes(operation)) {
    return <Navigate to={'/404'} replace />;
  }

  return (
    <section className="mt-4 flex flex-col flex-1 overflow-hidden gap-4">
      <Breadcrumbs disableBucket={true} />
      <div className="bg-background flex-1 flex flex-col overflow-hidden relative">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-base">
            Choose destination to {operation} file
            <span className="text-primary mx-2">{file?.name}</span>
          </p>
          <div className="flex items-center gap-2">
            <Button variant={'outline'} onClick={handleRedirect}>
              Cancel
            </Button>
            {operation == 'copy' && (
              <Button
                variant={'outline'}
                onClick={handleCopyDialogue}
                disabled={disableOp}
              >
                <FileIcon className="h-4 w-4 mr-2" /> Copy here
              </Button>
            )}
            {operation == 'move' && (
              <Button
                variant={'outline'}
                disabled={disableOp}
                onClick={handleMove}
              >
                <FileIcon className="h-4 w-4 mr-2" /> Move here
              </Button>
            )}
            {operation == 'upload' && (
              <Button variant={'outline'} disabled={disableOp}>
                <FileIcon className="h-4 w-4 mr-2" /> Upload here
              </Button>
            )}
            <Button
              variant={'link'}
              size={'icon'}
              onClick={handleReload}
              disabled={loading}
            >
              <RotateCw className="h-5 w-5" />
            </Button>
          </div>
        </div>
        {loading ? (
          <Spinner />
        ) : (
          <FileTable table={table} colSpan={fileColumns.length} />
        )}
      </div>
      <CopyFileDialogue
        open={openCopyDialogue}
        onClose={setOpenCopyDialogue}
        handleCopy={handleCopy}
        file={file}
      />
    </section>
  );
}
