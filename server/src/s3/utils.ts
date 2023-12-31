import { _Object, CommonPrefix } from "@aws-sdk/client-s3";
import { File } from "./types";
import mime from "mime-types";

export function toFilefromObj(obj: _Object, prefix: string = ""): File | null {

    const mimetype = mime.lookup(obj.Key || "");
    const name = obj.Key ? obj.Key?.replaceAll(prefix, "") : "";

    if (!name) {
        return null;
    }

    return {
        name,
        key: obj.Key || "",
        kind: "file",
        mimeType: mimetype ? mimetype : "application/octet-stream",
        lastModifiedAt: obj.LastModified,
        size: obj.Size || 0
    }
}

export function toFileFromPrefix(childFolder: CommonPrefix, parentPrefix: string): File | null {
    const name = childFolder.Prefix ? childFolder.Prefix?.replaceAll(parentPrefix, "") : "";

    const slashRemoved = name.replaceAll("/", "");

    if (!name) {
        return null;
    }

    return {
        name: slashRemoved,
        key: childFolder.Prefix || "",
        kind: "folder",
        size: 0,
    }
}

export function getDirectory(path: string) {
    const tokens = path.split("/");
    return tokens.slice(0, tokens.length - 1).join("/")
}