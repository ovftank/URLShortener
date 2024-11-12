import {
    faCheck,
    faRocket,
    faShield,
    faStar,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

interface PricingFeature {
    text: string;
    included: boolean;
}

interface PricingPlan {
    name: string;
    price: string;
    originalPrice?: string;
    description: string;
    features: PricingFeature[];
    icon: typeof faRocket;
    popular?: boolean;
    buttonText: string;
    buttonLink: string;
}

const Pricing: React.FC = () => {
    const [isAnnual, setIsAnnual] = useState(true);

    const pricingPlans: PricingPlan[] = [
        {
            name: 'Cơ bản',
            price: '0đ',
            description: 'Dành cho người dùng cá nhân',
            icon: faRocket,
            features: [
                { text: '10 liên kết mỗi tháng', included: true },
                { text: 'Thống kê cơ bản', included: true },
                { text: 'Tùy chỉnh liên kết', included: false },
                { text: 'Tải lên ảnh (2MB/ảnh)', included: true },
                { text: '10 ảnh mỗi tháng', included: true },
            ],
            buttonText: 'Bắt đầu miễn phí',
            buttonLink: `/`,
        },
        {
            name: 'Pro',
            price: isAnnual ? '349.000đ' : '49.000đ',
            originalPrice: isAnnual ? '588.000đ' : undefined,
            description: 'Dành cho người dùng chuyên nghiệp',
            icon: faShield,
            popular: true,
            features: [
                { text: '50 liên kết mỗi tháng', included: true },
                { text: 'Thống kê chi tiết', included: true },
                { text: 'Tùy chỉnh liên kết', included: true },
                { text: 'Tải lên ảnh (10MB/ảnh)', included: true },
                { text: '100 ảnh mỗi tháng', included: true },
            ],
            buttonText: 'Nâng cấp ngay',
            buttonLink: `/nang-cap?plan=pro&period=${isAnnual ? 'annual' : 'monthly'}`,
        },
        {
            name: 'Enterprise',
            price: isAnnual ? '929.000đ' : '129.000đ',
            originalPrice: isAnnual ? '1.548.000đ' : undefined,
            description: 'Dành cho doanh nghiệp',
            icon: faStar,
            features: [
                { text: 'Không giới hạn liên kết', included: true },
                { text: 'Thống kê nâng cao', included: true },
                { text: 'Tùy chỉnh hoàn toàn', included: true },
                { text: 'Tải lên ảnh (20MB/ảnh)', included: true },
                { text: 'Không giới hạn số lượng ảnh', included: true },
            ],
            buttonText: 'Nâng cấp ngay',
            buttonLink: `/nang-cap?plan=enterprise&period=${isAnnual ? 'annual' : 'monthly'}`,
        },
    ];

    return (
        <div className='py-12 md:py-20 px-4 min-h-screen bg-gradient-to-b from-white to-gray-50'>
            <Helmet>
                <title>Bảng giá | OvFTeam</title>
            </Helmet>

            <div className='max-w-7xl mx-auto'>
                <div className='text-center mb-10 md:mb-16'>
                    <h1 className='text-3xl md:text-4xl font-bold mb-3 md:mb-4'>
                        Chọn gói phù hợp với bạn
                    </h1>
                    <p className='text-lg md:text-xl text-gray-600 mb-6 md:mb-8'>
                        Linh hoạt, minh bạch và phù hợp với mọi nhu cầu
                    </p>

                    <div className='flex items-center justify-center gap-3 md:gap-4 flex-wrap'>
                        <span
                            className={`text-sm ${!isAnnual ? 'text-gray-600' : 'text-black'}`}
                        >
                            Thanh toán tháng
                        </span>
                        <button
                            onClick={() => setIsAnnual(!isAnnual)}
                            className='relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 hover:opacity-90 active:scale-95'
                            style={{
                                backgroundColor: isAnnual ? 'black' : '#D1D5DB',
                            }}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${
                                    isAnnual ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                        <span
                            className={`text-sm ${isAnnual ? 'text-black' : 'text-gray-600'}`}
                        >
                            Thanh toán năm{' '}
                            <span className='text-green-500 font-medium whitespace-nowrap'>
                                (Tiết kiệm 40%)
                            </span>
                        </span>
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
                    {pricingPlans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative rounded-2xl border ${
                                plan.popular
                                    ? 'border-black shadow-xl md:scale-105'
                                    : 'border-gray-200'
                            } bg-white p-6 md:p-8 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]`}
                        >
                            {plan.popular && (
                                <div className='absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white px-3 md:px-4 py-1 rounded-full text-xs md:text-sm font-medium whitespace-nowrap'>
                                    Phổ biến nhất
                                </div>
                            )}

                            <div className='mb-6 md:mb-8'>
                                <FontAwesomeIcon
                                    icon={plan.icon}
                                    className={`text-2xl md:text-3xl mb-3 md:mb-4 ${
                                        plan.popular
                                            ? 'text-black'
                                            : 'text-gray-600'
                                    }`}
                                />
                                <h3 className='text-lg md:text-xl font-bold mb-2'>
                                    {plan.name}
                                </h3>
                                <p className='text-sm md:text-base text-gray-600 mb-4'>
                                    {plan.description}
                                </p>
                                <div className='flex items-baseline flex-wrap gap-2'>
                                    <div className='flex items-baseline gap-2'>
                                        {isAnnual && plan.originalPrice && (
                                            <span className='text-base md:text-lg text-gray-400 line-through'>
                                                {plan.originalPrice}
                                            </span>
                                        )}
                                        <span className='text-3xl md:text-4xl font-bold'>
                                            {plan.price}
                                        </span>
                                        <span className='text-sm md:text-base text-gray-600'>
                                            /{isAnnual ? 'năm' : 'tháng'}
                                        </span>
                                    </div>
                                    {isAnnual && plan.originalPrice && (
                                        <span className='bg-black/5 text-black text-xs md:text-sm px-2 py-1 rounded-full font-medium'>
                                            Tiết kiệm 40%
                                        </span>
                                    )}
                                </div>
                            </div>

                            <ul className='space-y-3 md:space-y-4 mb-6 md:mb-8'>
                                {plan.features.map((feature) => (
                                    <li
                                        key={`feature-${feature.text}`}
                                        className='flex items-center gap-2 md:gap-3 group'
                                    >
                                        <span
                                            className={`rounded-full p-1 ${
                                                feature.included
                                                    ? 'bg-black/5 text-black'
                                                    : 'bg-gray-100 text-gray-400'
                                            }`}
                                        >
                                            <FontAwesomeIcon
                                                icon={faCheck}
                                                className='text-xs'
                                            />
                                        </span>
                                        <span
                                            className={`text-sm md:text-base ${
                                                feature.included
                                                    ? 'text-gray-900'
                                                    : 'text-gray-400'
                                            } group-hover:translate-x-1 transition-transform`}
                                        >
                                            {feature.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                to={plan.buttonLink}
                                className={`group block w-full text-center px-4 md:px-6 py-2.5 md:py-3 rounded-lg
                                transition-all duration-300 text-sm md:text-base relative overflow-hidden
                                ${
                                    plan.name === 'Cơ bản'
                                        ? 'bg-white text-black border-2 border-black hover:bg-black hover:text-white active:scale-[0.98] hover:shadow-xl'
                                        : plan.popular
                                          ? 'bg-black hover:text-black active:scale-[0.98] hover:shadow-xl relative border-2 border-transparent hover:border-black'
                                          : plan.name === 'Enterprise'
                                            ? 'bg-white text-black hover:bg-black hover:text-white active:scale-[0.98] hover:shadow-xl relative after:absolute after:inset-0 after:border-2 after:border-black after:rounded-lg after:transition-all after:duration-300 hover:after:scale-105'
                                            : 'bg-gray-100 text-black hover:bg-gray-200 active:scale-[0.98] hover:shadow-lg'
                                }
                                ${
                                    plan.popular
                                        ? 'after:absolute after:inset-0 after:bg-white after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform after:duration-300 text-white hover:text-black'
                                        : ''
                                }
                                before:absolute before:inset-0 before:w-full before:h-full before:bg-gradient-to-r
                                before:from-transparent before:via-white/10 before:to-transparent before:-translate-x-full
                                hover:before:translate-x-full before:transition-transform before:duration-700
                                `}
                            >
                                <span className='relative z-10 inline-flex items-center gap-2'>
                                    {plan.buttonText}
                                    {plan.popular && (
                                        <svg
                                            className='w-4 h-4 transition-all duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                            stroke='currentColor'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth={2}
                                                d='M13 10V3L4 14h7v7l9-11h-7z'
                                            />
                                        </svg>
                                    )}
                                </span>
                            </Link>
                        </div>
                    ))}
                </div>

                <div className='mt-16 md:mt-20 text-center'>
                    <h2 className='text-xl md:text-2xl font-bold mb-3 md:mb-4'>
                        Có câu hỏi? Chúng tôi luôn sẵn sàng hỗ trợ
                    </h2>
                    <p className='text-sm md:text-base text-gray-600 mb-6 md:mb-8'>
                        Liên hệ với chúng tôi để được tư vấn gói dịch vụ phù hợp
                        nhất
                    </p>
                    <a
                        href='https://t.me/ovftank'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='group inline-flex items-center gap-2 px-6 py-3
                        bg-white text-black rounded-lg transition-all duration-300 text-sm md:text-base
                        hover:bg-black hover:text-white active:scale-[0.98] relative overflow-hidden
                        border-2 border-black hover:shadow-xl
                        before:absolute before:inset-0 before:w-full before:h-full before:bg-gradient-to-r
                        before:from-transparent before:via-black/10 before:to-transparent before:-translate-x-full
                        hover:before:translate-x-full before:transition-transform before:duration-700'
                    >
                        <span className='relative z-10 inline-flex items-center gap-2'>
                            Liên hệ ngay
                            <svg
                                className='w-4 h-4 transition-all duration-300 transform group-hover:-translate-y-1 group-hover:translate-x-1'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M14 5l7 7m0 0l-7 7m7-7H3'
                                />
                            </svg>
                        </span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
