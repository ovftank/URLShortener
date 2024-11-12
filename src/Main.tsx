import '@/assets/styles/App.css';
import { AppRouter } from '@/router/AppRouter';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
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
            <Toaster
                position='top-center'
                toastOptions={{
                    className:
                        'bg-white text-zinc-800 shadow-xl border border-zinc-100 font-medium',
                    success: {
                        iconTheme: {
                            primary: '#18181B',
                            secondary: '#FFFFFF',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#18181B',
                            secondary: '#FFFFFF',
                        },
                    },
                }}
            />
        </HelmetProvider>
    </StrictMode>,
);
