import { DataTableAccount } from '../../types/admin.types';
import { Row } from '@tanstack/react-table';
import { useAppDispatch } from '@/hooks';
import { Checkbox } from '@/components/ui/checkbox';
import { setAccountAssigned } from '../../stores/admin.reducer';

export function AccountAssignedCell(row: Row<DataTableAccount>) {
  const dispatch = useAppDispatch();
  const { id, assigned } = row.original;

  return (
    <div className="flex items-center justify-center">
      <Checkbox
        checked={assigned}
        onCheckedChange={(value) => {
          dispatch(setAccountAssigned({ id, assigned: !!value }));
        }}
        aria-label="Select all"
      />
    </div>
  );
}
