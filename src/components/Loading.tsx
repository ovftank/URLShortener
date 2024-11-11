import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface LoadingProps {
    text?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const Loading = ({ text, size = 'md', className = '' }: LoadingProps) => {
    const sizeClasses = {
        sm: 'text-xl',
        md: 'text-3xl',
        lg: 'text-5xl',
    };

    return (
        <div
            className={`flex flex-col items-center justify-center gap-3 ${className}`}
        >
            <FontAwesomeIcon
                icon={faSpinner}
                className={`animate-spin ${sizeClasses[size]}`}
                aria-label='Loading'
            />
            {text && <p className='text-sm'>{text}</p>}
        </div>
    );
};

export default Loading;
