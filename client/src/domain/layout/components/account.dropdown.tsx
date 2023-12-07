import { User2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { logout, selectUserRole, selectUsername } from '../../app';
import {
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from '@radix-ui/react-dropdown-menu';

export function AccountOptionsDropdown() {
  const dispatch = useAppDispatch();
  const username = useAppSelector(selectUsername);
  const userRole = useAppSelector(selectUserRole);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <User2 className="h-5 w-5" />
          <span className="sr-only">Account options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32" align="end">
        <DropdownMenuLabel className="overflow-hidden text-ellipsis whitespace-nowrap">
          {' '}
          {username}({userRole})
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => dispatch(logout())}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
