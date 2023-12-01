import {
    DataTableFile,
    FileDownloadMetadata,
    FileDownloadMetadataCalc,
    FileDownloadMetadataWithUrl,
    MAX_DOWNLOAD_LIMIT,
    MaxDownloadSizeExceededError
} from "../types/files.types";
import { getDownloadUrls } from "../api";
import { v4 as uuidv4 } from 'uuid';

function flushAsync(writer: WritableStreamDefaultWriter, reader: ReadableStreamDefaultReader) {
    return new Promise((resolve, reject) => {
        const flush = () =>
            reader.read()
                .then((res) => {
                    if (res.done) {
                        writer.close();
                        resolve(true);
                    } else {
                        writer.write(res.value).then(flush);
                    }
                }).catch((reason) => {
                    reject(reason);
                });

        flush();
    });

}

export async function downloadSingleFile(file: FileDownloadMetadataWithUrl) {
    const response = await fetch(file.url);

    console.log(response.status); //0
    if (!response.ok) {
        throw new Error("failed to download");
    }

    if (!response.body) {
        throw new Error("no response body");//printed
    }

    const readableStream = response.body;
    const fileStream = streamSaver.createWriteStream(file.name);
    console.log(`received file, streaming to disc`);

    if (window.WritableStream && readableStream.pipeTo) {
        console.log('pipeto available');
        await readableStream.pipeTo(fileStream)
    }
    else {
        console.log('came here pipeto not available');
        const writer = fileStream.getWriter();
        const reader = readableStream.getReader();
        await flushAsync(writer, reader);
    }
}

export async function downloadFilesAsync(accountId: string, bucket: string, files: FileDownloadMetadata[]) {
    const dlData = await getDownloadUrls(accountId, bucket, files);
    if (!dlData) {
        throw new Error("Couldn't get download urls...");
    }

    console.log(`received presigned urls..`);

    if (dlData.length == 1) {
        console.log(`downloading single file`);
        return await downloadSingleFile(dlData[0]);
    }

    const reqs = dlData.map((x) => fetch(x.url));
    const responses = await Promise.all(reqs);
    const fileStream = streamSaver.createWriteStream(`${uuidv4()}.zip`);
    const readableZipStream = new window.ZIP({
        start() { },
        pull: async (ctrl) => {
            const fileLikeList = responses.map((x, i) => {
                if (x.ok) {
                    return {
                        name: files[i].name,
                        body: x.body,
                    }
                }
                return null;
            });

            for (const file of fileLikeList) {
                if (file) {
                    if (file.body) {
                        ctrl.enqueue({
                            name: file.name,
                            stream: () => file.body,
                        });
                    }
                }
            }

            ctrl.close();
        },
    });

    if (window.WritableStream && readableZipStream.pipeTo) {
        await readableZipStream.pipeTo(fileStream);
    }
    else {
        const writer = fileStream.getWriter();
        const reader = readableZipStream.getReader();
        await flushAsync(writer, reader);
    }
}

export function calculateDownloadMetadata(files: DataTableFile[]): FileDownloadMetadataCalc {
    if (!files.length) {
        return { size: 0, files: [] };
    }

    let totalSize = 0;
    for (const f of files) {
        totalSize += f.size;
    }

    if (totalSize > MAX_DOWNLOAD_LIMIT) {
        throw new MaxDownloadSizeExceededError("selected files exceed download limit of 4GB");
    }

    return { files: files.map(x => ({ key: x.key, mimeType: x.mimeType!, name: x.name })), size: totalSize };
}