import { Link, useParams } from 'react-router-dom';
import { useAppSelector } from '@/hooks';
import { selectIsAuthenticated } from '..';

export function AppErrorPage() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { errorCode } = useParams();

  let errorMessage = '500 | Something went wrong';

  switch (errorCode) {
    case '500':
      errorMessage = "500 | Something isn't right, please contact admin";
      break;
    case '403':
      errorMessage = '403 | Forbidden page';
      break;
    case 'noAccount':
      errorMessage = 'No account has been assigned to you';
      break;
    case '404':
    default:
      errorMessage = '404 | Page not found';
      break;
  }

  return (
    <div className="fixed flex flex-col gap-4 items-center justify-center bg-background top-0 left-0 h-full w-full">
      <img src="/logo.svg" className="h-24 w-24" />
      <h3 className="text-primary text-xl font-semibold">{errorMessage}</h3>
      <div className="flex items-center gap-2">
        <Link
          className="text-muted-foreground uppercase block p-2 text-base hover:underline hover:text-primary hover:cursor-pointer transition-all ease-in duration-200"
          to={'/'}
          replace
        >
          home
        </Link>
        {!isAuthenticated && (
          <Link
            to={`/login`}
            className="block p-2 text-base uppercase text-muted-foreground hover:underline hover:text-primary hover:cursor-pointer transition-all ease-in duration-200"
          >
            Sign in
          </Link>
        )}
      </div>
    </div>
  );
}
