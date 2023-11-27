import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableAccount, DataTableUser } from '../../types/admin.types';
import { ClickableAccountCell } from './clickable.accounts.link';
import { UserVerifiedCell } from './user.verified.cell';
import { ChangebleUserRoleDropdown } from './role.dropdown.cell';
import { AccountAssignedCell } from './account.assigned.cell';

export const usersColumns: ColumnDef<DataTableUser>[] = [
  {
    accessorKey: 'username',
    header: 'Username',
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell({ row }) {
      const email = row.getValue('email') as string;
      if (!email) {
        return <></>;
      }
      return (
        <a
          href={`mailto:${email}`}
          className="text-muted-foreground hover:text-primary hover:underline hover:cursor-pointer"
        >
          {email}
        </a>
      );
    },
  },
  {
    id: 'role',
    header: () => {
      return <div className="text-center">Role</div>;
    },
    cell({ row }) {
      const comp = ChangebleUserRoleDropdown(row);
      return comp;
    },
  },
  {
    id: 'verifiedStatus',
    header: () => {
      return <div className="text-center">Verified</div>;
    },
    cell({ row }) {
      const comp = UserVerifiedCell(row);
      return comp;
    },
  },
  {
    id: 'manage_accounts',
    header: () => {
      return <div className="text-center">Manage Account</div>;
    },
    cell({ row }) {
      const comp = ClickableAccountCell(row);
      return comp;
    },
  },
  {
    id: 'select',
    header: ({ table }) => (
      <div className="flex flex-col justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];

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
