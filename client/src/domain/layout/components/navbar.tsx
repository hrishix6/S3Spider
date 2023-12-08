import { APP_GITHUB_LINK, APP_NAME } from '@/lib/constants';
import { ThemeToggle } from '../../theme';
import { AccountOptionsDropdown } from './account.dropdown';
import {
  AwsAccountsDropdown,
  selectUserAwsAccounts,
  selectUserRole,
} from '../../app';
import { useAppSelector } from '@/hooks';
import { Link, useLocation } from 'react-router-dom';

export function Navbar() {
  const role = useAppSelector(selectUserRole);
  const userAccounts = useAppSelector(selectUserAwsAccounts);
  const location = useLocation();
  const { pathname } = location;

  const isAdminRoute = pathname.startsWith('/_');
  const isFileRoute = pathname.startsWith('/s3');

  return (
    <nav className="flex items-center justify-between">
      <div className="flex items-center bg-background gap-1 py-1 lg:ml-2">
        <img src="/logo.svg" className="h-5 w-5" />
        <h3 className="ml-1 text-primary font-semibold text-lg">
          <a
            href={APP_GITHUB_LINK}
            aria-description="github repository"
            target="_blank"
          >
            {APP_NAME}
          </a>
        </h3>
        {role === 'admin' && (
          <div className="flex items-center ml-4">
            <Link
              to={`/s3/${userAccounts[0]?.aws_id}/buckets`}
              replace
              className="block px-2 py-1 font-semibold text-sm text-muted-foreground hover:text-primary hover:bg-accent"
            >
              <span className={isFileRoute ? 'text-primary' : ''}>Files</span>
            </Link>
            <Link
              to={'/_/users'}
              replace
              className="block px-4 py-1 font-semibold text-sm text-muted-foreground hover:text-primary hover:bg-accent"
            >
              <span className={isAdminRoute ? 'text-primary' : ''}>Admin</span>
            </Link>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        {isFileRoute ? <AwsAccountsDropdown /> : <></>}
        <AccountOptionsDropdown />
        <ThemeToggle />
      </div>
    </nav>
  );
}
