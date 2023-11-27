import React from 'react';
import { useAppSelector } from '@/hooks';
import { selectIfNoaccounts } from '../../app';
import { NoAccountsAssigned } from './no.accounts.page';

interface Props {
  children?: React.ReactNode;
}

export function NoAccountsGuard(props: Props) {
  const noAccounts = useAppSelector(selectIfNoaccounts);

  if (noAccounts) {
    return <NoAccountsAssigned />;
  }

  return <>{props.children}</>;
}
