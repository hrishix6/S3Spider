import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  CopyIcon,
  Edit2,
  FileOutput,
  HardDriveDownload,
  Plus,
  Trash2,
} from 'lucide-react';
import { FileAction } from '../types/files.types';
import { useState } from 'react';

interface FileActionsDropdownProps {
  allowedActions: FileAction[];
  handleCopyOperation: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleRenameDialogue: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleCreateFolderDialogue: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleDeleteDialogue: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleDeleteFolderDialogue: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMoveOperation: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleDownloadAsOperation: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export function FileActionsDropdown({
  allowedActions,
  handleCopyOperation,
  handleRenameDialogue,
  handleCreateFolderDialogue,
  handleDeleteDialogue,
  handleDeleteFolderDialogue,
  handleMoveOperation,
  handleDownloadAsOperation,
}: FileActionsDropdownProps) {
  const [open, setOpen] = useState(false);

  function onCpf(e: React.MouseEvent<HTMLDivElement>) {
    setOpen(false);
    handleCopyOperation(e);
  }

  function onDlAs(e: React.MouseEvent<HTMLDivElement>) {
    setOpen(false);
    handleDownloadAsOperation(e);
  }

  function onMvf(e: React.MouseEvent<HTMLDivElement>) {
    setOpen(false);
    handleMoveOperation(e);
  }

  function onRmf(e: React.MouseEvent<HTMLDivElement>) {
    setOpen(false);
    handleDeleteDialogue(e);
  }

  function onRenamef(e: React.MouseEvent<HTMLDivElement>) {
    setOpen(false);
    handleRenameDialogue(e);
  }

  function onPlusd(e: React.MouseEvent<HTMLDivElement>) {
    setOpen(false);
    handleCreateFolderDialogue(e);
  }

  function onRmd(e: React.MouseEvent<HTMLDivElement>) {
    setOpen(false);
    handleDeleteFolderDialogue(e);
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">More actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="end">
        <DropdownMenuLabel>File actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={onCpf}
            disabled={!allowedActions.includes('cpf')}
          >
            <CopyIcon className="mr-2 h-4 w-4" />
            <span>Copy</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onMvf}
            disabled={!allowedActions.includes('mvf')}
          >
            <FileOutput className="mr-2 h-4 w-4" />
            <span>Move</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDlAs}
            disabled={!allowedActions.includes('dlf')}
          >
            <HardDriveDownload className="mr-2 h-4 w-4" />
            <span>Download As</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onRenamef}
            disabled={!allowedActions.includes('renamef')}
          >
            <Edit2 className="mr-2 h-4 w-4" />
            <span>Rename</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onRmf}
            disabled={!allowedActions.includes('-f')}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Folder actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onPlusd}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Create</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onRmd}
            disabled={!allowedActions.includes('-d')}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
