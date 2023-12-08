import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import {
  DataTableFile,
  FileAction,
  MaxDownloadSizeExceededError,
} from '../../types/files.types';
import {
  calculateDownloadMetadata,
  downloadFilesAsync,
} from '../../utils/download.utils';
import { useLocation, useParams } from 'react-router-dom';
import { RotateCw } from 'lucide-react';
import { RenameFileDialogue } from '../dialogues/rename.file.dialogue';
import { CopyFileDialogue } from '../dialogues/copy.file.dialogue';
import { DeleteFileConfirmation } from '../dialogues/delete.file.confirmation';
import { copyFile, deleteFile, renameFile } from '../../api';
import {
  AppErrorCode,
  getToastErrorMessage,
  selectUserRole,
} from '../../../app';
import { getFileExtension } from '../../utils';
import { useAppSelector } from '@/hooks';

interface FileDataTableProps {
  columns: ColumnDef<DataTableFile>[];
  data: DataTableFile[];
  reload: (ingoreCache?: boolean) => Promise<void>;
  loading: boolean;
}

export function FileDataTable({
  columns,
  data,
  loading,
  reload,
}: FileDataTableProps) {
  const { accountId, bucketId } = useParams();
  const { search } = useLocation();
  const region = new URLSearchParams(search).get('region');
  const useRole = useAppSelector(selectUserRole);
  const [rowSelection, setRowSelection] = useState({});
  const [key, setKey] = useState('');
  const [globalFilter, setGlobalFilter] = useState('');
  const [allowedActions, setAllowedActions] = useState<FileAction[]>([]);
  const [openDeleteDialogue, setOpenDeleteDialogue] = useState(false);
  const [openCopyDialogue, setOpenCopyDialoguee] = useState(false);
  const [openRenameDialogue, setOpenRenameDialogue] = useState(false);

  useEffect(() => {
    const bouncer = setTimeout(() => {
      setGlobalFilter(key);
    }, 500);

    return () => {
      clearTimeout(bouncer);
    };
  }, [key]);

  const table = useReactTable({
    data,
    columns,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      rowSelection,
      globalFilter,
    },
  });

  useEffect(() => {
    const selected = table.getFilteredSelectedRowModel().rows;

    const newAllowedActions: FileAction[] = [];

    if (selected.length) {
      if (!selected.some((x) => x.original.kind == 'folder')) {
        if (selected.length == 1) {
          const actions: FileAction[] = ['cp', 'dl', 'mv', 'rename', 'rm'];
          newAllowedActions.push(...actions);
        } else {
          newAllowedActions.push('dl');
        }
      }
    }

    setAllowedActions(newAllowedActions);
  }, [rowSelection]);

  async function handleDownload(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const toastId = toast.loading('Downloading...', {
      className: 'bg-background text-foreground',
    });

    const selected = table
      .getFilteredSelectedRowModel()
      .rows.map((x) => x.original);
    try {
      const { files } = calculateDownloadMetadata(selected);
      await downloadFilesAsync(accountId!, region, bucketId!, files);
      toast.success('Done', {
        className: 'bg-background text-foreground',
        id: toastId,
      });
    } catch (error) {
      if (error instanceof MaxDownloadSizeExceededError) {
        toast.error('Download size exceeds maximum zip limit of 4GB', {
          className: 'bg-background text-foreground',
          id: toastId,
        });
        return;
      }
      toast.error('Failed to download, try again later.', {
        className: 'bg-background text-foreground',
        id: toastId,
      });
    }
  }
  async function handleCopy(original: DataTableFile, filename: string) {
    setOpenCopyDialoguee(false);
    const toastId = toast.loading('Copying...', {
      className: 'bg-background text-foreground',
    });
    try {
      const result = await copyFile(accountId!, region, bucketId!, {
        key: original.key,
        name: original.name,
        new_name: `${filename}.${getFileExtension(original.name) || ''}`,
      });
      if (result) {
        toast.success(
          'Success! , It may take some time for changes to reflect.',
          { className: 'bg-background text-foreground', id: toastId }
        );

        handleDataReload();
      }
    } catch (error) {
      const e = error as AppErrorCode;
      toast.error(getToastErrorMessage(e), {
        className: 'bg-background text-foreground',
        id: toastId,
      });
    }
  }
  async function handleDelete(file: DataTableFile) {
    setOpenDeleteDialogue(false);
    const toastId = toast.loading('Deleting...');
    try {
      const result = await deleteFile(accountId!, region, bucketId!, file.key);
      if (result) {
        toast.success(
          'Success! , It may take some time for changes to reflect.',
          { className: 'bg-background text-foreground', id: toastId }
        );

        handleDataReload();
      }
    } catch (error) {
      const e = error as AppErrorCode;
      toast.error(getToastErrorMessage(e), {
        className: 'bg-background text-foreground',
        id: toastId,
      });
    }
  }
  async function handleRename(original: DataTableFile, filename: string) {
    setOpenRenameDialogue(false);
    const toastId = toast.loading('Renaming...', {
      className: 'bg-background text-foreground',
    });
    try {
      const result = await renameFile(accountId!, region, bucketId!, {
        key: original.key,
        name: original.name,
        new_name: `${filename}.${getFileExtension(original.name) || ''}`,
      });
      if (result) {
        toast.success(
          'Success! , It may take some time for changes to reflect.',
          { className: 'bg-background text-foreground', id: toastId }
        );
        handleDataReload();
      }
    } catch (error) {
      const e = error as AppErrorCode;
      toast.error(getToastErrorMessage(e), {
        className: 'bg-background text-foreground',
        id: toastId,
      });
    }
  }

  function handleDataReload() {
    reload(true);
  }

  function handleDeleteDialogue(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setOpenDeleteDialogue(true);
  }

  function handleRenameDialogue(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setOpenRenameDialogue(true);
  }

  function handleCopyDialogue(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setOpenCopyDialoguee(true);
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2">
          <Input
            placeholder="Filter..."
            value={key}
            onChange={(event) => setKey(String(event.target.value))}
            className="focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <div className="hidden md:flex md:gap-2">
          {useRole !== 'viewer' && (
            <>
              <Button
                variant={'outline'}
                onClick={handleCopyDialogue}
                disabled={!allowedActions.includes('cp')}
              >
                Copy
              </Button>
              <Button
                variant={'outline'}
                onClick={handleRenameDialogue}
                disabled={!allowedActions.includes('rename')}
              >
                Rename
              </Button>
              <Button
                variant={'outline'}
                onClick={handleDeleteDialogue}
                disabled={!allowedActions.includes('rm')}
              >
                Delete
              </Button>
            </>
          )}
          <Button
            variant={'outline'}
            disabled={!allowedActions.includes('dl')}
            onClick={handleDownload}
          >
            Download
          </Button>
          <Button variant={'default'}>Upload</Button>
          <Button
            variant={'link'}
            size={'icon'}
            onClick={handleDataReload}
            disabled={loading}
          >
            <RotateCw className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <ScrollArea className="rounded-md border mt-2">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No Files
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
      <RenameFileDialogue
        open={openRenameDialogue}
        onClose={setOpenRenameDialogue}
        handleRename={handleRename}
        file={table.getFilteredSelectedRowModel().rows[0]?.original}
      />
      <CopyFileDialogue
        open={openCopyDialogue}
        onClose={setOpenCopyDialoguee}
        handleCopy={handleCopy}
        file={table.getFilteredSelectedRowModel().rows[0]?.original}
      />
      <DeleteFileConfirmation
        open={openDeleteDialogue}
        onClose={setOpenDeleteDialogue}
        handleDelete={handleDelete}
        file={table.getFilteredSelectedRowModel().rows[0]?.original}
      />
    </>
  );
}
