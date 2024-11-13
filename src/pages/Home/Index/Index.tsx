import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
    faArrowRight,
    faBolt,
    faChartLine,
    faClipboard,
    faLink,
    faShare,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios, { AxiosError } from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const Index: React.FC = () => {
    const [url, setUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const isValidDomain = (domain: string): boolean => {
        if (!domain.includes('.')) return false;

        if (!/^[a-zA-Z0-9]/.test(domain)) return false;

        const domainRegex =
            /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9](\.[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])*\.[a-zA-Z]{2,}$/;
        return domainRegex.test(domain);
    };

    const normalizeUrl = (urlString: string): string => {
        urlString = urlString.trim();

        try {
            new URL(urlString);
            return urlString;
        } catch {
            if (
                !urlString.startsWith('http://') &&
                !urlString.startsWith('https://')
            ) {
                const domainPart = urlString.split('/')[0];

                if (!isValidDomain(domainPart)) {
                    throw new Error('Invalid domain');
                }

                return `https://${urlString}`;
            }
            throw new Error('Invalid URL');
        }
    };

    const handleCreateLink = async () => {
        if (!url) {
            toast.error('Vui lòng nhập URL cần rút gọn');
            return;
        }

        try {
            const normalizedUrl = normalizeUrl(url);
            setIsLoading(true);

            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/tai-khoan/dang-ky');
                return;
            }

            const { data } = await axios.post(
                '/api/links',
                { originalUrl: normalizedUrl },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                },
            );

            navigate('/lien-ket-da-tao', { state: { linkData: data } });
        } catch (error) {
            if (error instanceof Error && error.message === 'Invalid domain') {
                toast.error('Tên miền không hợp lệ. Vui lòng kiểm tra lại');
                return;
            }

            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<{ message: string }>;
                if (axiosError.response?.status === 401) {
                    navigate('/dang-ky');
                    return;
                }
                toast.error(
                    axiosError.response?.data?.message ?? 'Có lỗi xảy ra',
                );
            } else {
                toast.error('URL không hợp lệ. Vui lòng kiểm tra lại');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className=''>
            <section className='py-40 px-4'>
                <div className='max-w-4xl mx-auto text-center'>
                    <h1 className='text-5xl font-bold mb-6'>URL Shortener</h1>
                    <p className='text-xl text-gray-600 mb-12'>
                        Tạo các đường link ngắn gọn, dễ nhớ giúp bạn theo dõi và
                        chia sẻ dễ dàng
                    </p>
                    <div className='flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto'>
                        <input
                            type='url'
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder='Dán đường link cần rút gọn tại đây'
                            className='flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400'
                            autoFocus
                        />
                        <button
                            onClick={handleCreateLink}
                            disabled={isLoading}
                            className='px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {isLoading ? 'Đang xử lý...' : 'Tạo Link'}
                            {!isLoading && (
                                <FontAwesomeIcon icon={faArrowRight} />
                            )}
                        </button>
                    </div>
                </div>
            </section>

            <section className='py-20 px-4 bg-gray-50'>
                <h2 className='text-3xl font-bold text-center mb-12'>
                    Tạo Link Ngắn Gọn, Hiệu Quả
                </h2>
                <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8'>
                    <FeatureCard
                        icon={faLink}
                        title='Tùy Chỉnh'
                        description='Tạo các đường link thương hiệu'
                    />
                    <FeatureCard
                        icon={faChartLine}
                        title='Phân Tích'
                        description='Đếm lượt click và hiểu rõ người dùng'
                    />
                    <FeatureCard
                        icon={faBolt}
                        title='Nhanh Chóng'
                        description='Được tối ưu hóa về tốc độ và hiệu suất'
                    />
                </div>
            </section>

            <section className='py-20 px-4 bg-gray-50'>
                <div className='max-w-6xl mx-auto'>
                    <h2 className='text-3xl font-bold text-center mb-12'>
                        Nhanh Chóng, Đơn Giản
                    </h2>
                    <p className='text-gray-600 text-center mb-12'>
                        Tạo link rút gọn chỉ với 3 bước, chia sẻ với mọi người
                        ngay lập tức
                    </p>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
                        <StepCard
                            icon={faClipboard}
                            step='1'
                            title='Dán Link'
                            description='Dán link cần rút gọn vào ô input'
                        />
                        <StepCard
                            icon={faLink}
                            step='2'
                            title='Tạo Link'
                            description='Nhấn nút tạo link để nhận link rút gọn'
                        />
                        <StepCard
                            icon={faShare}
                            step='3'
                            title='Chia Sẻ'
                            description='Chia sẻ link rút gọn với mọi người'
                        />
                    </div>
                </div>
            </section>

            <section className='py-20 px-4'>
                <div className='max-w-4xl mx-auto text-center'>
                    <h2 className='text-3xl font-bold mb-6'>
                        Bắt đầu Rút Gọn Link Ngay Hôm Nay
                    </h2>
                    <p className='text-xl text-gray-600 mb-8'>
                        Đăng ký tài khoản để tuỳ chỉnh, theo dõi liên kết của
                        bạn.
                    </p>
                    <Link to='/tai-khoan'>
                        <button className='px-8 py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 text-lg font-semibold'>
                            Đăng Ký Miễn Phí
                        </button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

const FeatureCard: React.FC<{
    icon: IconDefinition;
    title: string;
    description: string;
}> = ({ icon, title, description }) => (
    <div className='p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-200 text-center'>
        <FontAwesomeIcon icon={icon} className='text-3xl mb-4' />
        <h3 className='text-xl font-semibold mb-2'>{title}</h3>
        <p className='text-gray-600'>{description}</p>
    </div>
);

const StepCard: React.FC<{
    icon: IconDefinition;
    step: string;
    title: string;
    description: string;
}> = ({ icon, step, title, description }) => (
    <div className='text-center'>
        <div className='relative inline-block'>
            <div className='w-16 h-16 bg-black rounded-full flex items-center justify-center mb-6 mx-auto'>
                <FontAwesomeIcon icon={icon} className='text-2xl text-white' />
            </div>
            <div className='absolute -top-2 -right-2 w-6 h-6 bg-gray-800 rounded-full text-white text-sm flex items-center justify-center'>
                {step}
            </div>
        </div>
        <h3 className='text-xl font-semibold mb-3'>{title}</h3>
        <p className='text-gray-600'>{description}</p>
    </div>
);

export default Index;
