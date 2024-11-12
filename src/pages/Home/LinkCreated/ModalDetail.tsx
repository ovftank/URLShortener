import {
    faClose,
    faImage,
    faLink,
    faSave,
    faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
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
    ogImage?: string;
    title?: string;
    description?: string;
    lastClickedAt?: string;
    locationStats?: Array<{
        country: string;
        count: number;
    }>;
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
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFileName, setSelectedFileName] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
            setIsUploading(true);
            let imageUrl = formData.ogImage;
            if (selectedFile) {
                const formData = new FormData();
                formData.append('image', selectedFile);

                const response = await axios.post('/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.status !== 200) throw new Error('Upload failed');

                const data = response.data;
                imageUrl = data.imageUrl;
            }
            await onSave(link.id, {
                ...formData,
                ogImage: imageUrl,
            });

            if (selectedFile) {
                URL.revokeObjectURL(formData.ogImage);
            }
            setSelectedFile(null);
            onClose();
        } catch (error) {
            console.error('Error saving changes:', error);
            toast.error('Có lỗi xảy ra khi lưu thay đổi!');
        } finally {
            setIsUploading(false);
        }
    };

    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedFileName(file.name);
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('File size should be less than 5MB');
            return;
        }

        setSelectedFile(file);

        const previewUrl = URL.createObjectURL(file);
        setFormData((prev) => ({
            ...prev,
            ogImage: previewUrl,
        }));
    };

    const triggerImageUpload = () => {
        fileInputRef.current?.click();
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
                                                Ảnh thumbnail
                                            </label>
                                            <div className='space-y-2'>
                                                <div className='flex gap-2'>
                                                    {selectedFileName && (
                                                        <div className='flex-1 px-4 py-2 bg-gray-50 border rounded-lg truncate'>
                                                            {selectedFileName}
                                                        </div>
                                                    )}
                                                    <button
                                                        type='button'
                                                        onClick={
                                                            triggerImageUpload
                                                        }
                                                        className='px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2 disabled:opacity-50 min-w-[120px]'
                                                        disabled={isUploading}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={
                                                                isUploading
                                                                    ? faSpinner
                                                                    : faImage
                                                            }
                                                            className={
                                                                isUploading
                                                                    ? 'animate-spin'
                                                                    : ''
                                                            }
                                                        />
                                                        <span>
                                                            {isUploading
                                                                ? 'Đang tải...'
                                                                : selectedFileName
                                                                  ? 'Thay đổi ảnh'
                                                                  : 'Tải lên'}
                                                        </span>
                                                    </button>
                                                </div>
                                                <ImagePreview
                                                    ogImage={formData.ogImage}
                                                    onDelete={() => {
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            ogImage: '',
                                                        }));
                                                        setSelectedFileName('');
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <input
                                            type='file'
                                            ref={fileInputRef}
                                            onChange={handleImageUpload}
                                            accept='image/*'
                                            className='hidden'
                                        />

                                        <button
                                            type='submit'
                                            disabled={isUploading}
                                            className='w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50'
                                        >
                                            {isUploading ? (
                                                <>
                                                    <FontAwesomeIcon
                                                        icon={faSpinner}
                                                        className='animate-spin'
                                                    />
                                                    Đang lưu...
                                                </>
                                            ) : (
                                                <>
                                                    <FontAwesomeIcon
                                                        icon={faSave}
                                                    />
                                                    Lưu thay đổi
                                                </>
                                            )}
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

                                    {link.locationStats && (
                                        <div className='bg-gray-50 p-6 rounded-lg'>
                                            <h3 className='font-semibold mb-4'>
                                                Vị trí truy cập
                                            </h3>
                                            <div className='space-y-2'>
                                                {link.locationStats.map(
                                                    (stat) => (
                                                        <div
                                                            key={stat.country}
                                                            className='flex justify-between'
                                                        >
                                                            <span>
                                                                {stat.country}:
                                                            </span>
                                                            <span>
                                                                {stat.count}
                                                            </span>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}
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
