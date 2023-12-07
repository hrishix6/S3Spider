import { ProtectedRoute, AdminProtected } from '@/routes';
import { Layout } from '../../layout/components/layout';
import { ManageUsersPanel } from '../components/admin.users.panel';

export function AdminUserMgmtPage() {
  return (
    <ProtectedRoute>
      <AdminProtected>
        <Layout>
          <ManageUsersPanel />
        </Layout>
      </AdminProtected>
    </ProtectedRoute>
  );
}
