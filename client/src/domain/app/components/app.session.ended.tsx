import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/hooks";
import { sessionEndedConfirmation } from "..";

  export function AppSessionEndedPage() {
    const dispatch = useAppDispatch();
    function handleSessionEndConfirmation()
    {
        dispatch(sessionEndedConfirmation());
    }
    return (
      <div className="fixed flex flex-col gap-2 items-center justify-center bg-background top-0 left-0 h-full w-full text-destructive">
        <img src="logo.svg" className="h-24 w-24 fill-destructive" />
        <h3 className="font-semibold p-2 border border-muted bg-accent">
          Your session has ended, please sign in again.
        </h3>
        <Button variant={"default"} size={"lg"} onClick={handleSessionEndConfirmation}>
            Sign in
        </Button>
      </div>
    );
  }
  