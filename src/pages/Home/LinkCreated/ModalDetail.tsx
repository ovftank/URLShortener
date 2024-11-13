import { faClose, faLink, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
interface ModalDetailProps {
    isOpen: boolean;
    onClose: () => void;
    link: LinkDetailType | null;
    onSave?: (id: string, data: Partial<LinkDetailType>) => Promise<void>;
}

export interface LinkDetailType {
    id: string;
    originalUrl: string;
    shortUrl: string;
    clicks: number;
    createdAt: string;
    title?: string;
    description?: string;
    ogImage?: string;
    lastClickedAt?: string;
    isCustom?: boolean;
}

interface PreviewCardProps {
    formData: {
        ogImage: string;
        title: string;
        description: string;
    };
    shortUrl: string;
}

const PreviewCard: React.FC<PreviewCardProps> = ({ formData, shortUrl }) => (
    <div className='w-full max-w-xl mx-auto'>
        <div className='border rounded-lg overflow-hidden shadow-lg'>
            {formData.ogImage && (
                <div className='relative aspect-[1200/630] bg-gray-100'>
                    <img
                        src={formData.ogImage}
                        alt='Preview'
                        className='w-full h-full object-cover'
                        onError={(e) => {
                            (e.target as HTMLImageElement).src =
                                'https://placehold.co/1200x630/png?text=ovfteam.com';
                        }}
                    />
                </div>
            )}
            <div className='p-6'>
                <h3 className='text-xl font-bold mb-2'>
                    {formData.title || 'Chưa có tiêu đề'}
                </h3>
                <p className='text-gray-600 mb-4'>
                    {formData.description || 'Chưa có mô tả'}
                </p>
                <div className='flex items-center text-sm text-gray-500'>
                    <FontAwesomeIcon icon={faLink} className='mr-2' />
                    <span className='truncate'>{shortUrl}</span>
                </div>
            </div>
        </div>
    </div>
);

interface ImagePreviewProps {
    ogImage: string;
    onDelete: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ ogImage, onDelete }) => {
    const [imageLoading, setImageLoading] = useState(false);

    if (!ogImage) return null;

    return (
        <div className='relative aspect-[1200/630] bg-gray-100 rounded-lg overflow-hidden group'>
            {imageLoading && (
                <div className='absolute inset-0 flex items-center justify-center bg-gray-100 z-10'>
                    <div className='animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent'></div>
                </div>
            )}
            <img
                src={ogImage}
                alt='Preview'
                className='w-full h-full object-cover'
                onLoad={() => setImageLoading(false)}
                onError={(e) => {
                    setImageLoading(false);
                    (e.target as HTMLImageElement).src =
                        'https://placehold.co/1200x630/png?text=ovfteam.com';
                }}
            />
            <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                <button
                    type='button'
                    onClick={onDelete}
                    className='px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors'
                >
                    Xóa ảnh
                </button>
            </div>
        </div>
    );
};

const ModalDetail: React.FC<ModalDetailProps> = ({
    isOpen,
    onClose,
    link,
    onSave,
}) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        ogImage: '',
        originalUrl: '',
        shortUrl: '',
    });
    const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

    useEffect(() => {
        if (link) {
            setFormData({
                title: link.title ?? '',
                description: link.description ?? '',
                ogImage: link.ogImage ?? '',
                originalUrl: link.originalUrl,
                shortUrl: link.shortUrl,
            });
        }
    }, [link]);

    if (!isOpen || !link) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!onSave) return;

        try {
            await onSave(link.id, formData);
            onClose();
        } catch (error) {
            console.error('Error saving changes:', error);
            toast.error('Có lỗi xảy ra khi lưu thay đổi!');
        }
    };

    return (
        <div className='fixed inset-0 z-50 overflow-hidden bg-black/20 backdrop-blur-sm'>
            <Helmet>
                <title>Chỉnh sửa liên kết | OvFTeam</title>
            </Helmet>
            <div className='flex min-h-screen items-center justify-center p-4'>
                <div className='relative w-full max-w-6xl rounded-xl bg-white shadow-2xl flex flex-col max-h-[90vh]'>
                    <div className='flex items-center justify-between p-6 border-b bg-white sticky top-0 z-10'>
                        <h2 className='text-2xl font-bold'>
                            Chỉnh sửa liên kết
                        </h2>
                        <div className='flex items-center gap-4'>
                            <div className='flex rounded-lg border p-1'>
                                <button
                                    onClick={() => setActiveTab('edit')}
                                    className={`px-4 py-2 rounded-md transition-colors ${
                                        activeTab === 'edit'
                                            ? 'bg-black text-white'
                                            : 'hover:bg-gray-100'
                                    }`}
                                >
                                    Chỉnh sửa
                                </button>
                                <button
                                    onClick={() => setActiveTab('preview')}
                                    className={`px-4 py-2 rounded-md transition-colors ${
                                        activeTab === 'preview'
                                            ? 'bg-black text-white'
                                            : 'hover:bg-gray-100'
                                    }`}
                                >
                                    Xem trước
                                </button>
                            </div>
                            <button
                                onClick={onClose}
                                className='p-2 hover:bg-gray-100 rounded-full transition-colors'
                            >
                                <FontAwesomeIcon icon={faClose} />
                            </button>
                        </div>
                    </div>

                    <div className='p-6 overflow-y-auto flex-1'>
                        {activeTab === 'edit' ? (
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                                <div className='space-y-6'>
                                    <form
                                        onSubmit={handleSubmit}
                                        className='space-y-4'
                                    >
                                        <div>
                                            <label className='block text-sm font-medium mb-2'>
                                                URL gốc
                                            </label>
                                            <input
                                                type='url'
                                                value={formData.originalUrl}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        originalUrl:
                                                            e.target.value,
                                                    }))
                                                }
                                                className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black'
                                                placeholder='Điền URL cần rút gọn'
                                            />
                                        </div>

                                        <div>
                                            <label className='block text-sm font-medium mb-2'>
                                                URL rút gọn
                                            </label>
                                            <div className='flex gap-2'>
                                                <span className='px-4 py-2 bg-gray-50 border rounded-lg'>
                                                    {window.location.origin}/
                                                </span>
                                                <input
                                                    type='text'
                                                    value={formData.shortUrl
                                                        .split('/')
                                                        .pop()}
                                                    onChange={(e) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            shortUrl: `${window.location.origin}/${e.target.value}`,
                                                        }))
                                                    }
                                                    className='flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black'
                                                    placeholder='custom-url'
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className='block text-sm font-medium mb-2'>
                                                Tiêu đề
                                            </label>
                                            <input
                                                type='text'
                                                value={formData.title}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        title: e.target.value,
                                                    }))
                                                }
                                                className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black'
                                                placeholder='Nhập tiêu đề'
                                            />
                                        </div>

                                        <div>
                                            <label className='block text-sm font-medium mb-2'>
                                                Mô tả
                                            </label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        description:
                                                            e.target.value,
                                                    }))
                                                }
                                                className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black'
                                                rows={3}
                                                placeholder='Nhập mô tả'
                                            />
                                        </div>

                                        <div>
                                            <label className='block text-sm font-medium mb-2'>
                                                Ảnh thumbnail URL
                                            </label>
                                            <input
                                                type='url'
                                                value={formData.ogImage}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        ogImage: e.target.value,
                                                    }))
                                                }
                                                className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black'
                                                placeholder='Nhập URL ảnh thumbnail'
                                            />
                                            {formData.ogImage && (
                                                <div className='mt-4'>
                                                    <ImagePreview
                                                        ogImage={
                                                            formData.ogImage
                                                        }
                                                        onDelete={() => {
                                                            setFormData(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    ogImage: '',
                                                                }),
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            type='submit'
                                            className='w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2'
                                        >
                                            <FontAwesomeIcon icon={faSave} />
                                            Lưu thay đổi
                                        </button>
                                    </form>
                                </div>

                                <div className='space-y-6'>
                                    <div className='bg-gray-50 p-6 rounded-lg'>
                                        <h3 className='font-semibold mb-4'>
                                            Thống kê truy cập
                                        </h3>
                                        <div className='space-y-4'>
                                            <div className='flex justify-between'>
                                                <span>Tổng lượt truy cập:</span>
                                                <span className='font-semibold'>
                                                    {link.clicks}
                                                </span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span>Lần truy cập cuối:</span>
                                                <span className='font-semibold'>
                                                    {link.lastClickedAt ??
                                                        'Chưa có'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <PreviewCard
                                formData={formData}
                                shortUrl={link.shortUrl}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalDetail;
