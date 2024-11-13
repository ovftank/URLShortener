import { Request, Response } from 'express';
import { Database } from 'sqlite';
import { LinkService } from '@/services/link.service.js';
import { UserService } from '@/services/user.service.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'ovftank';

export class LinkController {
    private readonly linkService: LinkService;
    private readonly userService: UserService;

    constructor(db: Database) {
        this.linkService = new LinkService(db);
        this.userService = new UserService(db);
    }

    createLink = async (req: Request, res: Response): Promise<Response> => {
        const { originalUrl } = req.body;
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({
                status: 401,
                message: 'Không có quyền truy cập',
            });
        }

        if (!originalUrl) {
            return res.status(400).json({
                status: 400,
                message: 'URL gốc là bắt buộc',
            });
        }

        try {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
            const link = await this.linkService.createLink(
                originalUrl,
                decoded.userId
            );

            return res.status(201).json({
                status: 201,
                message: 'Tạo liên kết thành công',
                data: { link },
            });
        } catch (error) {
            if ((error as Error).message === 'Short URL already exists') {
                return res.status(409).json({
                    status: 409,
                    message: 'Liên kết rút gọn đã tồn tại',
                });
            }

            console.error('Lỗi khi tạo liên kết:', error);
            return res.status(500).json({
                status: 500,
                message: 'Lỗi hệ thống',
            });
        }
    };

    getLinks = async (req: Request, res: Response): Promise<Response> => {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({
                status: 401,
                message: 'Không có quyền truy cập',
            });
        }

        try {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
            const { page, limit } = req.query;

            const parsedPage = page ? parseInt(page as string, 10) : 1;
            const parsedLimit = limit ? parseInt(limit as string, 10) : 10;

            const result = await this.linkService.getUserLinks(decoded.userId, {
                page: parsedPage,
                limit: parsedLimit,
            });

            return res.status(200).json({
                status: 200,
                message: 'Thành công',
                data: result,
            });
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({
                    status: 401,
                    message: 'Token không hợp lệ',
                });
            }

            console.error('Lỗi khi lấy danh sách liên kết:', error);
            return res.status(500).json({
                status: 500,
                message: 'Lỗi hệ thống',
            });
        }
    };

    deleteLink = async (req: Request, res: Response): Promise<Response> => {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({
                status: 401,
                message: 'Không c quyền truy cập',
            });
        }

        try {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
            const { shortUrl } = req.params;

            await this.linkService.deleteLink(shortUrl, decoded.userId);

            return res.status(200).json({
                status: 200,
                message: 'Xóa liên kết thành công',
            });
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({
                    status: 401,
                    message: 'Token không hợp lệ',
                });
            }

            if ((error as Error).message === 'Link not found or unauthorized') {
                return res.status(404).json({
                    status: 404,
                    message: 'Không tìm thấy liên kết hoặc không có quyền xóa',
                });
            }

            console.error('Lỗi khi xóa liên kết:', error);
            return res.status(500).json({
                status: 500,
                message: 'Lỗi hệ thống',
            });
        }
    };

    redirect = async (
        req: Request,
        res: Response
    ): Promise<Response | void> => {
        try {
            const { shortUrl } = req.params;
            const link = await this.linkService.getLinkByShortUrl(shortUrl);

            if (!link) {
                return res.status(404).json({
                    status: 404,
                    message: 'Không tìm thấy liên kết',
                });
            }

            const seoHtml = `
                <!DOCTYPE html>
                <html lang="vi">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${link.title}</title>
                    <meta name="description" content="${link.description}" />
                    <meta name="robots" content="noindex,follow" />
                    <meta name="author" content="URL Shortener" />
                    <meta http-equiv="refresh" content="0;url=${link.original_url}" />
                    <meta property="og:type" content="website" />
                    <meta property="og:site_name" content="URL Shortener" />
                    <meta property="og:title" content="${link.title}" />
                    <meta property="og:description" content="${link.description}" />
                    <meta property="og:image" content="${link.og_image}" />
                    <meta property="og:image:alt" content="${link.title}" />
                    <meta property="og:url" content="${link.original_url}" />
                    <meta property="og:locale" content="vi_VN" />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content="${link.title}" />
                    <meta name="twitter:description" content="${link.description}" />
                    <meta name="twitter:image" content="${link.og_image}" />
                    <meta name="twitter:url" content="${link.original_url}" />
                    <link rel="canonical" href="${link.original_url}" />
                    <meta name="theme-color" content="#ffffff" />
                    <meta name="mobile-web-app-capable" content="yes" />
                    <meta name="apple-mobile-web-app-capable" content="yes" />
                    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                </head>
                <body>
                    <script>window.location.href = "${link.original_url}";</script>
                </body>
                </html>
            `;

            const ipAddress = req.ip ?? undefined;
            const userAgent = req.headers['user-agent'] ?? undefined;

            await this.linkService.recordAnalytics({
                linkId: link.id,
                ...(ipAddress && { ipAddress }),
                ...(userAgent && { userAgent }),
            });

            res.setHeader('Content-Type', 'text/html');
            if (link.is_custom) {
                return res.send(seoHtml);
            }

            return res.redirect(link.original_url);
        } catch (error) {
            console.error('Lỗi khi chuyển hướng:', error);
            return res.status(500).json({
                status: 500,
                message: 'Lỗi hệ thống',
            });
        }
    };

    updateLink = async (req: Request, res: Response): Promise<Response> => {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({
                status: 401,
                message: 'Không có quyền truy cập',
            });
        }

        try {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
            const { id } = req.params;
            const {
                title,
                description,
                ogImage,
                isCustom,
                shortUrl,
                originalUrl,
            } = req.body;

            if (
                !title &&
                !description &&
                !ogImage &&
                isCustom === undefined &&
                !shortUrl &&
                !originalUrl
            ) {
                return res.status(400).json({
                    status: 400,
                    message: 'Cần ít nhất một trường để cập nhật',
                });
            }

            if (
                originalUrl &&
                !originalUrl.startsWith('http://') &&
                !originalUrl.startsWith('https://')
            ) {
                return res.status(400).json({
                    status: 400,
                    message: 'URL gốc phải bắt đầu bằng http:// hoặc https://',
                });
            }

            const updatedLink = await this.linkService.updateLink({
                id,
                userId: decoded.userId,
                updates: {
                    ...(title !== undefined && { title }),
                    ...(description !== undefined && { description }),
                    ...(ogImage !== undefined && { ogImage }),
                    ...(isCustom !== undefined && { isCustom }),
                    ...(shortUrl !== undefined && { shortUrl }),
                    ...(originalUrl !== undefined && { originalUrl }),
                },
            });

            return res.status(200).json({
                status: 200,
                message: 'Cập nhật liên kết thành công',
                data: { link: updatedLink },
            });
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({
                    status: 401,
                    message: 'Token không hợp lệ',
                });
            }

            if ((error as Error).message === 'Link not found or unauthorized') {
                return res.status(404).json({
                    status: 404,
                    message:
                        'Không tìm thấy liên kết hoặc không có quyền cập nhật',
                });
            }

            if ((error as Error).message === 'Short URL already taken') {
                return res.status(409).json({
                    status: 409,
                    message: 'Short URL đã được sử dụng',
                });
            }

            console.error('Lỗi khi cập nhật liên kết:', error);
            return res.status(500).json({
                status: 500,
                message: 'Lỗi hệ thống',
            });
        }
    };
}
