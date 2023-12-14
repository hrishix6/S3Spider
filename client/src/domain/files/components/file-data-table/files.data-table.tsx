import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import { DataTableFile, FileAction } from '../../types/files.types';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { RenameFileDialogue } from '../dialogues/rename.file.dialogue';
import { DeleteFileConfirmation } from '../dialogues/delete.file.confirmation';
import {
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
import { useAppDispatch, useAppSelector } from '@/hooks';
import { DownloadFileDialogue } from '../dialogues/download.file.dialogue';
import { FileActionsHeader } from './file.actions';
import { CreateFolderDialogue } from '../dialogues/create.folder.dialogue';
import { DeleteFolderConfirmation } from '../dialogues/delete.folder.confirmation';
import { FileTable } from './table';
import { FileActionsDropdown } from '../file.actions.dropdown';
import { Button } from '@/components/ui/button';
import { RotateCw } from 'lucide-react';
import { setCurrentFile } from '../../stores/file.reducer';
import { FilesPaginateFooter } from './files.paginate.footer';

interface FileDataTableProps {
  columns: ColumnDef<DataTableFile>[];
  data: DataTableFile[];
  reload: (ingoreCache?: boolean) => Promise<void>;
  loading: boolean;
  noNext: boolean;
  handleNext: (ignoreCache?: boolean) => void;
  handlePrev: (ignoreCache?: boolean) => void;
  noPrev: boolean;
}

export function FileDataTable({
  columns,
  data,
  loading,
  reload,
  noNext,
  noPrev,
  handleNext,
  handlePrev,
}: FileDataTableProps) {
  const { accountId, bucketId } = useParams();
  const { search } = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const q = new URLSearchParams(search);
  const region = q.get('region');
  const prefix = q.get('prefix');
  const userRole = useAppSelector(selectUserRole);
  const [rowSelection, setRowSelection] = useState({});
  const [key, setKey] = useState('');
  const [globalFilter, setGlobalFilter] = useState('');
  const [allowedActions, setAllowedActions] = useState<FileAction[]>([]);
  const [openDeleteDialogue, setOpenDeleteDialogue] = useState(false);
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
  async function handleDownloadAs(e: React.MouseEvent<HTMLDivElement>) {
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
  function handleDeleteDialogue(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    setOpenDeleteDialogue(true);
  }

  function handleRenameDialogue(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    setOpenRenameDialogue(true);
  }

  function handleCopyOperation(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();

    const selected = table.getFilteredSelectedRowModel().rows[0]?.original;

    if (!selected) {
      return;
    }

    dispatch(setCurrentFile(selected));
    const encodedAccountId = encodeURIComponent(accountId!);
    const encodedBucketId = encodeURIComponent(bucketId!);
    const q = new URLSearchParams({
      prefix: prefix!,
      region: region!,
    }).toString();
    const redirecURL = `/s3/${encodedAccountId}/buckets/${encodedBucketId}/o/copy?${q}`;
    console.log(redirecURL);
    return navigate(redirecURL);
  }

  function handleMoveOperation(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    const selected = table.getFilteredSelectedRowModel().rows[0]?.original;

    if (!selected) {
      return;
    }

    dispatch(setCurrentFile(selected));
    const encodedAccountId = encodeURIComponent(accountId!);
    const encodedBucketId = encodeURIComponent(bucketId!);
    const q = new URLSearchParams({
      prefix: prefix!,
      region: region!,
    }).toString();
    const redirecURL = `/s3/${encodedAccountId}/buckets/${encodedBucketId}/o/move?${q}`;
    console.log(redirecURL);
    return navigate(redirecURL);
  }

  function handleCloseDldialogue(close: boolean) {
    setdlUrl('');
    setOpenFileDLDialogue(close);
  }

  function handleCreateFolderDialogue(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    setOpenFolderCreateDialogue(true);
  }

  function handleDeleteFolderDialogue(e: React.MouseEvent<HTMLDivElement>) {
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
            handleDownload={handleDownload}
          />
          <FileActionsDropdown
            allowedActions={allowedActions}
            handleDeleteDialogue={handleDeleteDialogue}
            handleRenameDialogue={handleRenameDialogue}
            handleCopyOperation={handleCopyOperation}
            handleMoveOperation={handleMoveOperation}
            handleCreateFolderDialogue={handleCreateFolderDialogue}
            handleDeleteFolderDialogue={handleDeleteFolderDialogue}
            handleDownloadAsOperation={handleDownloadAs}
          />
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
      <FileTable table={table} colSpan={columns.length} />
      <FilesPaginateFooter
        noPrev={noPrev}
        noNext={noNext}
        handleNext={handleNext}
        handlePrev={handlePrev}
      />
      <RenameFileDialogue
        open={openRenameDialogue}
        onClose={setOpenRenameDialogue}
        handleRename={handleRename}
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
