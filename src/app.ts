import { initializeDatabase } from '@/config/database.js';
import { AuthController } from '@/controllers/auth.controller.js';
import { GlobalController } from '@/controllers/global.controller.js';
import { UserController } from '@/controllers/user.controller.js';
import { LinkController } from '@/controllers/link.controller.js';
import compression from 'compression';
import cors from 'cors';
import express, {
    Express,
    NextFunction,
    Request,
    RequestHandler,
    Response,
} from 'express';
import helmet from 'helmet';
import path from 'path';
import { Database } from 'sqlite';

type AsyncRequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void | Response>;

export class App {
    private readonly app: Express;
    private db!: Database;
    private authController!: AuthController;
    private userController!: UserController;
    private globalController!: GlobalController;
    private linkController!: LinkController;

    private constructor() {
        this.app = express();
    }

    public static async create(): Promise<App> {
        const app = new App();
        await app.initializeApp();
        return app;
    }

    private async initializeApp(): Promise<void> {
        try {
            this.db = await initializeDatabase();

            this.authController = new AuthController(this.db);
            this.userController = new UserController(this.db);
            this.globalController = new GlobalController(this.db);
            this.linkController = new LinkController(this.db);

            this.setupMiddleware();
            this.setupRoutes();
            this.setupSpaRoutes();
        } catch (error) {
            console.error('Failed to initialize application:', error);
            process.exit(1);
        }
    }

    private setupMiddleware(): void {
        this.app.use(
            helmet({
                crossOriginResourcePolicy: { policy: 'cross-origin' },
            })
        );
        this.app.use(cors());
        this.app.use(compression());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private wrapHandler(handler: AsyncRequestHandler): RequestHandler {
        return async (
            req: Request,
            res: Response,
            next: NextFunction
        ): Promise<void> => {
            try {
                await handler(req, res, next);
            } catch (error) {
                next(error);
            }
        };
    }

    private setupRoutes(): void {
        this.app.post(
            '/api/register',
            this.wrapHandler(this.authController.register)
        );
        this.app.post(
            '/api/login',
            this.wrapHandler(this.authController.login)
        );
        this.app.get(
            '/api/user',
            this.wrapHandler(this.userController.getProfile)
        );
        this.app.put(
            '/api/user',
            this.wrapHandler(this.userController.updateProfile)
        );
        this.app.get(
            '/api/plans',
            this.wrapHandler(this.globalController.getPlans)
        );
        this.app.post(
            '/api/links',
            this.wrapHandler(this.linkController.createLink)
        );
        this.app.get(
            '/api/links',
            this.wrapHandler(this.linkController.getLinks)
        );

        this.app.delete(
            '/api/links/:shortUrl',
            this.wrapHandler(this.linkController.deleteLink)
        );
        this.app.get(
            '/s/:shortUrl',
            this.wrapHandler(this.linkController.redirect)
        );
        this.app.put(
            '/api/links/:id',
            this.wrapHandler(this.linkController.updateLink)
        );
    }

    private setupSpaRoutes(): void {
        const __dirname = path.resolve();
        this.app.use(express.static(path.join(__dirname, 'static')));
        this.app.get('*', (req, res) => {
            if (req.url.startsWith('/api')) {
                return;
            }
            res.sendFile(path.join(__dirname, 'static', 'index.html'));
        });
    }

    public async start(port: number): Promise<void> {
        await this.initializeApp();
        this.app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
}

const port = parseInt('3000', 10);
App.create().then((app) => {
    app.start(port).catch((error) => {
        console.error('Failed to start application:', error);
        process.exit(1);
    });
});
