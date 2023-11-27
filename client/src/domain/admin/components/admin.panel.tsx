import { usersColumns, awsAccountColumns } from './admin-data-table/columns';
import { DataTable } from './admin-data-table/admin.datatable';
import { AdminBreadcrumbs } from './breadcrumbs/admin.breadcrumbs';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  selectUsers,
  selectAdminDatatableType,
  selectAdminAwsAccounts,
  selectAdminLoading,
  seslectCurrentUser,
} from '../stores/admin.reducer';
import { Spinner } from '@/components/ui/spinner';
import { useEffect } from 'react';
import { loadUsersAsync } from '../stores/admin.async.actions';
import { UserRole } from '../../app';
import { UpdateUsersRequest } from '../types/admin.types';
import { updateUserAccounts, updateUsers } from '../api';

export function AdminPanel() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(seslectCurrentUser);
  const dataLoading = useAppSelector(selectAdminLoading);
  const dataTableType = useAppSelector(selectAdminDatatableType);
  const users = useAppSelector(selectUsers);
  const awsAccounts = useAppSelector(selectAdminAwsAccounts);

  useEffect(() => {
    dispatch(loadUsersAsync());
  }, []);

  const handleUsersUpdate = async (selected: any) => {
    if (!selected.length) {
      return;
    }
    const payload: UpdateUsersRequest = {
      payload: selected.map((x: any) => ({
        id: x.id,
        verified: x.verified,
        role: x.role as UserRole,
      })),
    };
    const result = await updateUsers(payload);

    if (result) {
      dispatch(loadUsersAsync());
    }
  };

  const handleAccountsUpdate = async () => {
    if (!currentUser) {
      return;
    }
    const result = await updateUserAccounts({
      userId: currentUser,
      accounts: awsAccounts,
    });

    if (result) {
      dispatch(loadUsersAsync());
    }
  };

  let tableComp;
  switch (dataTableType) {
    case 'accounts':
      tableComp = (
        <DataTable
          columns={awsAccountColumns}
          data={awsAccounts}
          dataTableType={dataTableType}
          handleUpdate={handleAccountsUpdate}
        />
      );
      break;
    case 'users':
      tableComp = (
        <DataTable
          columns={usersColumns}
          data={users}
          dataTableType={dataTableType}
          handleUpdate={handleUsersUpdate}
        />
      );
      break;
    default:
      tableComp = <></>;
      break;
  }

  return (
    <section className="mt-4 flex flex-col flex-1 overflow-hidden gap-4">
      <AdminBreadcrumbs />
      <div className="bg-background flex-1 flex flex-col overflow-hidden relative">
        {dataLoading ? <Spinner /> : tableComp}
      </div>
    </section>
  );
}
