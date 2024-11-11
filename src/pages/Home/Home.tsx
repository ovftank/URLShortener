import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ScrollToTop from '@/components/ScrollToTop';
import { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { Outlet } from 'react-router-dom';
export const Home: FC = () => {
    return (
        <div className='h-screen'>
            <Helmet>
                <title>Trang chủ | OvFTeam</title>
            </Helmet>
            <Header />
            <Outlet />
            <Footer />
            <ScrollToTop />
        </div>
    );
};
