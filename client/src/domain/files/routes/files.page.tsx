import { ProtectedRoute } from '../../../routes/protected.route';
import { NoAccountsGuard } from '../routes/no.accounts.route.guard';
import { Layout } from '../../layout/components/layout';
import { Files } from '../components/s3.files';

export function FilesPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <NoAccountsGuard>
          <Files />
        </NoAccountsGuard>
      </Layout>
    </ProtectedRoute>
  );
}
