import React from 'react';
import { useAppSelector } from '../hooks';
import { selectIsAuthenticated } from '../domain/app';
import { Navigate } from 'react-router-dom';

interface Props {
  children?: React.ReactNode;
}

export function ProtectedRoute(props: Props) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to={'/login'} replace />;
  }

  return <>{props.children}</>;
}
