import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DataTableFile } from '../../types/files.types';

interface DeleteFileConfirmationProps {
  open: boolean;
  onClose: (close: boolean) => void;
  handleDelete: (folder: DataTableFile) => Promise<void>;
  folder: DataTableFile;
}

export function DeleteFolderConfirmation({
  open,
  onClose,
  handleDelete,
  folder,
}: DeleteFileConfirmationProps) {
  function onDelete() {
    handleDelete(folder);
  }

  function onCancel() {
    onClose(false);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <p className="max-w-sm mt-2 whitespace-nowrap overflow-hidden text-ellipsis">
          Deleting
          <span className="ml-1 text-primary">{folder?.name}</span>
        </p>
        <p className="text-sm mt-1 text-muted-foreground">
          This action is not reversible, folder and all contents will be
          deleted.
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
