import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { isValidS3ObjectName } from '../../utils';

interface CreateFolderDialogueProps {
  open: boolean;
  onClose: (close: boolean) => void;
  handleCreateFolder: (folderName: string) => Promise<void>;
}

export function CreateFolderDialogue({
  open,
  onClose,
  handleCreateFolder,
}: CreateFolderDialogueProps) {
  const [folder, setFolder] = useState<string>('');
  const [error, setError] = useState('');

  useEffect(() => {
    setFolder('');
  }, [open]);

  function onCreate() {
    if (!isValidS3ObjectName(folder)) {
      setError(
        `Following Characters not allowed - " ' | \\ / \` { } [ ] ^ > < ~ # ? `
      );
      return;
    }
    handleCreateFolder(folder);
  }

  function onCancel() {
    onClose(false);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create folder</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-2">
          {error && <p className="text-destructive p-1 text-sm">{error}</p>}
          <div className="flex flex-col gap-2">
            <Label htmlFor="folder">Name</Label>
            <Input
              className="flex-1"
              id="folder"
              type="text"
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant={'secondary'} onClick={onCancel}>
            Cancel
          </Button>
          <Button variant={'default'} onClick={onCreate}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
