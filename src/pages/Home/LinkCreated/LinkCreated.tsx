import {
    faArrowDownLong,
    faArrowUpLong,
    faClipboard,
    faClipboardCheck,
    faEye,
    faLink,
    faPen,
    faSearch,
    faSpinner,
    faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import ModalDetail, { LinkDetailType } from './ModalDetail';

interface ApiResponse {
    status: number;
    message: string;
    data: {
        links: Array<{
            id: string;
            user_id: string;
            original_url: string;
            short_url: string;
            title: string | null;
            description: string | null;
            og_image: string | null;
            is_custom: number;
            clicks: number;
            storage_used: number;
            created_at: string;
            last_clicked_at: string | null;
        }>;
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    };
}

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
    const [links, setLinks] = useState<LinkDetailType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const limit = 10;
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<{
        total: number;
        totalPages: number;
    }>({ total: 0, totalPages: 0 });

    const fetchLinks = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await axios.get<ApiResponse>(
                `/api/links?page=${page}&limit=${limit}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                },
            );

            const transformedLinks: LinkDetailType[] =
                response.data.data.links.map((link) => ({
                    id: link.id,
                    originalUrl: link.original_url,
                    shortUrl: link.short_url,
                    clicks: link.clicks,
                    createdAt: link.created_at,
                    title: link.title ?? undefined,
                    description: link.description ?? undefined,
                    ogImage: link.og_image ?? undefined,
                    lastClickedAt: link.last_clicked_at ?? undefined,
                }));

            setLinks(transformedLinks);
            setPagination({
                total: response.data.data.pagination.total,
                totalPages: response.data.data.pagination.totalPages,
            });
        } catch (error) {
            toast.error('Không thể tải danh sách liên kết');
            console.error('Error fetching links:', error);
        } finally {
            setIsLoading(false);
        }
    }, [page, limit]);

    useEffect(() => {
        fetchLinks();
    }, [fetchLinks]);

    const handleDelete = async (shortUrl: string) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa liên kết này?')) {
            return;
        }

        try {
            const response = await axios.delete<ApiResponse>(
                `/api/links/${shortUrl}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                },
            );

            if (response.data.status === 200) {
                toast.success(response.data.message);
                fetchLinks();
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Không thể xóa liên kết';
            toast.error(errorMessage);
            console.error('Error deleting link:', error);
        }
    };

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
            .writeText(`${window.location.origin}/${text}`)
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
        try {
            const link = links.find((l) => l.id === id);
            if (!link) return;

            const response = await axios.put(
                `/api/links/${id}`,
                {
                    title: data.title,
                    description: data.description,
                    ogImage: data.ogImage,
                    originalUrl: data.originalUrl,
                    shortUrl:
                        data.shortUrl?.replace(
                            window.location.origin + '/',
                            '',
                        ) ?? '',
                    isCustom: data.isCustom,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                },
            );

            if (response.data.status === 200) {
                toast.success('Cập nhật liên kết thành công');
                await fetchLinks();
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage =
                    error.response?.data?.message ??
                    'Không thể cập nhật liên kết';
                toast.error(errorMessage);
            } else {
                toast.error('Không thể cập nhật liên kết');
            }
            console.error('Error updating link:', error);
        }
    };

    const openModal = (link: LinkDetailType) => {
        setSelectedLink(link);
        setIsModalOpen(true);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const renderPagination = () => (
        <div className='flex items-center justify-between mt-6 select-none'>
            <div className='text-sm text-gray-700'>
                Trang <span className='font-medium'>{page}</span>/{' '}
                <span className='font-medium'>{pagination.totalPages}</span>
            </div>
            <div className='flex gap-2'>
                <button
                    onClick={() => handlePageChange(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className='px-4 py-2 text-sm bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition-colors'
                >
                    Trang trước
                </button>
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= pagination.totalPages}
                    className='px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:hover:bg-black transition-colors'
                >
                    Trang tiếp
                </button>
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <FontAwesomeIcon
                    icon={faSpinner}
                    className='animate-spin text-3xl'
                    aria-label='Loading'
                />
            </div>
        );
    }

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
                                                    {window.location.origin}/
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
                                                    handleDelete(link.shortUrl)
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
                            {renderPagination()}
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
