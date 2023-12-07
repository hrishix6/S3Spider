import { AdminBreadcrumbs } from './admin.breadcrumbs';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { selectUsers, setDatatableUsers } from '../stores/admin.reducer';
import { Spinner } from '@/components/ui/spinner';
import { useEffect, useState } from 'react';
import { getUsers } from '../api';
import { ManageUsersDataTable } from './manage-users/manage.users.datatable';
import { usersColumns } from './manage-users/manage.users.columns';
import toast from 'react-hot-toast';

export function ManageUsersPanel() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const users = useAppSelector(selectUsers);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const result = await getUsers();
      if (result.success) {
        dispatch(setDatatableUsers(result.data));
      } else {
        toast.error("Couldn't load users", {
          className: 'bg-background text-foreground',
        });
      }
    } catch (error) {
      toast.error("Couldn't load users", {
        className: 'bg-background text-foreground',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-4 flex flex-col flex-1 overflow-hidden gap-4">
      <AdminBreadcrumbs />
      <div className="bg-background flex-1 flex flex-col overflow-hidden relative">
        {loading ? (
          <Spinner />
        ) : (
          <ManageUsersDataTable
            columns={usersColumns}
            data={users}
            loading={loading}
            reload={loadData}
          />
        )}
      </div>
    </section>
  );
}
