import { Button } from '@/components/ui/button';

interface FilesPaginateFooterProps {
  noNext: boolean;
  handleNext: (ingoreCache?: boolean) => void;
  handlePrev: (ingoreCache?: boolean) => void;
  noPrev: boolean;
}

export function FilesPaginateFooter({
  noNext,
  noPrev,
  handleNext,
  handlePrev,
}: FilesPaginateFooterProps) {
  function onPrev(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    handlePrev();
  }

  function onNext(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    handleNext();
  }

  return (
    <div className="flex items-center justify-end gap-2 mt-2">
      <Button variant={'outline'} disabled={noPrev} onClick={onPrev}>
        Prev
      </Button>
      <Button variant={'outline'} disabled={noNext} onClick={onNext}>
        Next
      </Button>
    </div>
  );
}
