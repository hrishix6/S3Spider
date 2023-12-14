import { Link, useLocation, useParams } from 'react-router-dom';

interface BreadcrumbsProps {
  disableBucket?: boolean;
}

export function Breadcrumbs({ disableBucket }: BreadcrumbsProps) {
  const { accountId, bucketId, operation } = useParams();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const region = query.get('region');
  const prefix = query.get('prefix');

  const folders = prefix ? prefix.split('/').filter((x) => x !== '') : [];

  let baseUrl = `/s3/${encodeURIComponent(
    accountId!
  )}/buckets/${encodeURIComponent(bucketId!)}`;
  if (operation) {
    baseUrl = `/s3/${encodeURIComponent(
      accountId!
    )}/buckets/${encodeURIComponent(bucketId!)}/o/${operation}`;
  }

  return (
    <p className="mx-1">
      {disableBucket ? (
        <>
          <span className={`font-semibold`}>Buckets</span>
          {bucketId && <span className="mx-1 text-muted-foreground">/</span>}
        </>
      ) : (
        <>
          <Link
            to={`/s3/${accountId}/buckets`}
            className="font-semibold text-primary hover:cursor-pointer hover:underline"
          >
            Buckets
          </Link>
          {bucketId && <span className="mx-1 text-muted-foreground">/</span>}
        </>
      )}

      <BucketItemCrumb
        baseUrl={baseUrl}
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
  baseUrl: string;
  accountId?: string;
  bucketId?: string;
  folders: string[];
  region: string | null;
}

function BucketItemCrumb({
  bucketId,
  folders,
  region,
  baseUrl,
}: BucketItemCrumbProps) {
  if (!bucketId) {
    return <></>;
  }

  if (folders.length == 0) {
    return <span className={`font-semibold`}>{bucketId}</span>;
  }

  const q = new URLSearchParams({ region: region! }).toString();

  return (
    <>
      <Link
        to={`${baseUrl}?${q}`}
        className="font-semibold text-primary hover:cursor-pointer hover:underline"
      >
        {bucketId}
      </Link>
      <span className="mx-1 text-muted-foreground">/</span>
      {folders.map((f, index) => (
        <FolderCrumb
          name={f}
          key={index}
          baseUrl={baseUrl}
          prefix={`${folders.slice(0, index + 1).join('/')}/`}
          last={index === folders.length - 1}
          region={region!}
        />
      ))}
    </>
  );
}
