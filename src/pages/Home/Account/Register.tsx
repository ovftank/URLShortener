import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

interface UserData {
    id: string;
    username: string;
    name: string;
    plan: string;
}

interface RegisterResponse {
    message: string;
    data: {
        user: UserData;
        token: string;
    };
}

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        name: '',
        confirmPassword: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        if (formData.password.length < 8) {
            toast.error('Mật khẩu phải có ít nhất 8 ký tự');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp');
            return false;
        }
        if (!formData.username || !formData.name) {
            toast.error('Vui lòng điền đầy đủ thông tin');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const response = await axios.post<RegisterResponse>(
                '/api/register',
                {
                    username: formData.username,
                    password: formData.password,
                    name: formData.name,
                },
            );

            const { token, user } = response.data.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            toast.success('Đăng ký thành công!');
            navigate('/tai-khoan');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage =
                    error.response?.status === 409
                        ? 'Tên người dùng đã tồn tại'
                        : (error.response?.data?.message ??
                          'Có lỗi xảy ra, vui lòng thử lại');
                toast.error(errorMessage);
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
                                htmlFor='name'
                                className='block text-sm font-medium mb-2'
                            >
                                Họ và tên
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500'>
                                    <FontAwesomeIcon icon={faUser} />
                                </div>
                                <input
                                    id='name'
                                    name='name'
                                    type='text'
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className='block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black/5 transition-all duration-300 hover:border-gray-300'
                                    placeholder='Họ và tên của bạn'
                                />
                            </div>
                        </div>
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
                        disabled={isLoading}
                        className='w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed'
                    >
                        {isLoading ? (
                            <span className='flex items-center justify-center'>
                                <svg
                                    className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                >
                                    <circle
                                        className='opacity-25'
                                        cx='12'
                                        cy='12'
                                        r='10'
                                        stroke='currentColor'
                                        strokeWidth='4'
                                    ></circle>
                                    <path
                                        className='opacity-75'
                                        fill='currentColor'
                                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                                    ></path>
                                </svg>
                                Đang xử lý...
                            </span>
                        ) : (
                            'Đăng ký'
                        )}
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
