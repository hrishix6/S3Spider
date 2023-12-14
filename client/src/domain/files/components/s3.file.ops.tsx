import { Layout } from '@/domain/layout';
import { AccountGuard, ProtectedRoute } from '@/routes';
import { FileBrowser } from './file.browser';
import { useEffect } from 'react';
import { useAppDispatch } from '@/hooks';
import { clearCurrentFile } from '../stores/file.reducer';

export function FileOperations() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      console.log(`clearing file selection`);
      dispatch(clearCurrentFile());
    };
  }, []);

  return (
    <ProtectedRoute>
      <Layout>
        <AccountGuard>
          <FileBrowser />
        </AccountGuard>
      </Layout>
    </ProtectedRoute>
  );
}
