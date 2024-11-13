import { Request, Response } from 'express';
import { Database } from 'sqlite';
import { UserService } from '@/services/user.service.js';
import { LinkService } from '@/services/link.service.js';
import jwt from 'jsonwebtoken';
const JWT_SECRET = "ovftank"
export class UserController {
    private readonly authService: UserService;
    private readonly linkService: LinkService;

    constructor(db: Database) {
        this.authService = new UserService(db);
        this.linkService = new LinkService(db);
    }

    getProfile = async (req: Request, res: Response): Promise<Response> => {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({
                status: 401,
                message: 'Không có quyền truy cập',
            });
        }

        try {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
            const userId = decoded.userId;

            const user = await this.authService.getUserById(userId.toString());
            if (!user) {
                return res.status(404).json({
                    status: 404,
                    message: 'Không tìm thấy người dùng',
                });
            }

            const { links, customLinks } =
                await this.linkService.getUserResourceUsage(userId.toString());
            const planDetails = await this.authService.getPlanDetails(
                user.plan
            );

            const cycleLabel =
                user.subscription_cycle === 'monthly'
                    ? 'Hàng tháng'
                    : 'Hàng năm';

            return res.status(200).json({
                status: 200,
                message: 'Thành công',
                data: {
                    profile: {
                        name: user.name,
                        username: user.username,
                    },
                    resources: {
                        links: {
                            used: links,
                            total: planDetails.maxLinks,
                        },
                        customLinks: {
                            used: customLinks,
                            total: planDetails.maxCustomLinks,
                        },
                    },
                    subscription: {
                        plan: planDetails.name,
                        cycle: cycleLabel,
                        features: planDetails.features,
                    },
                },
            });
        } catch (error) {
            console.log(error);
            if (error instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({
                    status: 401,
                    message: 'Token không hợp lệ',
                });
            }

            console.error('Lỗi khi lấy thông tin người dùng:', error);
            return res.status(500).json({
                status: 500,
                message: 'Lỗi hệ thống',
            });
        }
    };

    updateProfile = async (req: Request, res: Response): Promise<Response> => {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({
                status: 401,
                message: 'Không có quyền truy cập',
            });
        }

        try {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
            const userId = decoded.userId;
            const { name, password } = req.body;

            const user = await this.authService.updateUser(userId.toString(), {
                name,
                password,
            });

            return res.status(200).json({
                status: 200,
                message: 'Cập nhật thông tin thành công',
                data: {
                    user: {
                        id: user.id,
                        username: user.username,
                        name: user.name,
                        plan: user.plan,
                        subscription_cycle: user.subscription_cycle,
                    },
                },
            });
        } catch (error) {
            console.log(error);
            if (error instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({
                    status: 401,
                    message: 'Token không hợp lệ',
                });
            }

            if ((error as Error).message === 'No fields to update') {
                return res.status(400).json({
                    status: 400,
                    message: 'Không có thông tin nào được cập nhật',
                });
            }

            console.error('Lỗi khi cập nhật thông tin người dùng:', error);
            return res.status(500).json({
                status: 500,
                message: 'Lỗi hệ thống',
            });
        }
    };
}
