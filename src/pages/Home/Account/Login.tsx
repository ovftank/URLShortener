import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        localStorage.setItem('token', '1234567890');
        navigate('/tai-khoan');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/tai-khoan');
        }
    }, [navigate]);

    return (
        <div className='min-h-[calc(100vh-4rem)] flex items-center justify-center p-4'>
            <Helmet>
                <title>Đăng nhập | OvFTeam</title>
            </Helmet>

            <div className='w-full max-w-md space-y-8 animate-fadeIn'>
                <div className='text-center'>
                    <h2 className='text-3xl font-bold mb-2'>
                        Chào mừng trở lại
                    </h2>
                    <p className='text-gray-600'>
                        Đăng nhập để quản lý các liên kết của bạn
                    </p>
                </div>

                <form onSubmit={handleSubmit} className='space-y-6'>
                    <div className='space-y-4'>
                        <div>
                            <label
                                htmlFor='email'
                                className='block text-sm font-medium mb-2'
                            >
                                Email
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500'>
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </div>
                                <input
                                    id='email'
                                    name='email'
                                    type='email'
                                    autoComplete='email'
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className='block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black/5 transition-all duration-300 hover:border-gray-300'
                                    placeholder='Email'
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor='password'
                                className='block text-sm font-medium mb-2'
                            >
                                Mật khẩu
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500'>
                                    <FontAwesomeIcon icon={faLock} />
                                </div>
                                <input
                                    id='password'
                                    name='password'
                                    type='password'
                                    autoComplete='current-password'
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className='block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black/5 transition-all duration-300 hover:border-gray-300'
                                    placeholder='••••••••'
                                />
                            </div>
                        </div>
                    </div>
                    <button
                        type='submit'
                        className='w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200'
                    >
                        Đăng nhập
                    </button>
                    <p className='text-center text-sm text-gray-600'>
                        Chưa có tài khoản?{' '}
                        <Link
                            to='/dang-ky'
                            className='font-medium hover:underline'
                        >
                            Đăng ký ngay
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
