import '@/assets/styles/App.css';
import { AppRouter } from '@/router/AppRouter';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { RouterProvider } from 'react-router-dom';
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <HelmetProvider>
            <RouterProvider
                router={AppRouter}
                future={{
                    v7_startTransition: true,
                }}
            />
        </HelmetProvider>
    </StrictMode>,
);
