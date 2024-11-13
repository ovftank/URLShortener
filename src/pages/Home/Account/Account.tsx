import {
    faCheck,
    faPen,
    faSpinner,
    faUser,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

interface AccountData {
    profile: {
        name: string;
        username: string;
    };
    resources: {
        links: {
            used: number;
            total: number;
        };
        customLinks: {
            used: number;
            total: number;
        };
    };
    subscription: {
        plan: string;
        cycle: string;
        features: string[];
    };
}

interface PasswordForm {
    newPassword: string;
    confirmPassword: string;
}

interface ProfileForm {
    name: string;
}

const initialAccountData: AccountData = {
    profile: {
        name: '',
        username: '',
    },
    resources: {
        links: {
            used: 0,
            total: 0,
        },
        customLinks: {
            used: 0,
            total: 0,
        },
    },
    subscription: {
        plan: '',
        cycle: '',
        features: [],
    },
};

const Account: React.FC = () => {
    const [accountData, setAccountData] =
        useState<AccountData>(initialAccountData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditingName, setIsEditingName] = useState(false);
    const [profileForm, setProfileForm] = useState<ProfileForm>({
        name: initialAccountData.profile.name,
    });
    const [passwordForm, setPasswordForm] = useState<PasswordForm>({
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await axios.get('/api/user', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });

                setAccountData(response.data.data);
                setError(null);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to fetch user data',
                );
                console.error('Error fetching user data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            await axios.put(
                '/api/user',
                { password: passwordForm.newPassword },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                },
            );

            setPasswordForm({
                newPassword: '',
                confirmPassword: '',
            });
            setError(null);
            toast.success('Mật khẩu đã được cập nhật thành công');
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : 'Không thể cập nhật mật khẩu';
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    const handleNameChange = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.put(
                '/api/user',
                { name: profileForm.name },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                },
            );

            setAccountData((prev) => ({
                ...prev,
                profile: {
                    ...prev.profile,
                    name: response.data.data.user.name,
                },
                subscription: {
                    ...prev.subscription,
                    plan: response.data.data.user.plan,
                    cycle: response.data.data.user.subscription_cycle,
                },
            }));

            setIsEditingName(false);
            setError(null);
            toast.success(response.data.message);
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Không thể cập nhật tên';
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    const formatResourceValue = (_: number | null, total: number) => {
        if (total === -1) return '∞';
        return total;
    };

    const calculateProgressWidth = (used: number | null, total: number) => {
        if (total === -1) return '0%';
        return `${((used ?? 0) / total) * 100}%`;
    };

    return (
        <>
            <Helmet>
                <title>Tài khoản | OvFTeam</title>
                <meta name='robots' content='noindex, nofollow' />
            </Helmet>

            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-12'>
                {loading ? (
                    <div className='flex justify-center items-center min-h-[200px]'>
                        <FontAwesomeIcon
                            icon={faSpinner}
                            className='animate-spin text-3xl'
                            aria-label='Loading'
                        />
                    </div>
                ) : error ? (
                    <div className='bg-red-50 text-red-600 p-4 rounded-lg'>
                        {error}
                    </div>
                ) : (
                    <>
                        <div className='bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-6'>
                            <div className='flex items-center justify-between'>
                                <h2 className='text-xl sm:text-2xl font-bold'>
                                    Hồ sơ
                                </h2>
                                {!isEditingName && (
                                    <button
                                        onClick={() => setIsEditingName(true)}
                                        className='text-sm flex items-center gap-2 text-gray-600 hover:text-black transition-colors'
                                    >
                                        <FontAwesomeIcon
                                            icon={faPen}
                                            className='w-4 h-4'
                                        />
                                        Chỉnh sửa
                                    </button>
                                )}
                            </div>
                            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-6'>
                                <div className='relative group'>
                                    <div className='w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden'>
                                        <FontAwesomeIcon
                                            icon={faUser}
                                            className='w-12 h-12 text-gray-400'
                                        />
                                    </div>
                                    <div className='absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center'>
                                        <button className='text-white opacity-0 group-hover:opacity-100 transition-opacity'>
                                            Thay đổi
                                        </button>
                                    </div>
                                </div>
                                <div className='flex-1 w-full'>
                                    {isEditingName ? (
                                        <form
                                            onSubmit={handleNameChange}
                                            className='space-y-4 w-full max-w-md'
                                        >
                                            <div className='space-y-2'>
                                                <label className='block text-sm font-medium text-gray-700'>
                                                    Tên hiển thị
                                                </label>
                                                <div className='relative'>
                                                    <input
                                                        type='text'
                                                        value={profileForm.name}
                                                        onChange={(e) =>
                                                            setProfileForm(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    name: e
                                                                        .target
                                                                        .value,
                                                                }),
                                                            )
                                                        }
                                                        className='w-full p-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all'
                                                        required
                                                        placeholder='Nhập tên của bạn'
                                                    />
                                                    {profileForm.name && (
                                                        <button
                                                            type='button'
                                                            onClick={() =>
                                                                setProfileForm({
                                                                    name: '',
                                                                })
                                                            }
                                                            className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={faXmark}
                                                                className='w-4 h-4'
                                                            />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <div className='flex gap-3'>
                                                <button
                                                    type='submit'
                                                    className='flex items-center justify-center gap-2 px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors'
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faCheck}
                                                        className='w-4 h-4'
                                                    />
                                                    Lưu thay đổi
                                                </button>
                                                <button
                                                    type='button'
                                                    onClick={() => {
                                                        setIsEditingName(false);
                                                        setProfileForm({
                                                            name: accountData
                                                                .profile.name,
                                                        });
                                                    }}
                                                    className='flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors'
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faXmark}
                                                        className='w-4 h-4'
                                                    />
                                                    Hủy
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className='space-y-2'>
                                            <div className='space-y-1'>
                                                <h3 className='text-2xl font-semibold'>
                                                    {accountData.profile.name}
                                                </h3>
                                                <p className='text-gray-600 flex items-center gap-2'>
                                                    <span>
                                                        @
                                                        {
                                                            accountData.profile
                                                                .username
                                                        }
                                                    </span>
                                                    {accountData.subscription
                                                        .plan !== 'Free' && (
                                                        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-black text-white'>
                                                            {
                                                                accountData
                                                                    .subscription
                                                                    .plan
                                                            }
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className='bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-6'>
                            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0'>
                                <h2 className='text-xl sm:text-2xl font-bold'>
                                    Giới hạn sử dụng
                                </h2>
                                <span className='text-sm text-gray-600'>
                                    Làm mới sau 30 ngày
                                </span>
                            </div>
                            <div className='grid gap-6 sm:grid-cols-2'>
                                <div className='space-y-3'>
                                    <div className='flex justify-between items-center'>
                                        <span className='font-medium'>
                                            Liên kết
                                        </span>
                                        <span className='text-sm text-gray-600'>
                                            {accountData.resources.links.used}/
                                            {formatResourceValue(
                                                accountData.resources.links
                                                    .used,
                                                accountData.resources.links
                                                    .total,
                                            )}{' '}
                                            liên kết
                                        </span>
                                    </div>
                                    <div className='h-2 bg-gray-100 rounded-full overflow-hidden'>
                                        <div
                                            className='h-full bg-black rounded-full'
                                            style={{
                                                width: calculateProgressWidth(
                                                    accountData.resources.links
                                                        .used,
                                                    accountData.resources.links
                                                        .total,
                                                ),
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                <div className='space-y-3'>
                                    <div className='flex justify-between items-center'>
                                        <span className='font-medium'>
                                            Liên kết tùy chỉnh
                                        </span>
                                        <span className='text-sm text-gray-600'>
                                            {
                                                accountData.resources
                                                    .customLinks.used
                                            }
                                            /
                                            {formatResourceValue(
                                                accountData.resources
                                                    .customLinks.used,
                                                accountData.resources
                                                    .customLinks.total,
                                            )}{' '}
                                            liên kết
                                        </span>
                                    </div>
                                    <div className='h-2 bg-gray-100 rounded-full overflow-hidden'>
                                        <div
                                            className='h-full bg-black rounded-full'
                                            style={{
                                                width: calculateProgressWidth(
                                                    accountData.resources
                                                        .customLinks.used,
                                                    accountData.resources
                                                        .customLinks.total,
                                                ),
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-6'>
                            <h2 className='text-xl sm:text-2xl font-bold'>
                                Gói dịch vụ
                            </h2>
                            <div className='bg-gray-50 p-4 rounded-lg'>
                                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0'>
                                    <div>
                                        <h3 className='font-medium'>
                                            Gói hiện tại:{' '}
                                            {accountData.subscription.plan}
                                        </h3>
                                        <p className='text-sm text-gray-600'>
                                            Chu kỳ thanh toán:{' '}
                                            {accountData.subscription.cycle}
                                        </p>
                                    </div>
                                    {accountData.subscription.plan !==
                                        'Enterprise' && (
                                        <Link
                                            to='/bang-gia'
                                            className='w-full sm:w-auto bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-center'
                                        >
                                            Nâng cấp
                                        </Link>
                                    )}
                                </div>
                            </div>
                            <div className='space-y-4'>
                                <h3 className='font-medium'>
                                    Tính năng gói{' '}
                                    {accountData.subscription.plan}
                                </h3>
                                <ul className='space-y-3'>
                                    {accountData.subscription.features.map(
                                        (feature) => (
                                            <li
                                                key={`feature-${feature}`}
                                                className='flex items-center gap-3'
                                            >
                                                <div className='w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center'>
                                                    <FontAwesomeIcon
                                                        icon={faCheck}
                                                        className='text-black text-sm'
                                                    />
                                                </div>
                                                <span className='text-gray-700'>
                                                    {feature}
                                                </span>
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </div>
                        </div>

                        <div className='bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-6'>
                            <h2 className='text-xl sm:text-2xl font-bold'>
                                Cài đặt
                            </h2>
                            <div className='w-full sm:max-w-md'>
                                <form
                                    onSubmit={handlePasswordChange}
                                    className='space-y-4'
                                >
                                    <h3 className='font-medium text-base sm:text-lg'>
                                        Đổi mật khẩu
                                    </h3>
                                    <div className='space-y-2'>
                                        <label className='block text-sm font-medium'>
                                            Mật khẩu mới
                                        </label>
                                        <input
                                            type='password'
                                            value={passwordForm.newPassword}
                                            onChange={(e) =>
                                                setPasswordForm((prev) => ({
                                                    ...prev,
                                                    newPassword: e.target.value,
                                                }))
                                            }
                                            className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent'
                                            required
                                            minLength={6}
                                        />
                                        <p className='text-xs text-gray-500'>
                                            Mật khẩu phải có ít nhất 6 ký tự
                                        </p>
                                    </div>
                                    <div className='space-y-2'>
                                        <label className='block text-sm font-medium'>
                                            Xác nhận mật khẩu mới
                                        </label>
                                        <input
                                            type='password'
                                            value={passwordForm.confirmPassword}
                                            onChange={(e) =>
                                                setPasswordForm((prev) => ({
                                                    ...prev,
                                                    confirmPassword:
                                                        e.target.value,
                                                }))
                                            }
                                            className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent'
                                            required
                                        />
                                    </div>
                                    <button
                                        type='submit'
                                        className='w-full sm:w-auto mt-4 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed'
                                        disabled={
                                            !passwordForm.newPassword ||
                                            !passwordForm.confirmPassword ||
                                            passwordForm.newPassword !==
                                                passwordForm.confirmPassword
                                        }
                                    >
                                        Cập nhật mật khẩu
                                    </button>
                                </form>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default Account;
