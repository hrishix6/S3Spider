import { ProtectedRoute } from '@/routes/protected.route';
import { Layout } from '../../layout';
import { AccountGuard } from '@/routes/account.guard';
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
