import { DataTableUser } from '../../types/admin.types';
import { Row } from '@tanstack/react-table';
import { useAppDispatch } from '@/hooks';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { setUserRole } from '../../stores/admin.reducer';

export function ChangebleUserRoleDropdown(row: Row<DataTableUser>) {
  const { id, role } = row.original;
  const dispatch = useAppDispatch();

  const handleRoleChange = (value: string) => {
    dispatch(setUserRole({ id, role: value }));
  };

  return (
    <div className="w-full">
      <Select value={role} onValueChange={handleRoleChange}>
        <SelectTrigger>
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="user">User</SelectItem>
          <SelectItem value="viewer">Viewer</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
