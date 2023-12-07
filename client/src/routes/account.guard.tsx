import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../hooks';
import { selectIfNoaccounts, selectUserAwsAccounts } from '../domain/app';
import { AppNoAccounts } from '../domain/app/components/app.no.accounts';

interface AccountGuardProps {
  children?: React.ReactNode;
}
export function AccountGuard({ children }: AccountGuardProps) {
  const userAccounts = useAppSelector(selectUserAwsAccounts);
  const noAccounts = useAppSelector(selectIfNoaccounts);
  const { accountId } = useParams();

  if (noAccounts) {
    return <AppNoAccounts />;
  }

  if (!userAccounts.find((x) => x.aws_id === accountId)) {
    return <Navigate to={'/403'} replace />;
  }

  return <>{children}</>;
}
