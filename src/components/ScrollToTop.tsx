import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className={`
                        fixed bottom-8 right-8
                        w-12 h-12
                        flex items-center justify-center
                        bg-black text-white
                        hover:bg-white hover:text-black
                        border-2 border-black
                        rounded-full
                        transition-all duration-300 ease-in-out
                        shadow-lg
                        transform hover:scale-110
                        focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50
                        z-50
                    `}
                    aria-label='Scroll to top'
                >
                    <FontAwesomeIcon icon={faArrowUp} className='w-5 h-5' />
                </button>
            )}
        </>
    );
};

export default ScrollToTop;
