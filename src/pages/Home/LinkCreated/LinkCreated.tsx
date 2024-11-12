import {
    faArrowDownLong,
    faArrowUpLong,
    faClipboard,
    faClipboardCheck,
    faEye,
    faLink,
    faPen,
    faSearch,
    faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import ModalDetail, { LinkDetailType } from './ModalDetail';

const LinkCreated: React.FC = () => {
    const [selectedLink, setSelectedLink] = useState<LinkDetailType | null>(
        null,
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{
        key: keyof LinkDetailType;
        direction: 'asc' | 'desc';
    }>({ key: 'createdAt', direction: 'desc' });

    const [links] = useState<LinkDetailType[]>([
        {
            id: '1',
            originalUrl:
                'https://example.com/very/long/url/that/needs/to/be/shortened',
            shortUrl: 'https://ovft.me/abc123',
            clicks: 145,
            createdAt: '2024-03-15',
            title: 'Example Link',
            description: 'This is an example shortened link',
            ogImage: 'https://example.com/image.jpg',
            lastClickedAt: '2024-03-15 14:30',
            locationStats: [
                { country: 'Việt Nam', count: 100 },
                { country: 'USA', count: 30 },
                { country: 'Japan', count: 15 },
            ],
        },
        {
            id: '2',
            originalUrl: 'https://github.com/facebook/react',
            shortUrl: 'https://ovft.me/xyz789',
            clicks: 89,
            createdAt: '2024-03-14',
            title: 'React GitHub',
            description: 'React library repository',
            ogImage: 'https://github.com/favicon.ico',
            lastClickedAt: '2024-03-15 09:45',
            locationStats: [
                { country: 'USA', count: 45 },
                { country: 'India', count: 25 },
                { country: 'Việt Nam', count: 19 },
            ],
        },
    ]);

    const filteredAndSortedLinks = useMemo(() => {
        let result = [...links];

        if (searchTerm) {
            result = result.filter(
                (link) =>
                    link.shortUrl
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    link.originalUrl
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    link.title
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()),
            );
        }

        result.sort((a, b) => {
            if ((a[sortConfig.key] ?? '') < (b[sortConfig.key] ?? '')) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if ((a[sortConfig.key] ?? '') > (b[sortConfig.key] ?? '')) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        return result;
    }, [links, searchTerm, sortConfig]);

    const sortOptions = [
        { value: 'createdAt', label: 'Ngày tạo' },
        { value: 'clicks', label: 'Lượt click' },
        { value: 'title', label: 'Tiêu đề' },
        { value: 'shortUrl', label: 'URL rút gọn' },
    ] as const;

    const renderSortControls = () => (
        <div className='flex items-center gap-3 w-full sm:w-auto'>
            <span className='text-black'>Sắp xếp theo:</span>
            <select
                value={sortConfig.key}
                onChange={(e) =>
                    setSortConfig((prev) => ({
                        ...prev,
                        key: e.target.value as keyof LinkDetailType,
                    }))
                }
                className='flex-1 sm:flex-none px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 bg-white transition-all duration-300 hover:border-gray-300'
            >
                {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <div className='flex gap-1 bg-gray-100 rounded-lg p-1'>
                <button
                    onClick={() =>
                        setSortConfig((prev) => ({
                            ...prev,
                            direction: 'asc',
                        }))
                    }
                    className={`p-2 rounded transition-all duration-300 ${
                        sortConfig.direction === 'asc'
                            ? 'bg-white shadow-sm text-black scale-105'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                    title='Sắp xếp tăng dần'
                >
                    <FontAwesomeIcon icon={faArrowUpLong} />
                </button>
                <button
                    onClick={() =>
                        setSortConfig((prev) => ({
                            ...prev,
                            direction: 'desc',
                        }))
                    }
                    className={`p-2 rounded transition-all duration-300 ${
                        sortConfig.direction === 'desc'
                            ? 'bg-white shadow-sm text-black scale-105'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                    title='Sắp xếp giảm dần'
                >
                    <FontAwesomeIcon icon={faArrowDownLong} />
                </button>
            </div>
        </div>
    );

    const copyToClipboard = (id: string, text: string) => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                setCopiedLinkId(id);
                toast.success('Đã sao chép liên kết!');
                setTimeout(() => {
                    setCopiedLinkId(null);
                }, 2000);
            })
            .catch(() => {
                toast.error('Không thể sao chép liên kết!');
            });
    };

    const handleSave = async (id: string, data: Partial<LinkDetailType>) => {
        console.log('Saving link with id:', id, 'data:', data);
    };

    const handleDelete = (id: string) => {
        console.log('Deleting link with id:', id);
    };

    const openModal = (link: LinkDetailType) => {
        setSelectedLink(link);
        setIsModalOpen(true);
    };

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
            <Helmet>
                <title>Liên kết đã tạo | OvFTeam</title>
            </Helmet>

            <div className='mb-8'>
                <h1 className='text-3xl font-bold mb-4'>Liên kết đã tạo</h1>
                <p className='text-gray-600'>
                    Quản lý và theo dõi các liên kết rút gọn của bạn
                </p>
            </div>

            {links.length > 0 && (
                <div className='mb-6 space-y-4'>
                    <div className='flex flex-col gap-4 w-full'>
                        <div className='relative w-full'>
                            <FontAwesomeIcon
                                icon={faSearch}
                                className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                            />
                            <input
                                type='text'
                                placeholder='Tìm kiếm liên kết...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className='pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 transition-all duration-300 hover:border-gray-300'
                                autoFocus
                            />
                        </div>
                        {renderSortControls()}
                    </div>
                </div>
            )}

            {links.length > 0 ? (
                <>
                    {filteredAndSortedLinks.length > 0 ? (
                        <div className='space-y-6'>
                            {filteredAndSortedLinks.map((link) => (
                                <div
                                    key={link.id}
                                    className='bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 animate-fadeIn'
                                >
                                    <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                                        <div className='flex-1 min-w-0'>
                                            <div className='flex items-center gap-3 mb-2'>
                                                <h2 className='text-lg font-semibold truncate'>
                                                    {link.shortUrl}
                                                </h2>
                                                <button
                                                    onClick={() =>
                                                        copyToClipboard(
                                                            link.id,
                                                            link.shortUrl,
                                                        )
                                                    }
                                                    className='p-2 hover:bg-gray-100 rounded-full transition-colors'
                                                    aria-label='Copy link'
                                                >
                                                    <FontAwesomeIcon
                                                        icon={
                                                            copiedLinkId ===
                                                            link.id
                                                                ? faClipboardCheck
                                                                : faClipboard
                                                        }
                                                        className={`${copiedLinkId === link.id ? 'text-black' : 'text-gray-600'}`}
                                                    />
                                                </button>
                                            </div>
                                            <p className='text-gray-600 text-sm truncate mb-2'>
                                                {link.originalUrl}
                                            </p>
                                            <div className='flex items-center gap-4 text-sm text-gray-500'>
                                                <span className='flex items-center gap-1'>
                                                    <FontAwesomeIcon
                                                        icon={faEye}
                                                    />
                                                    {link.clicks} lượt truy cập
                                                </span>
                                                <span>
                                                    Tạo ngày {link.createdAt}
                                                </span>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-3'>
                                            <button
                                                onClick={() => openModal(link)}
                                                className='p-2 hover:bg-gray-100 rounded-full transition-colors text-black'
                                                aria-label='Edit link'
                                            >
                                                <FontAwesomeIcon icon={faPen} />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(link.id)
                                                }
                                                className='p-2 hover:bg-gray-100 text-black rounded-full transition-colors'
                                                aria-label='Delete link'
                                            >
                                                <FontAwesomeIcon
                                                    icon={faTrash}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='text-center py-16 px-4 animate-fadeIn'>
                            <div className='max-w-md mx-auto'>
                                <div className='bg-gray-50 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6'>
                                    <FontAwesomeIcon
                                        icon={faSearch}
                                        className='text-gray-400 text-3xl'
                                    />
                                </div>
                                <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                                    Không tìm thấy kết quả
                                </h3>
                                <p className='text-gray-600'>
                                    Không tìm thấy liên kết nào phù hợp với từ
                                    khóa "{searchTerm}"
                                </p>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className='text-center py-16 px-4'>
                    <div className='max-w-md mx-auto'>
                        <div className='bg-gray-50 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6'>
                            <FontAwesomeIcon
                                icon={faLink}
                                className='text-gray-400 text-3xl'
                            />
                        </div>
                        <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                            Chưa có liên kết nào
                        </h3>
                        <p className='text-gray-600 mb-8'>
                            Bắt đầu rút gọn URL của bạn để theo dõi và quản lý
                            chúng một cách dễ dàng
                        </p>
                        <a
                            href='/'
                            className='inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-sm hover:shadow-md'
                        >
                            Tạo liên kết mới
                        </a>
                    </div>
                </div>
            )}

            <ModalDetail
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                link={selectedLink}
                onSave={handleSave}
            />
        </div>
    );
};

export default LinkCreated;
