import { AdminBreadCrumb } from '../../types/admin.types';

interface AdminBreadCrumItemProps {
  data: AdminBreadCrumb;
  last: boolean;
  handleClick: (key: string) => void;
}

export function AdminBreadCrumItem({
  last,
  data,
  handleClick,
}: AdminBreadCrumItemProps) {
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
