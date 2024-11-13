import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';

interface LoginResponse {
    status: number;
    message: string;
    data: {
        user: {
            id: string;
            username: string;
            name: string;
            plan: string;
        };
        token: string;
    };
}

const Login: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rememberMe: false,
    });
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await axios.post<LoginResponse>('/api/login', {
                username: formData.username,
                password: formData.password,
            });

            const { token, user } = response.data.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            navigate('/tai-khoan');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const errorMessage =
                    err.response?.status === 401
                        ? 'Tên đăng nhập hoặc mật khẩu không chính xác'
                        : (err.response?.data?.message ??
                          'Đã có lỗi xảy ra. Vui lòng thử lại sau');
                setError(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
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
                    {error && (
                        <div className='p-3 text-sm text-red-500 bg-red-50 rounded-lg'>
                            {error}
                        </div>
                    )}
                    <div className='space-y-4'>
                        <div>
                            <label
                                htmlFor='username'
                                className='block text-sm font-medium mb-2'
                            >
                                Tên đăng nhập
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500'>
                                    <FontAwesomeIcon icon={faUser} />
                                </div>
                                <input
                                    id='username'
                                    name='username'
                                    type='text'
                                    autoComplete='username'
                                    required
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className='block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black/5 transition-all duration-300 hover:border-gray-300'
                                    placeholder='Tên đăng nhập'
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
                        disabled={isLoading}
                        className='w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
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
