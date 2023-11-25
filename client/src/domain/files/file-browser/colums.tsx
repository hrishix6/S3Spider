import {ColumnDef} from "@tanstack/react-table";
import { formatBytes, timeSince } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import {DataTableBucket, DataTableFile } from "../types";
import { ClickableFolderCell } from "./clickable.folder.cell";
import { ClickableBucketCell } from "./cliickable.bucket.cell";
// import { useAppDispatch } from "@/lib/hooks";

export const fileColumns: ColumnDef<DataTableFile>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell(props) {
            const comp = ClickableFolderCell(props.row);
            return comp;
        },
    },
    {
        accessorKey: "mimeType",
        header: "Type",
        cell({row}) {
            const mimeType = row.getValue("mimeType");

            if(!mimeType)
            {
                return <p className="text-muted-foreground">folder</p>
            }

            return <p className="text-muted-foreground">{mimeType as string}</p>
        },
    },
    {
        accessorKey: "lastModifiedAt",
        header: "Last Modified",
        cell({row}) {
            const dstring = row.getValue("lastModifiedAt");

            if(!dstring)
            {
                return <></>
            }

            const humaneReadableDate = timeSince(dstring as string);

            return <div className="text-muted-foreground">{humaneReadableDate}</div>
        },
    },
    {
        accessorKey: "size",
        header: "Size",
        cell({row}) {

            const sizeBytes = row.getValue("size");

            if(!sizeBytes)
            {
                return <></>
            }

            const formattedBytes = formatBytes(sizeBytes as number);

            return <div className="text-muted-foreground">{formattedBytes}</div>
            
        },
    },
    {
        id: "select",
        header: ({ table }) => (
            <div className="flex flex-col justify-center">
                <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                />
            </div>
        ),
        cell: ({ row }) => (
          <div className="flex flex-col justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
]

export const bucketColumns : ColumnDef<DataTableBucket>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell(props) {
            const comp = ClickableBucketCell(props.row);
            return comp;
        },
    },
    {
        accessorKey: "createdAt",
        header: "Created",
        cell({row}) {
            const dstring = row.getValue("createdAt");

            if(!dstring)
            {
                return <></>
            }

            const humaneReadableDate = timeSince(dstring as string);
            return <div className="text-muted-foreground">{humaneReadableDate}</div>
        },
    }
]