import { DataTableUser } from '../../types/admin.types';
import { Row } from '@tanstack/react-table';
import { useAppDispatch } from '@/hooks';
import { Checkbox } from '@/components/ui/checkbox';
import { setUserVerified } from '../../stores/admin.reducer';

export function UserVerifiedCell(row: Row<DataTableUser>) {
  const dispatch = useAppDispatch();
  const { id, verified } = row.original;

  return (
    <div className="flex items-center justify-center">
      <Checkbox
        checked={verified}
        onCheckedChange={(value) =>
          dispatch(setUserVerified({ id, verified: !!value }))
        }
        aria-label="Select all"
      />
    </div>
  );
}
