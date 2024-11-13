import { Database } from 'sqlite';
import { nanoid } from 'nanoid';
import { createHash } from 'crypto';
import { User } from '@/models/user.model.js';
import { UserResources, Plan, SubscriptionCycle } from '@/models/types.js';

interface ResourceResponse {
  links: {
    used: number;
    total: number;
  };
  customLinks: {
    used: number;
    total: number;
  };
}

export class UserService {
    private readonly db: Database;

    constructor(db: Database) {
        this.db = db;
    }

    private hashPassword(password: string): string {
        return createHash('sha256').update(password).digest('hex');
    }

    async registerUser(
        username: string,
        password: string,
        name?: string
    ): Promise<User> {
        const hashedPassword = this.hashPassword(password);
        const userId = nanoid();

        try {
            await this.db.run('BEGIN TRANSACTION');

            await this.db.run(
                `INSERT INTO users (id, username, password, name)
                 VALUES (?, ?, ?, ?)`,
                [userId, username, hashedPassword, name ?? null]
            );

            await this.db.run(
                `INSERT INTO user_resources (id, user_id, links_used, custom_links_used)
                 VALUES (?, ?, 0, 0)`,
                [nanoid(), userId]
            );

            await this.db.run('COMMIT');

            const user = await this.db.get<User>(
                'SELECT id, username, name, plan, subscription_cycle, created_at, updated_at FROM users WHERE id = ?',
                [userId]
            );

            if (!user) {
                throw new Error('User creation failed');
            }

            return user;
        } catch (error) {
            await this.db.run('ROLLBACK');
            if ((error as Error).message.includes('UNIQUE constraint failed')) {
                throw new Error('Username already exists');
            }
            throw error;
        }
    }

    async loginUser(username: string, password: string): Promise<User> {
        const hashedPassword = this.hashPassword(password);

        const user = await this.db.get<User>(
            `SELECT id, username, name, plan, subscription_cycle, created_at, updated_at
             FROM users
             WHERE username = ? AND password = ?`,
            [username, hashedPassword]
        );

        if (!user) {
            throw new Error('Invalid credentials');
        }

        return user;
    }

    async getUserById(userId: string): Promise<User | null> {
        const user = await this.db.get<User>(
            `SELECT id, username, name, plan, subscription_cycle, created_at, updated_at
             FROM users
             WHERE id = ?`,
            [userId]
        );
        return user ?? null;
    }

    async updateUser(
        userId: string,
        updates: { name?: string; password?: string }
    ): Promise<User> {
        const setFields: string[] = [];
        const values: any[] = [];

        if (updates.name !== undefined) {
            setFields.push('name = ?');
            values.push(updates.name);
        }

        if (updates.password !== undefined) {
            setFields.push('password = ?');
            values.push(this.hashPassword(updates.password));
        }

        if (setFields.length === 0) {
            throw new Error('No fields to update');
        }

        setFields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(userId);

        await this.db.run(
            `UPDATE users
             SET ${setFields.join(', ')}
             WHERE id = ?`,
            [...values]
        );

        const updatedUser = await this.getUserById(userId);
        if (!updatedUser) {
            throw new Error('User not found');
        }

        return updatedUser;
    }

    async getUserPlan(userId: string): Promise<string> {
        const user = await this.getUserById(userId);
        return user?.plan ?? 'plan_basic';
    }

    async updateUserPlan(
        userId: string,
        plan: string,
        subscription_cycle: SubscriptionCycle
    ): Promise<void> {
        await this.db.run(
            'UPDATE users SET plan = ?, subscription_cycle = ? WHERE id = ?',
            [plan, subscription_cycle, userId]
        );
    }

    async getPlanDetails(planCode: string): Promise<{
        name: string;
        maxLinks: number;
        maxCustomLinks: number;
        features: string[];
    }> {
        const plan = await this.db.get<Plan>(
            `SELECT p.*, GROUP_CONCAT(pf.feature_name) as features
             FROM plans p
             LEFT JOIN plan_features pf ON p.id = pf.plan_id
             WHERE p.code = ?
             GROUP BY p.id, p.name, p.code, p.monthly_price, p.annual_price,
                      p.description, p.max_links, p.max_custom_links`,
            [planCode]
        );

        if (!plan) {
            throw new Error('Plan not found');
        }

        const maxLinks = plan.max_links === -1
            ? 'Không giới hạn'
            : `${plan.max_links} liên kết mỗi tháng`;

        const features = [
            maxLinks,
            'Thống kê chi tiết',
            plan.max_custom_links > 0 ? 'Tùy chỉnh liên kết' : undefined,
        ].filter((feature): feature is string => feature !== undefined);

        return {
            name: plan.name,
            maxLinks: plan.max_links,
            maxCustomLinks: plan.max_custom_links,
            features
        };
    }

    async getUserResources(userId: string): Promise<ResourceResponse> {
        const resources = await this.db.get<UserResources>(
            `SELECT links_used, custom_links_used
             FROM user_resources
             WHERE user_id = ?`,
            [userId]
        );

        if (!resources) {
            throw new Error('User resources not found');
        }

        return {
            links: {
                used: resources.links_used ?? 0,
                total: resources.max_links ?? -1,
            },
            customLinks: {
                used: resources.custom_links_used ?? 0,
                total: resources.max_custom_links ?? -1,
            }
        };
    }

    async updateUserResources(
        userId: string,
        updates: Partial<UserResources>
    ): Promise<void> {
        const setFields: string[] = [];
        const values: any[] = [];

        Object.entries(updates).forEach(([key, value]) => {
            if (value !== undefined) {
                setFields.push(`${key} = ?`);
                values.push(value);
            }
        });

        if (setFields.length === 0) {
            return;
        }

        setFields.push('last_updated = CURRENT_TIMESTAMP');
        values.push(userId);

        await this.db.run(
            `UPDATE user_resources
             SET ${setFields.join(', ')}
             WHERE user_id = ?`,
            [...values]
        );
    }
}
