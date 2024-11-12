import Account from '@/pages/Home/Account/Account';
import Login from '@/pages/Home/Account/Login';
import Register from '@/pages/Home/Account/Register';
import { Home } from '@/pages/Home/Home';
import Index from '@/pages/Home/Index/Index';
import LinkCreated from '@/pages/Home/LinkCreated/LinkCreated';
import Pricing from '@/pages/Home/Pricing/Pricing';
import Upgrade from '@/pages/Upgrade/Upgrade';
import { createBrowserRouter, Navigate } from 'react-router-dom';

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
                    path: 'tai-khoan',
                    element: <Account />,
                },
                {
                    path: 'dang-nhap',
                    element: <Login />,
                },
                {
                    path: 'dang-ky',
                    element: <Register />,
                },
                {
                    path: 'bang-gia',
                    element: <Pricing />,
                },
                {
                    path: 'nang-cap',
                    element: <Upgrade />,
                },
                {
                    path: '*',
                    element: <Navigate to='/' />,
                },
            ],
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
