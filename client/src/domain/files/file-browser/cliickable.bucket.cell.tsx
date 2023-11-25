import { HardDrive} from "lucide-react";
import { DataTableBucket} from "../types";
import { Row } from "@tanstack/react-table";
import { useAppDispatch } from "@/lib/hooks";
import { handleBucketClickAsync } from "../redux/files.async.actions";

export function ClickableBucketCell(row: Row<DataTableBucket>)
{
    const dispatch = useAppDispatch();
    const {name} = row.original;

    const handleBucketClick = () => {
        dispatch(handleBucketClickAsync(row.original));
    };
    
    return(
        <div className="flex items-center gap-2">
            <HardDrive className="h-4 w-4" />
            <span 
            onClick={handleBucketClick}
            className="hover:text-primary hover:underline hover:cursor-pointer"
            >{name}</span>
        </div>
    );
}