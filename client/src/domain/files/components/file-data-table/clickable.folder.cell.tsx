import { Folder, File } from 'lucide-react';
import { DataTableFile } from '../../types/files.types';
import { Row } from '@tanstack/react-table';
import { Link } from 'react-router-dom';

export function ClickableFolderCell(row: Row<DataTableFile>) {
  const mimeType = row.getValue('mimeType');
  const name = row.getValue('name') as string;
  const { key } = row.original;

  if (!mimeType) {
    const folderChildrenQuery = new URLSearchParams({
      prefix: key,
    }).toString();

    const folderChildrenUrl = `${
      folderChildrenQuery ? `?${folderChildrenQuery}` : ''
    }`;

    return (
      <div className="flex items-center gap-2">
        <Folder className="h-4 w-4" />
        <Link
          className="block hover:text-primary hover:underline hover:cursor-pointer"
          to={folderChildrenUrl}
        >
          {name}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <File className="h-4 w-4" />
      <span>{name}</span>
    </div>
  );
}
