import logo from '@/assets/images/icon.png';
import {
    faBars,
    faLink,
    faPaperPlane,
    faPlus,
    faSignOutAlt,
    faStar,
    faUser,
    faUserCircle,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, [location]);

    const menuItems = [
        { icon: faPlus, label: 'Tạo mới', path: '/' },
        { icon: faLink, label: 'Liên kết đã tạo', path: '/lien-ket-da-tao' },
        { icon: faStar, label: 'Bảng giá', path: '/bang-gia' },
    ];

    const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

    const isActivePath = (path: string) => location.pathname === path;

    const handleLogout = () => {
        setIsDropdownOpen(false);
        localStorage.clear();
        setIsLoggedIn(false);
        navigate('/dang-nhap');
    };

    return (
        <header
            className={`bg-white w-full shadow-md z-50 transition-all duration-300 ${
                isScrolled && !isDrawerOpen
                    ? 'fixed top-0 left-0 right-0 animate-slideDown'
                    : 'relative'
            }`}
        >
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
                        {isLoggedIn ? (
                            <div className='relative' ref={dropdownRef}>
                                <button
                                    onClick={() =>
                                        setIsDropdownOpen(!isDropdownOpen)
                                    }
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                                        isActivePath('/tai-khoan')
                                            ? 'text-black bg-gray-100 font-medium'
                                            : 'text-black/60 hover:text-black hover:bg-gray-50'
                                    }`}
                                >
                                    <FontAwesomeIcon icon={faUser} />
                                    <span>Tài khoản</span>
                                </button>
                                {isDropdownOpen && (
                                    <div className='absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transform transition-all duration-200 origin-top-right'>
                                        <div className='py-1'>
                                            <Link
                                                to='/tai-khoan'
                                                className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black transition-colors duration-150 ease-in-out'
                                                onClick={() =>
                                                    setIsDropdownOpen(false)
                                                }
                                            >
                                                <FontAwesomeIcon
                                                    icon={faUserCircle}
                                                    className='mr-2 transition-transform duration-150 group-hover:scale-110'
                                                />
                                                Hồ sơ
                                            </Link>
                                            <button
                                                className='flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black transition-colors duration-150 ease-in-out'
                                                onClick={handleLogout}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faSignOutAlt}
                                                    className='mr-2 transition-transform duration-150 group-hover:scale-110'
                                                />
                                                Đăng xuất
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                to='/dang-nhap'
                                className='flex items-center space-x-2 px-3 py-2 rounded-md transition-colors text-black/60 hover:text-black hover:bg-gray-50'
                            >
                                <FontAwesomeIcon icon={faUser} />
                                <span>Đăng nhập</span>
                            </Link>
                        )}
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
                        {isLoggedIn ? (
                            <>
                                <Link
                                    to='/tai-khoan'
                                    className={`flex items-center space-x-4 px-3 py-2 rounded-md transition-colors ${
                                        isActivePath('/tai-khoan')
                                            ? 'text-black bg-gray-100 font-medium'
                                            : 'text-black/60 hover:text-black hover:bg-gray-50'
                                    }`}
                                    onClick={toggleDrawer}
                                >
                                    <FontAwesomeIcon icon={faUserCircle} />
                                    <span>Hồ sơ</span>
                                </Link>
                                <button
                                    className='flex items-center space-x-4 w-full px-3 py-2 rounded-md transition-colors text-black/60 hover:text-black hover:bg-gray-50'
                                    onClick={() => {
                                        handleLogout();
                                        toggleDrawer();
                                    }}
                                >
                                    <FontAwesomeIcon icon={faSignOutAlt} />
                                    <span>Đăng xuất</span>
                                </button>
                            </>
                        ) : (
                            <Link
                                to='/dang-nhap'
                                className='flex items-center space-x-4 px-3 py-2 rounded-md transition-colors text-black/60 hover:text-black hover:bg-gray-50'
                                onClick={toggleDrawer}
                            >
                                <FontAwesomeIcon icon={faUser} />
                                <span>Đăng nhập</span>
                            </Link>
                        )}
                        <div className='absolute bottom-4 left-0 right-0 px-6'>
                            <div className='flex items-center justify-center gap-2'>
                                <a href='https://t.me/ovftank' target='_blank'>
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
