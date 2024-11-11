import Account from '@/pages/Home/Account/Account';
import Analytics from '@/pages/Home/Analytics/Analytics';
import { Home } from '@/pages/Home/Home';
import Index from '@/pages/Home/Index/Index';
import LinkCreated from '@/pages/Home/LinkCreated/LinkCreated';
import { Shorten } from '@/pages/Shorten/Shorten';
import { createBrowserRouter } from 'react-router-dom';

export const AppRouter = createBrowserRouter(
    [
        {
            path: '/',
            element: <Home />,
            children: [
                {
                    index: true,
                    element: <Index />,
                },
                {
                    path: 'lien-ket-da-tao',
                    element: <LinkCreated />,
                },
                {
                    path: 'thong-ke',
                    element: <Analytics />,
                },
                {
                    path: 'tai-khoan',
                    element: <Account />,
                },
            ],
        },
        {
            path: ':url',
            element: <Shorten />,
        },
    ],
    {
        future: {
            v7_fetcherPersist: true,
            v7_relativeSplatPath: true,
            v7_normalizeFormMethod: true,
            v7_partialHydration: true,
            v7_skipActionErrorRevalidation: true,
        },
    },
);
