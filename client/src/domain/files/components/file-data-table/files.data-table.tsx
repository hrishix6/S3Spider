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
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import {
  DataTableFile,
  MaxDownloadSizeExceededError,
} from '../../types/files.types';
import {
  calculateDownloadMetadata,
  downloadFilesAsync,
} from '../../utils/download.utils';
import { useAppSelector } from '@/hooks';
import { AppErrorCode, getToastErrorMessage, selectCurrentAwsAccount } from '../../../app';
import { selectCurrentBucket } from '../../stores/files.reducer';

interface FileDataTableProps {
  columns: ColumnDef<DataTableFile>[];
  data: DataTableFile[];
}

export function FileDataTable({ columns, data }: FileDataTableProps) {
  const awsAccount = useAppSelector(selectCurrentAwsAccount);
  const bucket = useAppSelector(selectCurrentBucket);
  const [rowSelection, setRowSelection] = useState({});
  const [key, setKey] = useState('');
  const [globalFilter, setGlobalFilter] = useState('');
  const [disableDL, setDisableDL] = useState(true);

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

    if (selected.length) {
      if (selected.some((x) => x.original.kind == 'folder')) {
        setDisableDL(true);
      } else {
        console.log('file selected');
        setDisableDL(false);
      }
    } else {
      setDisableDL(true);
    }
  }, [rowSelection]);

  const handleDownload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const toastId = toast.loading('Downloading...', {
      className: 'bg-background text-foreground',
    });

    const selected = table
      .getFilteredSelectedRowModel()
      .rows.map((x) => x.original);
    try {
      const { files } = calculateDownloadMetadata(selected);
      await downloadFilesAsync(awsAccount, bucket, files);
      toast.success('Done', { id: toastId });
    } catch (error) {
      console.log(error);
      if (error instanceof MaxDownloadSizeExceededError) {
        toast.error("Download size exceeds maximum zip limit of 4GB");
        return;
      }
      toast.error('Failed to download, try again later.', { id: toastId });
    }
  };

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
          <Button
            variant={'default'}
            size={'sm'}
            disabled={disableDL}
            onClick={handleDownload}
          >
            <Download className="h-5 w-5 mr-2" />
            Download
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
    </>
  );
}
