import { Link, useLocation, useParams } from 'react-router-dom';

export function Breadcrumbs() {
  const { accountId, bucketId } = useParams();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const region = query.get('region');
  const prefix = query.get('prefix');

  const folders = prefix ? prefix.split('/').filter((x) => x !== '') : [];

  return (
    <p className="mx-1">
      <Link
        to={`/s3/${accountId}/buckets`}
        className="font-semibold text-primary hover:cursor-pointer hover:underline"
      >
        Buckets
      </Link>
      <BucketItemCrumb
        region={region}
        accountId={accountId}
        bucketId={bucketId}
        folders={folders}
      />
    </p>
  );
}

interface FolderCrumbProps {
  last?: boolean;
  prefix: string;
  region: string;
  baseUrl: string;
  name: string;
}

function FolderCrumb({
  last,
  name,
  prefix,
  baseUrl,
  region,
}: FolderCrumbProps) {
  if (last) {
    return <span className={`font-semibold`}>{name}</span>;
  }

  const folderChildrenQuery = new URLSearchParams({
    prefix,
    region,
  }).toString();

  const folderChildrenUrl = `${
    folderChildrenQuery ? `?${folderChildrenQuery}` : ''
  }`;

  return (
    <>
      <Link
        to={`${baseUrl}${folderChildrenUrl}`}
        className="font-semibold text-primary hover:cursor-pointer hover:underline"
      >
        {name}
      </Link>
      <span className="mx-1 text-muted-foreground">/</span>
    </>
  );
}

interface BucketItemCrumbProps {
  accountId?: string;
  bucketId?: string;
  folders: string[];
  region: string | null;
}

function BucketItemCrumb({
  accountId,
  bucketId,
  folders,
  region,
}: BucketItemCrumbProps) {
  if (!bucketId) {
    return <></>;
  }

  if (folders.length == 0) {
    return (
      <>
        <span className="mx-1 text-muted-foreground">/</span>
        <span className={`font-semibold`}>{bucketId}</span>
      </>
    );
  }

  const q = new URLSearchParams({ region: region || 'us-east-1' }).toString();

  return (
    <>
      <span className="mx-1 text-muted-foreground">/</span>
      <Link
        to={`/s3/${accountId}/buckets/${encodeURIComponent(bucketId)}?${q}`}
        className="font-semibold text-primary hover:cursor-pointer hover:underline"
      >
        {bucketId}
      </Link>
      <span className="mx-1 text-muted-foreground">/</span>
      {folders.map((f, index) => (
        <FolderCrumb
          name={f}
          key={index}
          baseUrl={`/s3/${accountId}/buckets/${encodeURIComponent(bucketId)}`}
          prefix={`${folders.slice(0, index + 1).join('/')}/`}
          last={index === folders.length - 1}
          region={region || 'us-east-1'}
        />
      ))}
    </>
  );
}
