import { ColumnDef } from '@tanstack/react-table';
import { DataTableBucket } from '../../types';
import { ClickableBucketCell } from './cliickable.bucket.cell';
import { timeSince } from '@/lib/utils';

export const bucketColumns: ColumnDef<DataTableBucket>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell(props) {
      const comp = ClickableBucketCell(props.row);
      return comp;
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell({ row }) {
      const dstring = row.getValue('createdAt');

      if (!dstring) {
        return <></>;
      }

      const humaneReadableDate = timeSince(dstring as string);
      return <div className="text-muted-foreground">{humaneReadableDate}</div>;
    },
  },
];
