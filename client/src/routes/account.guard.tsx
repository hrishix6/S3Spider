import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../hooks';
import { selectUserAwsAccounts } from '../domain/app';

interface AccountGuardProps {
  children?: React.ReactNode;
}
export function AccountGuard({ children }: AccountGuardProps) {
  const userAccounts = useAppSelector(selectUserAwsAccounts);
  const { accountId } = useParams();
  if (!userAccounts.find((x) => x.aws_id === accountId)) {
    //no access to this account.
    return <Navigate to={'/403'} replace />;
  }

  return <>{children}</>;
}
