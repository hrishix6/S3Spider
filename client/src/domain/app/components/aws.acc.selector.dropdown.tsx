import { Check, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppSelector } from '@/hooks';
import { selectUserAwsAccounts } from '../stores/app.reducer';
import { Link, useParams } from 'react-router-dom';

export function AwsAccountsDropdown() {
  const accounts = useAppSelector(selectUserAwsAccounts);
  const { accountId: selectedAccId } = useParams();

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
          <Link key={x.aws_id} to={`/s3/${x.aws_id}/buckets`}>
            <DropdownMenuItem className="hover:cursor-pointer">
              {x.aws_id === selectedAccId ? (
                <Check className="h-4 w-4 mr-2" />
              ) : (
                <Square className="h-4 w-4 mr-2 stroke-transparent" />
              )}
              <span>{x.name}</span>
            </DropdownMenuItem>
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
