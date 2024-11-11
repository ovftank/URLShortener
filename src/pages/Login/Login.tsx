import favicon from '@/assets/images/icon.png';
import React from 'react';
import { Helmet } from 'react-helmet-async';
const Login: React.FC = () => {
    return (
        <>
            <Helmet>
                <title>Login | OvFTeam</title>
                <link rel='shortcut icon' href={favicon} type='image/png' />
            </Helmet>
            Login
        </>
    );
};

export default Login;
