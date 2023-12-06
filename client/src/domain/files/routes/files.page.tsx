import { ProtectedRoute } from '@/routes/protected.route';
import { Layout } from '../../layout/components/layout';
import { Files } from '../components/s3.files';
import { AccountGuard } from '@/routes/account.guard';

export function FilesPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <AccountGuard>
          <Files />
        </AccountGuard>
      </Layout>
    </ProtectedRoute>
  );
}
