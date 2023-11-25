import { Folder, File } from "lucide-react";
import { DataTableFile } from "../types";
import { Row } from "@tanstack/react-table";
import { useAppDispatch } from "@/lib/hooks";
import { handleFolderClickAsync } from "../redux/files.async.actions";

export function ClickableFolderCell(row: Row<DataTableFile>)
{
    const dispatch = useAppDispatch();

    const handleFolderClick = () => {
        dispatch(handleFolderClickAsync(row.original));
    };
    
    const mimeType = row.getValue("mimeType");
    const name = row.getValue("name") as string;

    if(!mimeType)
    {
        return (
        <div className="flex items-center gap-2">
            <Folder className="h-4 w-4" />
            <span 
            onClick={handleFolderClick}
            className="hover:text-primary hover:underline hover:cursor-pointer"
            >{name}</span>
        </div>
        );
    }

    return(
        <div className="flex items-center gap-2">
            <File className="h-4 w-4" />
            <span>{name}</span>
        </div>
    );
}