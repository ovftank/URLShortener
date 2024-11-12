import { faGithub, faTelegram } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = [
        { label: 'Tạo mới', path: '/' },
        { label: 'Liên kết đã tạo', path: '/lien-ket-da-tao' },
        { label: 'Bảng giá', path: '/bang-gia' },
        { label: 'Tài khoản', path: '/tai-khoan' },
    ];

    const socialLinks = [
        {
            icon: faTelegram,
            href: 'https://t.me/ovftank',
            label: 'Telegram',
        },
        {
            icon: faGithub,
            href: 'https://github.com/ovftank',
            label: 'GitHub',
        },
        {
            icon: faEnvelope,
            href: 'mailto:admin@ovfteam.com',
            label: 'Email',
        },
    ];

    return (
        <footer className='bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='py-12'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                        <div className='space-y-4'>
                            <h3 className='text-lg font-bold'>URL Shortener</h3>
                            <p className='text-gray-600'>
                                Ngắn Gọn - Thông Minh - Hiệu Quả
                            </p>
                        </div>
                        <div className='space-y-4'>
                            <h3 className='text-lg font-bold'>Liên kết</h3>
                            <ul className='space-y-2'>
                                {footerLinks.map((link) => (
                                    <li key={link.path}>
                                        <Link
                                            to={link.path}
                                            className='text-gray-600 hover:text-black transition-colors'
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className='space-y-4'>
                            <h3 className='text-lg font-bold'>Kết nối</h3>
                            <div className='flex space-x-4'>
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.href}
                                        href={social.href}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='text-gray-600 hover:text-black transition-colors'
                                        aria-label={social.label}
                                    >
                                        <FontAwesomeIcon
                                            icon={social.icon}
                                            size='lg'
                                        />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className='mt-12 pt-8 border-t'>
                        <div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
                            <p className='text-gray-600 text-sm'>
                                © {currentYear} OvF Team. All rights reserved.
                            </p>
                            <p className='text-gray-600 text-sm flex items-center'>
                                Made with
                                <FontAwesomeIcon
                                    icon={faHeart}
                                    className='mx-1 text-black'
                                />
                                by
                                <a
                                    href='https://ovfteam.com'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='ml-1 text-black hover:underline'
                                >
                                    OvF Team
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
