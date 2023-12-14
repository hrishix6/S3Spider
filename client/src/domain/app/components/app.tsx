import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  selectAppError,
  selectAppLoading,
  selectAppSessionEnded,
  selectErrorMessage,
  selectIfNoaccounts,
} from '../stores/app.reducer';
import { useEffect } from 'react';
import { initAppDataAsync } from '../stores/app.async.actions';
import { AppError } from './app.error';
import { AppLoader } from './app.loader';
import { Routes, Route } from 'react-router-dom';
import { LoginPage } from '../../auth';
import { SignUpPage } from '../../auth';
import { AdminUserAwsAccMgmtPage, AdminUserMgmtPage } from '../../admin';
import { AppErrorPage } from '../routes/app.404';
import { AppSessionEndedPage } from './app.session.ended';
import { BucketPage } from '../../buckets';
import { HomePage } from '@/routes';
import { FilesPage } from '../../files';
import { AppNoAccounts } from './app.no.accounts';
import { FileOperations } from '@/domain/files/components/s3.file.ops';

export function App() {
  const dispatch = useAppDispatch();
  const apploading = useAppSelector(selectAppLoading);
  const appError = useAppSelector(selectAppError);
  const appErrorMessage = useAppSelector(selectErrorMessage);
  const appSessionEnded = useAppSelector(selectAppSessionEnded);
  const noAccounts = useAppSelector(selectIfNoaccounts);

  useEffect(() => {
    dispatch(initAppDataAsync());
  }, []);

  if (apploading) {
    return <AppLoader />;
  }

  if (appError) {
    return <AppError message={appErrorMessage} />;
  }

  if (appSessionEnded) {
    return <AppSessionEndedPage />;
  }

  if (noAccounts) {
    return <AppNoAccounts />;
  }

  return (
    <Routes>
      <Route index path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/_/users" element={<AdminUserMgmtPage />} />
      <Route path="/_/users/:userId" element={<AdminUserAwsAccMgmtPage />} />
      <Route path="/s3/:accountId/buckets" element={<BucketPage />} />
      <Route path="/s3/:accountId/buckets/:bucketId" element={<FilesPage />} />
      <Route
        path="/s3/:accountId/buckets/:bucketId/o/:operation"
        element={<FileOperations />}
      />
      <Route path="*" element={<AppErrorPage />} />
    </Routes>
  );
}
