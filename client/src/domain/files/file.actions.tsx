import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ChevronsUpDown } from 'lucide-react';


export function FileActions() {
  return (
      <div className='block md:hidden'>
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button className='focus-visible:ring-0' variant="ghost" size="icon">
                <ChevronsUpDown className='h-4 w-4' />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => {}}>
               Add File
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>
               Upload Folder
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>
               Delete
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>
               Rename
            </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
     </div>
  );
}
