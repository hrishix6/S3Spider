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
import { AdminDataTableType } from '../../types/admin.types';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  dataTableType: AdminDataTableType;
  handleUpdate: (selected: TData[]) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  dataTableType,
  handleUpdate,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
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
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      rowSelection,
      globalFilter,
    },
  });

  const handleUpdateOperation = () => {
    const selected = table
      .getFilteredSelectedRowModel()
      .rows.map((x) => x.original);
    handleUpdate(selected);
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
            onClick={handleUpdateOperation}
          >
            Update
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
                  {dataTableType == 'users'
                    ? 'No user accounts'
                    : dataTableType == 'accounts'
                    ? 'No accounts'
                    : 'No items'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </>
  );
}
