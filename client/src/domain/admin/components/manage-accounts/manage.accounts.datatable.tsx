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
import { DataTableAccount } from '../../types/admin.types';
import { RotateCcw } from 'lucide-react';
import { AppErrorCode, getToastErrorMessage } from '../../../app';
import { updateUserAccounts } from '../../api';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '@/hooks';
import { selectAdminAwsAccounts } from '../../stores/admin.reducer';

interface ManageUsersDataTableProps {
  columns: ColumnDef<DataTableAccount>[];
  data: DataTableAccount[];
  reload: () => void;
  loading: boolean;
}

export function ManageUserAwsAccountsDataTable({
  columns,
  data,
  reload,
  loading,
}: ManageUsersDataTableProps) {
  const { userId } = useParams();
  const awsAccounts = useAppSelector(selectAdminAwsAccounts);
  const [key, setKey] = useState('');
  const [globalFilter, setGlobalFilter] = useState('');

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
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
  });

  const handleUpdateOperation = async () => {
    const toastId = toast.loading('Updating...', {
      className: 'bg-background text-foreground',
    });

    try {
      const result = await updateUserAccounts({
        userId: userId!,
        accounts: awsAccounts,
      });

      if (result) {
        toast.success('Done', {
          className: 'bg-background text-foreground',
          id: toastId,
        });

        handleDataReload();
      } else {
        toast.success('Failed', {
          className: 'bg-background text-foreground',
          id: toastId,
        });
      }
    } catch (error) {
      const e = error as AppErrorCode;
      toast.error(getToastErrorMessage(e), {
        className: 'bg-background text-foreground',
        id: toastId,
      });
    }
  };

  function handleDataReload() {
    reload();
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
          <Button variant={'default'} onClick={handleUpdateOperation}>
            Update
          </Button>
          <Button
            variant={'link'}
            size={'icon'}
            onClick={handleDataReload}
            disabled={loading}
          >
            <RotateCcw className="h-5 w-5" />
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
                  No Aws accounts
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </>
  );
}
