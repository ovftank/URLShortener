import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
    });
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        localStorage.setItem('token', '1234567890');
        navigate('/tai-khoan');
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
                <title>Tạo tài khoản mới | OvFTeam</title>
            </Helmet>

            <div className='w-full max-w-md space-y-8 animate-fadeIn'>
                <div className='text-center'>
                    <h2 className='text-3xl font-bold mb-2'>
                        Tạo tài khoản mới
                    </h2>
                    <p className='text-gray-600'>
                        Đăng ký để bắt đầu quản lý liên kết của bạn
                    </p>
                </div>

                <form onSubmit={handleSubmit} className='space-y-6'>
                    <div className='space-y-4'>
                        <div>
                            <label
                                htmlFor='username'
                                className='block text-sm font-medium mb-2'
                            >
                                Tên người dùng
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500'>
                                    <FontAwesomeIcon icon={faUser} />
                                </div>
                                <input
                                    id='username'
                                    name='username'
                                    type='text'
                                    required
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className='block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black/5 transition-all duration-300 hover:border-gray-300'
                                    placeholder='Tên người dùng'
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
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className='block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black/5 transition-all duration-300 hover:border-gray-300'
                                    placeholder='••••••••'
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor='confirmPassword'
                                className='block text-sm font-medium mb-2'
                            >
                                Xác nhận mật khẩu
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500'>
                                    <FontAwesomeIcon icon={faLock} />
                                </div>
                                <input
                                    id='confirmPassword'
                                    name='confirmPassword'
                                    type='password'
                                    required
                                    value={formData.confirmPassword}
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
                        Đăng ký
                    </button>

                    <p className='text-center text-sm text-gray-600'>
                        Đã có tài khoản?{' '}
                        <Link
                            to='/dang-nhap'
                            className='font-medium hover:underline'
                        >
                            Đăng nhập
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
