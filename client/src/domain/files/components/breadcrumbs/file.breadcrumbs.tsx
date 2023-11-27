import { useAppDispatch, useAppSelector } from '@/hooks';
import { selectBreadCrumbs } from '../../stores/files.reducer';
import { handleCrumbClickAsync } from '../../stores/files.async.actions';
import { FileBreadCrumItem } from './file.breadcrumb.item';

export function FileBreadcrumbs() {
  const dispatch = useAppDispatch();
  const breadcrumbs = useAppSelector(selectBreadCrumbs);

  const handleClick = (key: string) => {
    dispatch(handleCrumbClickAsync(key));
  };

  return (
    <p className="mx-3">
      {breadcrumbs.map((x, i) => (
        <FileBreadCrumItem
          key={i}
          data={x}
          handleClick={handleClick}
          last={i == breadcrumbs.length - 1}
        />
      ))}
    </p>
  );
}
