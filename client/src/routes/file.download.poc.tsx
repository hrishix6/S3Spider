import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface DownloadItem {
  id: string;
  aborter: AbortController;
  loading: boolean;
  cancelled: boolean;
  completed: boolean;
  error: boolean;
}

const delayWithCancellation = (ms: number, signal: AbortSignal) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      resolve(null);
    }, ms);

    signal.addEventListener('abort', () => {
      console.log('cancelling fake timer...');
      clearTimeout(timer);
      const error = new Error('User canncelled');
      error.name = 'AbortError';
      reject(error);
    });
  });
};

export function FileDownloadPoc() {
  const [dls, setDl] = useState<DownloadItem[]>([]);

  const updateDlState = (
    id: string,
    status: 'cancelled' | 'complete' | 'error'
  ) => {
    setDl((prev) => {
      console.log(prev);
      const copy = [...prev];
      const itemIndex = copy.findIndex((x) => x.id === id);
      if (itemIndex > -1) {
        copy[itemIndex];
        switch (status) {
          case 'complete':
            copy[itemIndex].loading = false;
            copy[itemIndex].completed = true;
            break;
          case 'cancelled':
            copy[itemIndex].cancelled = true;
            copy[itemIndex].loading = false;
            break;
          case 'error':
            copy[itemIndex].error = true;
            copy[itemIndex].loading = false;
            break;
          default:
            break;
        }
      }
      return copy;
    });
  };

  const handleDownload = async () => {
    const abortController = new AbortController();
    const dlItem: DownloadItem = {
      id: uuidv4(),
      loading: true,
      aborter: abortController,
      cancelled: false,
      completed: false,
      error: false,
    };

    setDl((prev) => [...prev, dlItem]);

    try {
      await delayWithCancellation(5000, abortController.signal);

      const files = ['file.csv', 'file.mp4', 'file.gif'];
      const reqs = files.map((x) =>
        fetch(`http://localhost:5000/api/v1/files/${x}`, {
          method: 'post',
          signal: abortController.signal,
        })
      );

      const responses = await Promise.all(reqs);

      const fileStream = streamSaver.createWriteStream(`${dlItem.id}.zip`);

      const readableZipStream = new window.ZIP({
        start(_) {},
        pull: async (ctrl) => {
          const fileLikeList = responses.map((x, i) => ({
            name: files[i],
            body: x.body,
          }));

          for (const file of fileLikeList) {
            if (file.body) {
              ctrl.enqueue({
                name: `folder/${file.name}`,
                stream: () => file.body,
              });
            }
          }
          ctrl.close();
        },
      });

      // more optimized
      if (window.WritableStream && readableZipStream.pipeTo) {
        readableZipStream
          .pipeTo(fileStream, { signal: abortController.signal })
          .then(() => {
            console.log('done writing');
            updateDlState(dlItem.id, 'complete');
          })
          .catch(() => {
            console.log(`error occured or user cancelled download...`);
            updateDlState(dlItem.id, 'cancelled');
          });
      } else {
        const writer = fileStream.getWriter();
        const reader = readableZipStream.getReader();

        abortController.signal.addEventListener('abort', () => {
          console.log(`user cancelled download...`);
          writer.abort();
          updateDlState(dlItem.id, 'cancelled');
        });

        const pump: any = () =>
          reader.read().then((res) => {
            if (res.done) {
              writer.close();
              updateDlState(dlItem.id, 'complete');
            } else {
              writer.write(res.value).then(pump);
            }
          });

        pump();
      }
    } catch (error) {
      const e = error as Error;
      console.log(e);
      if (e.name == 'AbortError') {
        console.log('user aborted download');
        updateDlState(dlItem.id, 'cancelled');
      } else {
        updateDlState(dlItem.id, 'error');
      }
    }
  };

  return (
    <>
      <div>
        <Button onClick={handleDownload}>Start</Button>
      </div>
      <section>
        <h2>Downloads</h2>
        <div className="flex flex-col gap-4">
          {dls.map((x) => (
            <>
              <div
                key={`${x.id}_meta`}
                className="flex items-center px-2 py-1 gap-2 border"
              >
                <p>{x.id}</p>
                {x.loading && (
                  <>
                    <p className="tex-sm font-semibold text-orange-400">
                      In Progress...
                    </p>
                    <Button onClick={() => x.aborter.abort()}>Cancel</Button>
                  </>
                )}
                {x.cancelled && (
                  <p className="text-red-400 font-semibold text-sm">
                    Cancelled
                  </p>
                )}
                {x.completed && (
                  <p className="text-green-400 font-semibold text-sm">
                    Completed
                  </p>
                )}
                {x.error && (
                  <p className="text-red-400 font-semibold text-sm">Error</p>
                )}
              </div>
              {x.loading && (
                <div key={`${x.id}_progress`} className="progress-bar">
                  <div className="progress-bar-value"></div>
                </div>
              )}
            </>
          ))}
        </div>
      </section>
    </>
  );
}
