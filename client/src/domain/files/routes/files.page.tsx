import { ProtectedRoute, AccountGuard } from '@/routes';
import { Layout } from '../../layout/components/layout';
import { Files } from '../components/s3.files';

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
