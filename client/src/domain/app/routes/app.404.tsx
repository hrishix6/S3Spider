import { Link } from 'react-router-dom';

export function App404() {
  return (
    <div className="fixed flex flex-col gap-4 items-center justify-center bg-background top-0 left-0 h-full w-full text-destructive">
      <img src="logo.svg" className="h-24 w-24" />
      <h3>404 | Page not found.</h3>
      <Link
        className="block px-2 py-1 bg-accent text-sm font-semibold"
        to={'/'}
        replace
      >
        Home
      </Link>
    </div>
  );
}
