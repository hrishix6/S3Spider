import { BreadCrumb } from '../../types/files.types';

interface BreadCrumItemProps {
  data: BreadCrumb;
  last: boolean;
  handleClick: (key: string) => void;
}

export function FileBreadCrumItem({
  last,
  data,
  handleClick,
}: BreadCrumItemProps) {
  const { text, key } = data;

  if (last) {
    return <span className={`font-semibold`}>{text}</span>;
  }

  return (
    <>
      <span
        onClick={() => {
          handleClick(key);
        }}
        className="font-semibold text-primary hover:cursor-pointer hover:underline"
      >
        {text}
      </span>
      <span className="mx-1 text-muted-foreground">/</span>
    </>
  );
}
