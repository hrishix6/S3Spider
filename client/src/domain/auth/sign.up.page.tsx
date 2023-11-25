import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { delay } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";
import { useAppSelector } from "@/lib/hooks";
import { selectIsAuthenticated } from "../app/redux/app.reducer";
import { Link, Navigate } from "react-router-dom";

export function SignUpPage() {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const [showPass, setShowPass] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    if(isAuthenticated)
    {
        return <Navigate to={"/"} replace />
    }


   async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>)
    {
        e.preventDefault();
        setLoading(true);
        await delay(2000);
        setLoading(false);
    }

    return (
        <section className="flex h-screen flex-col items-center justify-center">
            <div className="w-[550px] max-w-sm border-solid p-4 flex flex-col gap-5">
                <form className="w-full flex flex-col gap-4" onSubmit={handleFormSubmit}>
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center gap-1">
                            <img src="logo.svg" className="h-6 w-6" />
                            <h1 className="text-xl text-center text-primary">{APP_NAME}</h1>
                        </div>
                        <p className="text-base text-muted-foreground">create an account</p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" required autoComplete="" />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input id="password" type={showPass? "text": "password"} required autoComplete="password" />
                            <div className="absolute top-0 right-5 h-full flex flex-col items-center justify-center" onClick={()=>setShowPass(!showPass)}>
                                {showPass ? <EyeOff className="h-4 w-4" />: <EyeIcon className="h-4 w-4" />}
                            </div>
                        </div>
                    </div>
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Sign up
                    </Button>
                </form>
                <p className="text-center text-sm">
                    <span className="text-muted-foreground">Already have an account?</span> <Link className="text-primary underline" to="/login">Login</Link>
                </p>
            </div>
        </section>
    );
}
