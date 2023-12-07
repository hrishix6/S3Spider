import { AdminBreadcrumbs } from './admin.breadcrumbs';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  selectAdminAwsAccounts,
  setDataTableAwsAccounts,
} from '../stores/admin.reducer';
import { Spinner } from '@/components/ui/spinner';
import { useEffect, useState } from 'react';
import { getUserAccounts } from '../api';
import { useParams } from 'react-router-dom';
import { ManageUserAwsAccountsDataTable } from './manage-accounts/manage.accounts.datatable';
import { awsAccountColumns } from './manage-accounts/manage.accounts.columns';
import toast from 'react-hot-toast';

export function ManageAwsAccountsPanel() {
  const { userId } = useParams();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const awsAccounts = useAppSelector(selectAdminAwsAccounts);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const result = await getUserAccounts(userId!);
      if (result.success) {
        dispatch(setDataTableAwsAccounts(result.data));
      } else {
        toast.error("Couldn't load aws accounts", {
          className: 'bg-background text-foreground',
        });
      }
    } catch (error) {
      toast.error("Couldn't load aws accounts", {
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
          <ManageUserAwsAccountsDataTable
            columns={awsAccountColumns}
            data={awsAccounts}
            loading={loading}
            reload={loadData}
          />
        )}
      </div>
    </section>
  );
}
