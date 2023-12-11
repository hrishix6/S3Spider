import { Button } from '@/components/ui/button';
import { UserRole } from '../../../app';
import { FileAction } from '../../types/files.types';
import { RotateCw, File, Folder } from 'lucide-react';

interface FileActionsProps {
  actions: FileAction[];
  dataLoading: boolean;
  role: UserRole;
  handleDataReload: () => void;
  handleCopyDialogue: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleRenameDialogue: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleCreateFolderDialogue: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleDeleteDialogue: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleDownloadLink: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleDownload: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleDeleteFolderDialogue: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function FileActionsHeader({
  actions,
  role,
  dataLoading,
  handleCopyDialogue,
  handleDataReload,
  handleDeleteDialogue,
  handleDownloadLink,
  handleRenameDialogue,
  handleDownload,
  handleCreateFolderDialogue,
  handleDeleteFolderDialogue,
}: FileActionsProps) {
  return (
    <>
      {role !== 'viewer' && (
        <>
          <Button
            variant={'outline'}
            onClick={handleCopyDialogue}
            disabled={!actions.includes('cpf')}
          >
            <File className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button
            variant={'outline'}
            onClick={handleRenameDialogue}
            disabled={!actions.includes('renamef')}
          >
            <File className="h-4 w-4 mr-2" />
            Rename
          </Button>
          <Button
            variant={'outline'}
            onClick={handleDeleteDialogue}
            disabled={!actions.includes('-f')}
          >
            <File className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <Button
            variant={'outline'}
            disabled={!actions.includes('-d')}
            onClick={handleDeleteFolderDialogue}
          >
            <Folder className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <Button
            variant={'outline'}
            disabled={!actions.includes('dlf')}
            onClick={handleDownload}
          >
            <File className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button
            variant={'outline'}
            disabled={!actions.includes('dlf')}
            onClick={handleDownloadLink}
          >
            <File className="h-4 w-4 mr-2" />
            Download As
          </Button>
          <Button variant={'outline'} onClick={handleCreateFolderDialogue}>
            <Folder className="h-4 w-4 mr-2" />
            Create
          </Button>
          <Button variant={'default'}>Upload</Button>
        </>
      )}
      <Button
        variant={'link'}
        size={'icon'}
        onClick={handleDataReload}
        disabled={dataLoading}
      >
        <RotateCw className="h-5 w-5" />
      </Button>
    </>
  );
}
