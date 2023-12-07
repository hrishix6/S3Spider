import React from 'react';
import { useAppSelector } from '../hooks';
import { selectIsAuthenticated } from '../domain/app';
import { Navigate, useLocation } from 'react-router-dom';

interface Props {
  children?: React.ReactNode;
}

export function ProtectedRoute(props: Props) {
  const { pathname } = useLocation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${pathname}`} replace />;
  }

  return <>{props.children}</>;
}
