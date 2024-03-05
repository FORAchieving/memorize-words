
import { createRoot } from 'react-dom/client';
import React from 'react';
import App from './pages/root';
import './assets/index.scss'

const rootEl:HTMLElement = document.getElementById('app')!;
const root = createRoot(rootEl);
root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);


