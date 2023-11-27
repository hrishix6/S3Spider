import { useAppSelector } from '@/hooks';
import { selectUserRole } from '../../app';
import { Navigate } from 'react-router-dom';

interface Props {
  children?: React.ReactNode;
}

export function AdminProtected(props: Props) {
  const userRole = useAppSelector(selectUserRole);

  if (userRole !== 'admin') {
    return <Navigate to={'/404'} replace />;
  }

  return <>{props.children}</>;
}
