import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DataTableFile } from '../../types/files.types';

interface CopyFileDialogueProps {
  open: boolean;
  onClose: (close: boolean) => void;
  handleDelete: (file: DataTableFile) => Promise<void>;
  file: DataTableFile;
}

export function DeleteFileConfirmation({
  open,
  onClose,
  handleDelete,
  file,
}: CopyFileDialogueProps) {
  function onDelete() {
    handleDelete(file);
  }

  function onCancel() {
    onClose(false);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="max-w-sm whitespace-nowrap overflow-hidden text-ellipsis">
            Delete
            <span className="ml-1 text-primary">{file?.name}</span>
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm mt-2 text-muted-foreground">
          This action is not reversible
        </p>
        <DialogFooter>
          <Button variant={'secondary'} onClick={onCancel}>
            Cancel
          </Button>
          <Button variant={'default'} onClick={onDelete}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
