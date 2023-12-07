import { ColumnDef } from '@tanstack/react-table';
import { DataTableUser } from '../../types/admin.types';
import { ChangebleUserRoleDropdown } from './role.change.dropdown.cell';
import { UserVerifiedCell } from './verification.cell';
import { Checkbox } from '@/components/ui/checkbox';
import { ClickableUsernameCell } from './name.link.cell';

export const usersColumns: ColumnDef<DataTableUser>[] = [
  {
    accessorKey: 'username',
    header: 'Username',
    cell({ row }) {
      const comp = ClickableUsernameCell(row);
      return comp;
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
    accessorKey: 'email',
    header() {
      return <div className="text-center">Email</div>;
    },
    cell({ row }) {
      const { email } = row.original;
      return (
        <div className="flex justify-center items-center">
          {email ? (
            <a
              className="block hover:text-primary hover:underline hover:cursor-pointer"
              href={`mailto:${email}`}
            >
              {email}
            </a>
          ) : (
            <></>
          )}
        </div>
      );
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
