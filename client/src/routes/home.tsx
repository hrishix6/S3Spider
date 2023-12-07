import { useAppSelector } from '../hooks';
import {
  selectIfNoaccounts,
  selectIsAuthenticated,
  selectUserAwsAccounts,
} from '../domain/app';
import { Navigate } from 'react-router-dom';
import { AppNoAccounts } from '../domain/app/components/app.no.accounts';

export function HomePage() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const noAccounts = useAppSelector(selectIfNoaccounts);
  const accounts = useAppSelector(selectUserAwsAccounts);

  if (!isAuthenticated) {
    return <Navigate to={`/login`} replace />;
  }

  if (noAccounts) {
    return <AppNoAccounts />;
  }

  return <Navigate to={`/s3/${accounts[0]?.aws_id}/buckets`} />;
}
