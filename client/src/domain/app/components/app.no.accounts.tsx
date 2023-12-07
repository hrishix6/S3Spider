import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { logout, selectIsAuthenticated } from '..';
import { Navigate } from 'react-router-dom';

export function AppNoAccounts() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <Navigate replace to={`/login`} />;
  }

  return (
    <div className="fixed flex flex-col gap-2 items-center justify-center bg-background top-0 left-0 h-full w-full text-destructive">
      <img src="/logo.svg" className="h-24 w-24 fill-destructive" />
      <h3 className="font-semibold p-2 border border-muted bg-accent">
        No Accounts have been assigned to you
      </h3>
      <Button variant={'default'} onClick={() => dispatch(logout())}>
        Logout
      </Button>
    </div>
  );
}
