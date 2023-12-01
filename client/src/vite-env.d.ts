/// <reference types="vite/client" />

declare interface ZipFileInput {
    name: string;
    stream: () => ReadableStream<Uint8Array> | null
    directory?: boolean;
}

declare interface ZipControl {
    enqueue: (input: ZipFileInput) => void;
    close: () => void;
}

declare interface ZipOptions {
    start: (ctrl: ZipControl) => void;
    pull: (ctrl: ZipControl) => Promise<void>
}

interface Window {
    ZIP: {
        new(arg: ZipOptions): ReadableStream
    }
}

declare const streamSaver = {
    createWriteStream: (...args: any[]) => any
}