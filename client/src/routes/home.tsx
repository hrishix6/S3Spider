import { useAppSelector } from '../hooks';
import { selectUserAwsAccounts } from '../domain/app';
import { Link } from 'react-router-dom';
import { ProtectedRoute } from './protected.route';

export function HomePage() {
  const userAccs = useAppSelector(selectUserAwsAccounts);

  return (
    <ProtectedRoute>
      <h1 className="text-3xl">Accounts</h1>
      <ul>
        {userAccs.map((x) => (
          <li key={x.id}>
            <Link to={`/s3/${x.aws_id}/buckets`}>{x.name}</Link>
          </li>
        ))}
        <li>
          <Link to={'/s3/noaccount/buckets'}>404 test</Link>
        </li>
      </ul>
    </ProtectedRoute>
  );
}
