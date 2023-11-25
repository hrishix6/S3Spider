import { User2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { logout, selectUserInfo } from '../app/redux/app.reducer';

export function AccountOptionsDropdown() {
  const dispatch = useAppDispatch();
  const info = useAppSelector(selectUserInfo);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="default">
          <User2 className='h-5 w-5 mr-2' />
          <span>{info?.username}</span>
          <span className="sr-only">Account options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => dispatch(logout())}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
