import logo from '@/assets/images/icon.png';
import {
    faBars,
    faChartLine,
    faLink,
    faPaperPlane,
    faPlus,
    faUser,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const location = useLocation();

    const menuItems = [
        { icon: faPlus, label: 'Tạo mới', path: '/' },
        { icon: faLink, label: 'Liên kết đã tạo', path: '/lien-ket-da-tao' },
        { icon: faChartLine, label: 'Thống kê', path: '/thong-ke' },
        { icon: faUser, label: 'Tài khoản', path: '/tai-khoan' },
    ];

    const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

    const isActivePath = (path: string) => location.pathname === path;

    return (
        <header className='bg-white sticky top-0 shadow-md'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between h-16 items-center'>
                    <Link to='/' className='flex items-center'>
                        <img src={logo} alt='OvF Team' className='w-10 h-10' />
                        <span className='text-2xl font-bold text-black'>
                            URL Shortener
                        </span>
                    </Link>
                    <nav className='hidden md:flex space-x-8'>
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                                    isActivePath(item.path)
                                        ? 'text-black bg-gray-100 font-medium'
                                        : 'text-black/60 hover:text-black hover:bg-gray-50'
                                }`}
                            >
                                <FontAwesomeIcon icon={item.icon} />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                    <button
                        onClick={toggleDrawer}
                        className='md:hidden p-2 rounded-md text-black/60 hover:text-black hover:bg-gray-100'
                        aria-label='Toggle menu'
                    >
                        <FontAwesomeIcon
                            icon={isDrawerOpen ? faXmark : faBars}
                            size='lg'
                        />
                    </button>
                </div>
            </div>
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity md:hidden ${
                    isDrawerOpen
                        ? 'opacity-100'
                        : 'opacity-0 pointer-events-none'
                }`}
                onClick={toggleDrawer}
            >
                <div
                    className={`fixed inset-y-0 right-0 w-64 bg-white shadow-xl transform transition-transform ${
                        isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={toggleDrawer}
                        className='absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-black/60'
                        aria-label='Close menu'
                    >
                        <FontAwesomeIcon icon={faXmark} size='lg' />
                    </button>

                    <div className='p-6 pt-16 space-y-6'>
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-4 px-3 py-2 rounded-md transition-colors ${
                                    isActivePath(item.path)
                                        ? 'text-black bg-gray-100 font-medium'
                                        : 'text-black/60 hover:text-black hover:bg-gray-50'
                                }`}
                                onClick={toggleDrawer}
                            >
                                <FontAwesomeIcon icon={item.icon} />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                        <div className='absolute bottom-4 left-0 right-0 px-6'>
                            <div className='flex items-center justify-center gap-2'>
                                <a href='https://t.me/ovfta' target='_blank'>
                                    <FontAwesomeIcon
                                        icon={faPaperPlane}
                                        className='mr-1'
                                    />
                                    <span>Liên hệ</span>
                                </a>
                            </div>
                            <div className='text-sm text-black/50 text-center border-t pt-4'>
                                ©{' '}
                                <a href='https://ovfteam.com' target='_blank'>
                                    OvF Team
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
