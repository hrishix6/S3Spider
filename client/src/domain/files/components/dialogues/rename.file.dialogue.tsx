import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { DataTableFile } from '../../types/files.types';
import { getFileNameWithoutExtension, isValidS3ObjectName } from '../../utils';

interface RenameFileDialogueProps {
  open: boolean;
  onClose: (close: boolean) => void;
  handleRename: (original: DataTableFile, fileName: string) => Promise<void>;
  file: DataTableFile;
}

export function RenameFileDialogue({
  open,
  onClose,
  handleRename,
  file,
}: RenameFileDialogueProps) {
  const [filename, setFilename] = useState<string>('');
  const [error, setError] = useState('');

  useEffect(() => {
    setFilename('');
  }, [open]);

  function onRename() {
    if (filename === getFileNameWithoutExtension(file?.name)) {
      setError('duplicate name not allowed');
      return;
    }

    if (!isValidS3ObjectName(filename)) {
      setError(
        `Following Characters not allowed - " ' | \\ / \` { } [ ] ^ > < ~ # ?`
      );
      return;
    }

    handleRename(file, filename);
  }

  function onCancel() {
    onClose(false);
  }

  function onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError('');
    setFilename(e.target.value);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col gap-4 mt-2">
          <p className="max-w-sm whitespace-nowrap overflow-hidden text-ellipsis">
            Renaming
            <span className="ml-1 text-primary">{file?.name}</span>
          </p>
          {error && <p className="text-destructive p-1 text-sm">{error}</p>}
          <div className="flex flex-col gap-2">
            <Label htmlFor="mv-filename">
              Name
              <span className="ml-1 text-muted-foreground text-xs">
                (without extension)
              </span>
            </Label>
            <Input
              id="mv-filename"
              type="text"
              value={filename}
              onChange={onNameChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant={'secondary'} onClick={onCancel}>
            Cancel
          </Button>
          <Button variant={'default'} onClick={onRename}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
