import { ProtectedRoute } from '@/routes/protected.route';
import { AdminProtected } from './admin.protected';
import { Layout } from '../../layout/components/layout';
import { AdminPanel } from '../components/admin.panel';

export function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminProtected>
        <Layout>
          <AdminPanel />
        </Layout>
      </AdminProtected>
    </ProtectedRoute>
  );
}
