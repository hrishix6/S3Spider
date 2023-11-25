import ReactDOM from 'react-dom/client'
import { App } from './domain/app/app.tsx'
import {Provider} from "react-redux";
import {store} from "./lib/store.ts";
import './index.css'
import { ThemeWrapper } from './domain/theme/theme.wrapper.tsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { LoginPage } from './domain/auth/login.page.tsx';
import { SignUpPage } from './domain/auth/sign.up.page.tsx';
import React from 'react';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/register",
    element: <SignUpPage />
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeWrapper>
        <RouterProvider router={router} />
      </ThemeWrapper>
    </Provider>
  </React.StrictMode>,
)
