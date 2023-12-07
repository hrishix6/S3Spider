import { Link, useParams } from 'react-router-dom';

export function AdminBreadcrumbs() {
  const { userId } = useParams();
  return (
    <p className="mx-1">
      {userId ? (
        <>
          <Link
            to={`/_/users`}
            className="font-semibold text-primary hover:cursor-pointer hover:underline"
          >
            Users
          </Link>
          <span className="mx-1 text-muted-foreground">/</span>
          <span className={`font-semibold`}>{userId}</span>
        </>
      ) : (
        <span className={`font-semibold`}>Users</span>
      )}
    </p>
  );
}
