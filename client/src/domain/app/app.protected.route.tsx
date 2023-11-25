import { useAppSelector } from "../../lib/hooks"
import { selectIsAuthenticated } from "./redux/app.reducer"
import {Navigate} from "react-router-dom";

interface Props {
    children?: React.ReactNode
}

export function AppProtectedRoute(props: Props) {

    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    if(!isAuthenticated)
    {
        return <Navigate to={"/login"} replace />
    }
    
    return (
        <>
          {props.children}
        </>
    )
}
