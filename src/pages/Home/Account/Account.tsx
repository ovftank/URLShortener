import { faCheck, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
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
        storage: {
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
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

interface ProfileForm {
    name: string;
}

const mockAccountData: AccountData = {
    profile: {
        name: 'Nguyễn Văn A',
        username: 'nguyenvana',
    },
    resources: {
        links: {
            used: 32,
            total: 50,
        },
        storage: {
            used: 45,
            total: 100,
        },
        customLinks: {
            used: 8,
            total: 10,
        },
    },
    subscription: {
        plan: 'Pro',
        cycle: 'Hàng tháng',
        features: [
            '50 liên kết mỗi tháng',
            'Thống kê chi tiết',
            'Tùy chỉnh liên kết',
            'Tải lên ảnh (10MB/ảnh)',
            '100 ảnh mỗi tháng',
        ],
    },
};

const Account: React.FC = () => {
    const { profile, resources, subscription } = mockAccountData;
    const [isEditingName, setIsEditingName] = useState(false);
    const [profileForm, setProfileForm] = useState<ProfileForm>({
        name: profile.name,
    });
    const [passwordForm, setPasswordForm] = useState<PasswordForm>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically make an API call to update the password
        console.log('Password change submitted:', passwordForm);
        // Reset form after submission
        setPasswordForm({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
    };

    const handleNameChange = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically make an API call to update the name
        console.log('Name change submitted:', profileForm);
        setIsEditingName(false);
    };

    return (
        <>
            <Helmet>
                <title>Tài khoản | OvFTeam</title>
                <meta name='robots' content='noindex, nofollow' />
            </Helmet>

            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-12'>
                {/* Profile Section */}
                <div className='bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-6'>
                    <h2 className='text-xl sm:text-2xl font-bold'>Hồ sơ</h2>
                    <div className='flex flex-col sm:flex-row items-center gap-4'>
                        <div className='w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-full flex items-center justify-center'>
                            <FontAwesomeIcon
                                icon={faUser}
                                className='w-10 h-10 sm:w-12 sm:h-12 text-gray-400'
                            />
                        </div>
                        <div className='flex-1'>
                            {isEditingName ? (
                                <form
                                    onSubmit={handleNameChange}
                                    className='space-y-3'
                                >
                                    <input
                                        type='text'
                                        value={profileForm.name}
                                        onChange={(e) =>
                                            setProfileForm((prev) => ({
                                                ...prev,
                                                name: e.target.value,
                                            }))
                                        }
                                        className='w-full max-w-xs p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent'
                                        required
                                    />
                                    <div className='flex gap-2'>
                                        <button
                                            type='submit'
                                            className='px-3 py-1 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors'
                                        >
                                            Lưu
                                        </button>
                                        <button
                                            type='button'
                                            onClick={() => {
                                                setIsEditingName(false);
                                                setProfileForm({
                                                    name: profile.name,
                                                });
                                            }}
                                            className='px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors'
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className='space-y-1'>
                                    <div className='flex items-center gap-2'>
                                        <h3 className='text-xl font-semibold'>
                                            {profile.name}
                                        </h3>
                                        <button
                                            onClick={() =>
                                                setIsEditingName(true)
                                            }
                                            className='text-sm text-gray-600 hover:text-black transition-colors'
                                        >
                                            Chỉnh sửa
                                        </button>
                                    </div>
                                    <p className='text-gray-600'>
                                        @{profile.username}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Resources Section */}
                <div className='bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-6'>
                    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0'>
                        <h2 className='text-xl sm:text-2xl font-bold'>
                            Giới hạn sử dụng
                        </h2>
                        <span className='text-sm text-gray-600'>
                            Làm mới sau 30 ngày
                        </span>
                    </div>
                    <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                        {/* Links Usage */}
                        <div className='space-y-3'>
                            <div className='flex justify-between items-center'>
                                <span className='font-medium'>Liên kết</span>
                                <span className='text-sm text-gray-600'>
                                    {resources.links.used}/
                                    {resources.links.total} liên kết
                                </span>
                            </div>
                            <div className='h-2 bg-gray-100 rounded-full overflow-hidden'>
                                <div
                                    className='h-full bg-black rounded-full'
                                    style={{
                                        width: `${
                                            (resources.links.used /
                                                resources.links.total) *
                                            100
                                        }%`,
                                    }}
                                ></div>
                            </div>
                        </div>

                        {/* Storage Usage */}
                        <div className='space-y-3'>
                            <div className='flex justify-between items-center'>
                                <span className='font-medium'>Lưu trữ ảnh</span>
                                <span className='text-sm text-gray-600'>
                                    {resources.storage.used}/
                                    {resources.storage.total} ảnh
                                </span>
                            </div>
                            <div className='h-2 bg-gray-100 rounded-full overflow-hidden'>
                                <div
                                    className='h-full bg-black rounded-full'
                                    style={{
                                        width: `${
                                            (resources.storage.used /
                                                resources.storage.total) *
                                            100
                                        }%`,
                                    }}
                                ></div>
                            </div>
                        </div>

                        {/* Custom Links */}
                        <div className='space-y-3'>
                            <div className='flex justify-between items-center'>
                                <span className='font-medium'>
                                    Liên kết tùy chỉnh
                                </span>
                                <span className='text-sm text-gray-600'>
                                    {resources.customLinks.used}/
                                    {resources.customLinks.total} liên kết
                                </span>
                            </div>
                            <div className='h-2 bg-gray-100 rounded-full overflow-hidden'>
                                <div
                                    className='h-full bg-black rounded-full'
                                    style={{
                                        width: `${
                                            (resources.customLinks.used /
                                                resources.customLinks.total) *
                                            100
                                        }%`,
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Current Plan Section */}
                <div className='bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-6'>
                    <h2 className='text-xl sm:text-2xl font-bold'>
                        Gói dịch vụ
                    </h2>
                    <div className='bg-gray-50 p-4 rounded-lg'>
                        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0'>
                            <div>
                                <h3 className='font-medium'>
                                    Gói hiện tại: {subscription.plan}
                                </h3>
                                <p className='text-sm text-gray-600'>
                                    Chu kỳ thanh toán: {subscription.cycle}
                                </p>
                            </div>
                            {subscription.plan !== 'Enterprise' && (
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
                            Tính năng gói {subscription.plan}
                        </h3>
                        <ul className='space-y-3'>
                            {subscription.features.map((feature) => (
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
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Settings Section */}
                <div className='bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-6'>
                    <h2 className='text-xl sm:text-2xl font-bold'>Cài đặt</h2>
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
                                    Mật khẩu hiện tại
                                </label>
                                <input
                                    type='password'
                                    value={passwordForm.currentPassword}
                                    onChange={(e) =>
                                        setPasswordForm((prev) => ({
                                            ...prev,
                                            currentPassword: e.target.value,
                                        }))
                                    }
                                    className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent'
                                    required
                                />
                            </div>
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
                                            confirmPassword: e.target.value,
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
                                    !passwordForm.currentPassword ||
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
            </div>
        </>
    );
};

export default Account;
