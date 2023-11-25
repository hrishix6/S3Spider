import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectBreadCrumbs } from "./redux/files.reducer";
import { BreadCrumb } from "./types";
import { handleCrumbClickAsync } from "./redux/files.async.actions";

interface BreadCrumItemProps {
    data: BreadCrumb;
    last: boolean;
    handleClick: (key: string) => void;
}

export function BreadCrumItem({last, data, handleClick}: BreadCrumItemProps)
{
    const {text, key} = data;

    if(last)
    {
        return <span className={`font-semibold`}>{text}</span>
    }

    return (
    <>
        <span 
        onClick={()=> {handleClick(key)}}
        className="text-primary hover:cursor-pointer hover:underline">
            {text}
        </span>
        <span className="mx-2 text-muted-foreground">/</span>
    </>
    );
}

export function Breadcrumbs() {
    const dispatch = useAppDispatch();
    const breadcrumbs = useAppSelector(selectBreadCrumbs);

    const handleClick = (key: string) => {
        dispatch(handleCrumbClickAsync(key));
    }


    return (
        <p className="mx-3"> 
            {breadcrumbs.map((x, i) => (<BreadCrumItem key={i} data={x} handleClick={handleClick} last={i == (breadcrumbs.length-1)} />))}
        </p>    
    )
}
