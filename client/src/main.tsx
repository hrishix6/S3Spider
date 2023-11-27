import ReactDOM from 'react-dom/client';
import { App } from './domain/app';
import { Provider } from 'react-redux';
import { store } from './store';
import './index.css';
import { ThemeWrapper } from './domain/theme';
import { BrowserRouter } from 'react-router-dom';
// import React from 'react';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <Provider store={store}>
    <ThemeWrapper>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeWrapper>
  </Provider>
  // {/* </React.StrictMode> */}
);
