import { Check, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  selectCurrentAwsAccount,
  selectUserAwsAccounts,
  setCurrentAwsAccount,
} from '../stores/app.reducer';

export function AwsAccountsDropdown() {
  const dispatch = useAppDispatch();
  const accounts = useAppSelector(selectUserAwsAccounts);
  const selectedAccId = useAppSelector(selectCurrentAwsAccount);

  const selectedAcc = accounts?.find((x) => x.aws_id == selectedAccId);

  if (accounts?.length == 1) {
    return (
      <div className="px-2 py-1 w-[150px] text-center rounded hover:bg-accent whitespace-nowrap overflow-hidden text-ellipsis">
        <span className="text-sm font-semibold text-ellipsis">
          {selectedAcc?.name}
        </span>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="default">
          <span>Switch Account</span>
          <span className="sr-only">Aws Accounts</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {accounts?.map((x) => (
          <DropdownMenuItem
            key={x.aws_id}
            className="hover:cursor-pointer"
            onClick={() => {
              dispatch(setCurrentAwsAccount(x.aws_id));
            }}
          >
            {x.aws_id === selectedAccId ? (
              <Check className="h-4 w-4 mr-2" />
            ) : (
              <Square className="h-4 w-4 mr-2 stroke-transparent" />
            )}
            <span>{x.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
