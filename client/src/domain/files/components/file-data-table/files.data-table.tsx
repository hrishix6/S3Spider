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
import toast from 'react-hot-toast';
import { DataTableFile, FileAction } from '../../types/files.types';
import { useLocation, useParams } from 'react-router-dom';
import { RenameFileDialogue } from '../dialogues/rename.file.dialogue';
import { CopyFileDialogue } from '../dialogues/copy.file.dialogue';
import { DeleteFileConfirmation } from '../dialogues/delete.file.confirmation';
import {
  copyFile,
  createFolder,
  deleteFile,
  deleteFolder,
  getDownloadUrls,
  renameFile,
} from '../../api';
import {
  AppErrorCode,
  getToastErrorMessage,
  selectUserRole,
} from '../../../app';
import { getFileExtension } from '../../utils';
import { useAppSelector } from '@/hooks';
import { DownloadFileDialogue } from '../dialogues/download.file.dialogue';
import { FileActionsHeader } from './file.actions';
import { CreateFolderDialogue } from '../dialogues/create.folder.dialogue';
import { DeleteFolderConfirmation } from '../dialogues/delete.folder.confirmation';

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
  const q = new URLSearchParams(search);
  const region = q.get('region');
  const prefix = q.get('prefix');
  const userRole = useAppSelector(selectUserRole);
  const [rowSelection, setRowSelection] = useState({});
  const [key, setKey] = useState('');
  const [globalFilter, setGlobalFilter] = useState('');
  const [allowedActions, setAllowedActions] = useState<FileAction[]>([]);
  const [openDeleteDialogue, setOpenDeleteDialogue] = useState(false);
  const [openCopyDialogue, setOpenCopyDialoguee] = useState(false);
  const [openRenameDialogue, setOpenRenameDialogue] = useState(false);
  const [openFileDLDialogue, setOpenFileDLDialogue] = useState(false);
  const [openFolderCreateDialogue, setOpenFolderCreateDialogue] =
    useState(false);
  const [openFolderDeleteDialogue, setOpenFolderDeleteDialogue] =
    useState(false);
  const [dlUrl, setdlUrl] = useState('');

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
          const actions: FileAction[] = ['cpf', 'dlf', 'renamef', 'mvf', '-f'];
          newAllowedActions.push(...actions);
        }
      } else {
        if (selected.length == 1) {
          const actions: FileAction[] = ['+d', '-d'];
          newAllowedActions.push(...actions);
        }
      }
    }

    setAllowedActions(newAllowedActions);
  }, [rowSelection]);

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
  async function handleDeleteFolder(folder: DataTableFile) {
    setOpenFolderDeleteDialogue(false);
    const toastId = toast.loading('Deleting...');
    try {
      const result = await deleteFolder(
        accountId!,
        region,
        bucketId!,
        folder.key
      );
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
  async function handleDownloadAs(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const toastId = toast.loading('Downloading...', {
      className: 'bg-background text-foreground',
    });

    const selected = table
      .getFilteredSelectedRowModel()
      .rows.map((x) => x.original);

    if (!selected.length) {
      return;
    }

    try {
      const result = await getDownloadUrls(
        accountId!,
        region,
        bucketId!,
        selected.map((x) => ({
          key: x.key,
          mimeType: x.mimeType!,
          name: x.name,
        }))
      );

      if (result.success) {
        setdlUrl(result.data[0].url);
        setOpenFileDLDialogue(true);
      }
    } catch (error) {
      toast.error('Failed to download, try again later.', {
        className: 'bg-background text-foreground',
        id: toastId,
      });
    } finally {
      toast.success('Done', {
        className: 'bg-background text-foreground',
        id: toastId,
      });
    }
  }
  async function handleDownload(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const toastId = toast.loading('Downloading...', {
      className: 'bg-background text-foreground',
    });

    const selected = table
      .getFilteredSelectedRowModel()
      .rows.map((x) => x.original);

    if (!selected.length) {
      return;
    }

    try {
      const result = await getDownloadUrls(
        accountId!,
        region,
        bucketId!,
        selected.map((x) => ({
          key: x.key,
          mimeType: x.mimeType!,
          name: x.name,
        }))
      );

      if (result.success) {
        const dlLink = document.createElement('a');
        dlLink.style.display = 'none';
        dlLink.href = result.data[0].url;
        document.body.appendChild(dlLink);
        dlLink.click();
        dlLink.remove();
      }
    } catch (error) {
      toast.error('Failed to download, try again later.', {
        className: 'bg-background text-foreground',
        id: toastId,
      });
    } finally {
      toast.success('Done', {
        className: 'bg-background text-foreground',
        id: toastId,
      });
    }
  }
  async function handleCreateFolder(folder: string) {
    setOpenFolderCreateDialogue(false);
    const toastId = toast.loading('Creating...', {
      className: 'bg-background text-foreground',
    });
    try {
      const result = await createFolder(accountId!, region, bucketId!, {
        key: prefix || '',
        name: folder,
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

  function handleCloseDldialogue(close: boolean) {
    setdlUrl('');
    setOpenFileDLDialogue(close);
  }

  function handleCreateFolderDialogue(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setOpenFolderCreateDialogue(true);
  }

  function handleDeleteFolderDialogue(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setOpenFolderDeleteDialogue(true);
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
        <div className="hidden md:flex md:gap-1">
          <FileActionsHeader
            role={userRole}
            actions={allowedActions}
            dataLoading={loading}
            handleCopyDialogue={handleCopyDialogue}
            handleDeleteDialogue={handleDeleteDialogue}
            handleRenameDialogue={handleRenameDialogue}
            handleDataReload={handleDataReload}
            handleDownloadLink={handleDownloadAs}
            handleDownload={handleDownload}
            handleCreateFolderDialogue={handleCreateFolderDialogue}
            handleDeleteFolderDialogue={handleDeleteFolderDialogue}
          />
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
      <DownloadFileDialogue
        open={openFileDLDialogue}
        onClose={handleCloseDldialogue}
        file={table.getFilteredSelectedRowModel().rows[0]?.original}
        downloadURL={dlUrl}
      />
      <CreateFolderDialogue
        open={openFolderCreateDialogue}
        onClose={setOpenFolderCreateDialogue}
        handleCreateFolder={handleCreateFolder}
      />
      <DeleteFolderConfirmation
        open={openFolderDeleteDialogue}
        onClose={setOpenFolderDeleteDialogue}
        folder={table.getFilteredSelectedRowModel().rows[0]?.original}
        handleDelete={handleDeleteFolder}
      />
    </>
  );
}
