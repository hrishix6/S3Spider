import { Button } from '@/components/ui/button';
import { UserRole } from '../../../app';
import { FileAction } from '../../types/files.types';
import { Download, Upload } from 'lucide-react';

interface FileActionsProps {
  actions: FileAction[];
  role: UserRole;
  handleDownload: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function FileActionsHeader({
  actions,
  role,
  handleDownload,
}: FileActionsProps) {
  return (
    <>
      {role !== 'viewer' && (
        <>
          <Button
            variant={'outline'}
            disabled={!actions.includes('dlf')}
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant={'outline'}>
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </>
      )}
    </>
  );
}
