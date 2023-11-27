import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/hooks';
import { logout } from '../../app';

export function NoAccountsAssigned() {
  const dispatch = useAppDispatch();

  return (
    <div className="fixed flex flex-col gap-2 items-center justify-center bg-background top-0 left-0 h-full w-full text-destructive">
      <img src="logo.svg" className="h-24 w-24" />
      <h3 className="font-semibold p-2 border border-muted bg-accent">
        No Accounts have been Assigned to you, please contact Admin.
      </h3>
      <Button
        variant={'secondary'}
        size={'lg'}
        onClick={() => dispatch(logout())}
      >
        Sign Out
      </Button>
    </div>
  );
}
