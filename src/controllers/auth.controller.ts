import { Request, Response } from 'express';
import { Database } from 'sqlite';
import jwt from 'jsonwebtoken';
import { UserService } from '@/services/user.service.js';

const JWT_SECRET = 'ovftank';
const TOKEN_EXPIRY = '7d';

export class AuthController {
    private readonly authService: UserService;

    constructor(db: Database) {
        this.authService = new UserService(db);
    }

    private generateToken(
        userId: string,
        username: string,
        plan: string
    ): string {
        return jwt.sign({ userId, username, plan }, JWT_SECRET, {
            expiresIn: TOKEN_EXPIRY,
        });
    }

    register = async (req: Request, res: Response): Promise<Response> => {
        const { username, password, name } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                status: 400,
                message: 'Username và mật khẩu là bắt buộc',
            });
        }

        try {
            const user = await this.authService.registerUser(
                username,
                password,
                name
            );
            const token = this.generateToken(user.id, user.username, user.plan);

            return res.status(201).json({
                status: 201,
                message: 'Đăng ký thành công',
                data: {
                    user: {
                        id: user.id,
                        username: user.username,
                        name: user.name,
                        plan: user.plan,
                    },
                    token,
                },
            });
        } catch (error) {
            if ((error as Error).message === 'Username already exists') {
                return res.status(409).json({
                    status: 409,
                    message: 'Tên người dùng đã tồn tại',
                });
            }

            console.error('Lỗi đăng ký:', error);
            return res.status(500).json({
                status: 500,
                message: 'Đã xảy ra lỗi khi đăng ký',
            });
        }
    };

    login = async (req: Request, res: Response): Promise<Response> => {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                status: 400,
                message: 'Username và mật khẩu là bắt buộc',
            });
        }

        try {
            const user = await this.authService.loginUser(username, password);
            const token = this.generateToken(user.id, user.username, user.plan);

            return res.status(200).json({
                status: 200,
                message: 'Đăng nhập thành công',
                data: {
                    user: {
                        id: user.id,
                        username: user.username,
                        name: user.name,
                        plan: user.plan,
                    },
                    token,
                },
            });
        } catch (error) {
            if ((error as Error).message === 'Invalid credentials') {
                return res.status(401).json({
                    status: 401,
                    message: 'Thông tin đăng nhập không chính xác',
                });
            }

            console.error('Lỗi đăng nhập:', error);
            return res.status(500).json({
                status: 500,
                message: 'Đã xảy ra lỗi khi đăng nhập',
            });
        }
    };
}
