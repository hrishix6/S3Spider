import { ProtectedRoute, AccountGuard } from '@/routes';
import { Layout } from '../../layout';
import { Buckets } from '../components/buckets';

export function BucketPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <AccountGuard>
          <Buckets />
        </AccountGuard>
      </Layout>
    </ProtectedRoute>
  );
}
