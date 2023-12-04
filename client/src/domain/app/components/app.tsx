import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  selectAppError,
  selectAppLoading,
  selectAppSessionEnded,
  selectErrorMessage,
} from '../stores/app.reducer';
import { useEffect } from 'react';
import { initAppDataAsync } from '../stores/app.async.actions';
import { AppError } from './app.error';
import { AppLoader } from './app.loader';
import { Routes, Route } from 'react-router-dom';
import { FilesPage } from '../../files';
import { LoginPage } from '../../auth';
import { SignUpPage } from '../../auth';
import { AdminPage } from '../../admin';
import { App404 } from '../routes/app.404';
import { AppSessionEndedPage } from './app.session.ended';

export function App() {
  const dispatch = useAppDispatch();
  const apploading = useAppSelector(selectAppLoading);
  const appError = useAppSelector(selectAppError);
  const appErrorMessage = useAppSelector(selectErrorMessage);
  const appSessionEnded = useAppSelector(selectAppSessionEnded)

  useEffect(() => {
    dispatch(initAppDataAsync());
  }, []);

  if (apploading) {
    return <AppLoader />;
  }

  if (appError) {
    return <AppError message={appErrorMessage} />;
  }

  if(appSessionEnded)
  {
    return <AppSessionEndedPage />
  }

  return (
    <Routes>
      <Route index path="/" element={<FilesPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<App404 />} />
    </Routes>
  );
}
