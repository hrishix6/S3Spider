import { Dialog, DialogContent } from '@/components/ui/dialog';
import { DataTableFile } from '../../types/files.types';

interface DownloadFileDialogueProps {
  open: boolean;
  onClose: (close: boolean) => void;
  downloadURL: string;
  file: DataTableFile;
}

export function DownloadFileDialogue({
  open,
  onClose,
  downloadURL,
  file,
}: DownloadFileDialogueProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <p className="max-w-sm mt-2 whitespace-nowrap overflow-hidden text-ellipsis">
          Saving
          <span className="ml-1 text-primary">{file?.name}</span>
        </p>
        <p className="text-sm mt-2 text-muted-foreground">
          <a
            className="text-primary font-semibold hover:underline"
            href={downloadURL}
            download={file?.name}
          >
            Right click this link and select 'Save link as'
          </a>
        </p>
      </DialogContent>
    </Dialog>
  );
}
