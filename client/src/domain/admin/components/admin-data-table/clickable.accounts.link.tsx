import { DataTableUser } from '../../types/admin.types';
import { Row } from '@tanstack/react-table';
import { useAppDispatch } from '@/hooks';
import { handleAccountsClickAsync } from '../../stores/admin.async.actions';
import { ArrowUpRightSquare } from 'lucide-react';

export function ClickableAccountCell(row: Row<DataTableUser>) {
  const dispatch = useAppDispatch();

  const handleAccountClick = () => {
    dispatch(handleAccountsClickAsync(row.original));
  };

  return (
    <div className="flex items-center justify-center">
      <span
        onClick={handleAccountClick}
        className="hover:text-primary hover:underline hover:cursor-pointer"
      >
        <ArrowUpRightSquare className="h-5 w-5" />
      </span>
    </div>
  );
}
