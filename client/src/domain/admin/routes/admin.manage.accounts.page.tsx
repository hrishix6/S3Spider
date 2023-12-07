import { ProtectedRoute, AdminProtected } from '@/routes';
import { Layout } from '../../layout/components/layout';
import { ManageAwsAccountsPanel } from '../components/admin.aws.accounts.panel';

export function AdminUserAwsAccMgmtPage() {
  return (
    <ProtectedRoute>
      <AdminProtected>
        <Layout>
          <ManageAwsAccountsPanel />
        </Layout>
      </AdminProtected>
    </ProtectedRoute>
  );
}
