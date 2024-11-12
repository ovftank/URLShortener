import favicon from '@/assets/images/icon.png';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ScrollToTop from '@/components/ScrollToTop';
import { FC, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Outlet, useLocation } from 'react-router-dom';
export const Home: FC = () => {
    const location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);
    return (
        <div className='h-screen'>
            <Helmet>
                <title>Trang chủ | OvFTeam</title>
                <link rel='shortcut icon' href={favicon} type='image/png' />
            </Helmet>
            <Header />
            <Outlet />
            <Footer />
            <ScrollToTop />
        </div>
    );
};
