import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/index.css';
import App from './App';
import './i18n/config';
import {pipeComponents} from "./utils/pipeComponents";
import {ApiProvider, SessionProvider, UserProvider} from "./context";

const Provider = pipeComponents(
  ApiProvider,
  SessionProvider,
  UserProvider
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider>
    <App />
  </Provider>
);