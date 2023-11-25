import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectAppError, selectAppLoading, selectErrorMessage } from './redux/app.reducer';
import { useEffect } from 'react';
import { initAppDataAsync } from './redux/app.async.actions';
import { AppError } from './app.error';
import { AppLoader } from "./app.loader";
import { Header } from "../layout/header";
import { Main } from "../layout/main";
import { Footer } from "../layout/footer";
import { AppProtectedRoute } from "./app.protected.route";
import { Files } from "../files/files";

export function App() {
  const dispatch = useAppDispatch();
  const apploading = useAppSelector(selectAppLoading);
  const appError = useAppSelector(selectAppError);
  const appErrorMessage = useAppSelector(selectErrorMessage);

  useEffect(() => {
    dispatch(initAppDataAsync());
  }, []);

  if (apploading) {
    return <AppLoader />;
  }

  if (appError) {
    return <AppError message={appErrorMessage} />;
  }

  return (
    <AppProtectedRoute>
      <div className="flex flex-col h-screen overflow-hidden relative">
        <Header />
        <Main>
            <Files />
        </Main>
        <Footer />
      </div>
    </AppProtectedRoute>
  );
}
