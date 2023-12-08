import React from 'react';
import { useAppSelector } from '../hooks';
import { selectIsAuthenticated } from '../domain/app';
import { Navigate, useLocation } from 'react-router-dom';

interface Props {
  children?: React.ReactNode;
}

export function ProtectedRoute(props: Props) {
  const { pathname, search } = useLocation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const redirectPath = `${pathname}${search}`;

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${redirectPath}`} replace />;
  }

  return <>{props.children}</>;
}
