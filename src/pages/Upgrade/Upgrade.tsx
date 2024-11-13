import { faCheck, faCopy, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface User {
    id: string;
    username: string;
    name: string;
    plan: string;
}

const Upgrade = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(300);

    const plan = searchParams.get('plan');
    const period = searchParams.get('period') ?? 'annual';

    const userStr = localStorage.getItem('user');
    const user: User = userStr ? JSON.parse(userStr) : null;

    const bankInfo = {
        bank: 'Timo Bank',
        accountNumber: '0362961990',
        accountHolder: 'TA TUAN ANH',
        transferContent: `nap ${user?.username ?? ''} ${period}`,
    };
    const getPlanDetails = () => {
        const isAnnual = period === 'annual';

        switch (plan) {
            case 'pro':
                return {
                    name: 'Pro',
                    price: isAnnual ? '349000' : '49000',
                    originalPrice: isAnnual ? '588000' : undefined,
                    period: isAnnual ? 'năm' : 'tháng',
                    features: [
                        '50 liên kết mỗi tháng',
                        'Thống kê chi tiết',
                        'Tùy chỉnh liên kết',
                        'Tải lên ảnh (10MB/ảnh)',
                        '100 ảnh mỗi tháng',
                    ],
                };
            case 'enterprise':
                return {
                    name: 'Enterprise',
                    price: isAnnual ? '929000' : '129000',
                    originalPrice: isAnnual ? '1548000' : undefined,
                    period: isAnnual ? 'năm' : 'tháng',
                    features: [
                        'Không giới hạn liên kết',
                        'Thống kê nâng cao',
                        'Tùy chỉnh hoàn toàn',
                        'Tải lên ảnh (20MB/ảnh)',
                        'Không giới hạn số lượng ảnh',
                    ],
                };
            default:
                navigate('/pricing');
                return null;
        }
    };

    const planDetails = getPlanDetails();

    const getQRUrl = () => {
        if (!planDetails) return '';

        const params = new URLSearchParams({
            accountName: 'TA TUAN ANH',
            amount: planDetails.price,
            addInfo: `nap ${user?.username ?? ''} ${period}`,
        });

        return `https://img.vietqr.io/image/963388-0362961990-compact.png?${params.toString()}`;
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token || !user) {
            navigate('/dang-nhap');
            toast.error('Vui lòng đăng nhập để nâng cấp tài khoản');
            return;
        }

        if (user.plan === plan) {
            navigate('/');
            toast.error('Bạn đã đăng ký gói này rồi');
            return;
        }

        if (!planDetails) return;

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate('/dashboard');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [planDetails, navigate, user, plan]);

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                toast.success(`Đã sao chép ${label}!`);
            })
            .catch(() => {
                toast.error('Không thể sao chép!');
            });
    };

    if (!planDetails) return null;

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className='min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4'>
            <Helmet>
                <title>Nâng cấp tài khoản | OvFTeam</title>
            </Helmet>

            <div className='max-w-7xl mx-auto'>
                <div className='text-center mb-10'>
                    <h1 className='text-3xl font-bold mb-4 text-black'>
                        Nâng cấp lên {planDetails?.name}
                    </h1>
                    <p className='text-gray-600'>
                        Quét mã QR hoặc chuyển khoản theo thông tin bên dưới để
                        nâng cấp tài khoản của bạn
                    </p>
                </div>

                <div className='grid md:grid-cols-2 gap-8'>
                    <div className='bg-white p-8 rounded-2xl shadow-lg border border-gray-100'>
                        <h2 className='text-xl font-semibold mb-6 flex items-center gap-2'>
                            <span className='w-1.5 h-1.5 bg-black rounded-full'></span>{' '}
                            Chi tiết gói
                        </h2>
                        <div className='mb-6'>
                            <div className='flex items-baseline gap-2 mb-2'>
                                {planDetails?.originalPrice && (
                                    <span className='text-lg text-gray-400 line-through'>
                                        {parseInt(
                                            planDetails.originalPrice,
                                        ).toLocaleString('vi-VN')}
                                        đ
                                    </span>
                                )}
                                <div className='text-4xl font-bold text-black'>
                                    {parseInt(
                                        planDetails?.price || '0',
                                    ).toLocaleString('vi-VN')}
                                    đ
                                </div>
                            </div>
                            <div className='text-gray-600'>
                                Thanh toán{' '}
                                {period === 'annual'
                                    ? 'hàng năm'
                                    : 'hàng tháng'}
                            </div>
                            {period === 'annual' && (
                                <div className='mt-2 inline-block bg-gray-100 text-black px-4 py-1.5 rounded-full text-sm font-medium'>
                                    Tiết kiệm 40%
                                </div>
                            )}
                        </div>

                        <ul className='space-y-4'>
                            {planDetails?.features.map((feature) => (
                                <li
                                    key={`${planDetails.name}-${feature}`}
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

                    <div className='bg-white p-8 rounded-2xl shadow-lg border border-gray-100'>
                        <h2 className='text-xl font-semibold mb-6 flex items-center gap-2'>
                            <span className='w-1.5 h-1.5 bg-black rounded-full'></span>{' '}
                            Thanh toán
                        </h2>

                        <div className='mb-6 p-4 bg-gray-50 rounded-xl'>
                            <h3 className='font-medium mb-3'>
                                Thông tin chuyển khoản:
                            </h3>
                            <div className='space-y-2'>
                                {Object.entries(bankInfo).map(
                                    ([key, value]) => (
                                        <div
                                            key={key}
                                            className='flex justify-between items-center'
                                        >
                                            <span className='text-gray-600'>
                                                {key === 'bank'
                                                    ? 'Ngân hàng'
                                                    : key === 'accountNumber'
                                                      ? 'Số tài khoản'
                                                      : key === 'accountHolder'
                                                        ? 'Chủ tài khoản'
                                                        : 'Nội dung chuyển khoản'}
                                                :
                                            </span>
                                            <div className='flex items-center gap-2'>
                                                <span className='font-medium select-all'>
                                                    {value}
                                                </span>
                                                {(key === 'accountNumber' ||
                                                    key ===
                                                        'transferContent') && (
                                                    <button
                                                        onClick={() =>
                                                            copyToClipboard(
                                                                value,
                                                                key ===
                                                                    'accountNumber'
                                                                    ? 'số tài khoản'
                                                                    : 'nội dung chuyển khoản',
                                                            )
                                                        }
                                                        className='p-1.5 text-gray-600 hover:text-black transition-colors duration-200'
                                                        title='Sao chép'
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faCopy}
                                                            className='text-sm'
                                                        />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>

                        <div className='text-center'>
                            <img
                                src={getQRUrl()}
                                alt='QR Payment'
                                className='mx-auto mb-4 max-w-[240px] rounded-xl shadow-md'
                            />
                            <div className='text-sm text-gray-600 mb-6'>
                                Quét mã QR bằng ứng dụng ngân hàng để thanh toán
                                nhanh chóng
                            </div>

                            <div className='text-center mt-6'>
                                <div className='py-3.5 px-4 rounded-xl font-medium bg-gray-50 text-gray-600'>
                                    <div className='flex items-center justify-center gap-2'>
                                        <FontAwesomeIcon
                                            icon={faSpinner}
                                            spin
                                        />
                                        <span>
                                            Vui lòng thanh toán trong{' '}
                                            {formatTime(countdown)}
                                        </span>
                                    </div>
                                </div>
                                <div className='mt-4 text-sm text-gray-600'>
                                    Đơn hàng sẽ tự động hủy sau khi hết thời
                                    gian
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='mt-8 text-center'>
                    <p className='text-gray-600 mb-2'>
                        Gặp kh khăn khi thanh toán?
                    </p>
                    <a
                        href='https://t.me/ovftank'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex items-center gap-2 text-black hover:text-gray-700 font-medium hover:underline'
                    >
                        Liên hệ hỗ trợ
                        <svg
                            className='w-4 h-4'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth='2'
                                d='M14 5l7 7m0 0l-7 7m7-7H3'
                            />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Upgrade;
