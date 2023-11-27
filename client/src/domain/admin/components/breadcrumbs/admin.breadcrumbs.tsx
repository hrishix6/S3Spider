import { useAppDispatch, useAppSelector } from '@/hooks';
import { handleAdminCrumbClickAsync } from '../../stores/admin.async.actions';
import { selectAdminBreadCrumbs } from '../../stores/admin.reducer';
import { AdminBreadCrumItem } from './admin.breadcrumbs.item';

export function AdminBreadcrumbs() {
  const dispatch = useAppDispatch();
  const breadcrumbs = useAppSelector(selectAdminBreadCrumbs);

  const handleClick = (key: string) => {
    dispatch(handleAdminCrumbClickAsync(key));
  };

  return (
    <p className="mx-3">
      {breadcrumbs.map((x, i) => (
        <AdminBreadCrumItem
          key={i}
          data={x}
          handleClick={handleClick}
          last={i == breadcrumbs.length - 1}
        />
      ))}
    </p>
  );
}
