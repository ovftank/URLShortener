import Loading from '@/components/Loading';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

export const Shorten: React.FC = () => {
    const location = useLocation();
    const url = location.pathname.split('/').pop();
    useEffect(() => {
        console.log(url);
    }, [url]);
    return (
        <div className='h-screen w-screen flex items-center justify-center'>
            <Helmet>
                <title>Rút gọn link | OvFTeam</title>
                <meta property='og:title' content='Rút gọn link | OvFTeam' />
                <meta
                    property='og:image'
                    content='https://ovfteam.com/og-image.png'
                />
            </Helmet>
            <Loading />
        </div>
    );
};
