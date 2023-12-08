import { HardDrive } from 'lucide-react';
import { DataTableBucket } from '../../types';
import { Row } from '@tanstack/react-table';
import { Link } from 'react-router-dom';

export function ClickableBucketCell(row: Row<DataTableBucket>) {
  const { name, region } = row.original;

  const q = new URLSearchParams({
    region,
  }).toString();

  return (
    <div className="flex items-center gap-2">
      <HardDrive className="h-4 w-4" />
      <Link
        className="block hover:text-primary hover:underline hover:cursor-pointer"
        to={`${encodeURIComponent(name)}?${q}`}
      >
        {name}
      </Link>
    </div>
  );
}
