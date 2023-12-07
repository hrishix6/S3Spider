import { User2 } from 'lucide-react';
import { Row } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import { DataTableUser } from '../../types/admin.types';

export function ClickableUsernameCell(row: Row<DataTableUser>) {
  const { username, id } = row.original;
  return (
    <div className="flex items-center gap-2">
      <User2 className="h-4 w-4" />
      <Link
        className="block hover:text-primary hover:underline hover:cursor-pointer"
        to={`${id}`}
      >
        {username}
      </Link>
    </div>
  );
}
