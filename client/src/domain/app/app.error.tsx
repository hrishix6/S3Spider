
interface ErrorProps {
  message?: string
}

export function AppError({message = "Oops, Something isn't right."}: ErrorProps) {
  return (
    <div className="fixed flex flex-col gap-2 items-center justify-center bg-background top-0 left-0 h-full w-full text-destructive">
      <img src="logo.danger.svg" className="h-24 w-24 fill-destructive" />
      <h3>{message}</h3>
    </div>
  );
}
