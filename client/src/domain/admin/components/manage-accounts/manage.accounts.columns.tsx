import { ColumnDef } from '@tanstack/react-table';
import { DataTableAccount } from '../../types/admin.types';
import { AccountAssignedCell } from './assign.account.cell';

export const awsAccountColumns: ColumnDef<DataTableAccount>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'aws_id',
    header: 'Aws Account Number',
    cell({ row }) {
      const value = row.getValue('aws_id') as string;

      return <span className="text-muted-foreground">{value || ''}</span>;
    },
  },
  {
    id: 'assignment',
    header: () => <div className="text-center">Assigned</div>,
    cell: ({ row }) => {
      const comp = AccountAssignedCell(row);
      return comp;
    },
  },
];
