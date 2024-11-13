import { Database } from 'sqlite';
import { nanoid } from 'nanoid';
import { Link } from '@/models/types.js';

export class LinkService {
    private readonly db: Database;

    constructor(db: Database) {
        this.db = db;
    }

    async createLink(originalUrl: string, userId: string) {
        const linkId = nanoid();
        const shortUrl = nanoid(8);

        const existingLink = await this.db.get<Link>(
            'SELECT * FROM links WHERE short_url = ?',
            shortUrl
        );

        if (existingLink) {
            throw new Error('Short URL already exists');
        }

        await this.db.run(
            `INSERT INTO links (
                id, user_id, original_url, short_url
            ) VALUES (?, ?, ?, ?)`,
            linkId,
            userId,
            originalUrl,
            shortUrl
        );

        return this.getLinkByShortUrl(shortUrl);
    }

    async getLinkById(id: string) {
        return this.db.get<Link>(
            'SELECT * FROM links WHERE id = ?',
            id
        );
    }

    async getLinkByShortUrl(shortUrl: string) {
        return this.db.get<Link>(
            'SELECT * FROM links WHERE short_url = ?',
            shortUrl
        );
    }

    async getUserLinks(userId: string, params: { page?: number; limit?: number } = {}) {
        const { page = 1, limit = 10 } = params;
        const offset = (page - 1) * limit;

        const links = await this.db.all<Link[]>(
            `SELECT * FROM links
            WHERE user_id = ?
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?`,
            userId,
            limit,
            offset
        );

        const total = await this.db.get(
            'SELECT COUNT(*) as count FROM links WHERE user_id = ?',
            userId
        );

        return {
            links,
            pagination: {
                page,
                limit,
                total: total.count,
                totalPages: Math.ceil(total.count / limit),
            },
        };
    }

    async recordAnalytics(params: {
        linkId: string;
        ipAddress?: string;
        userAgent?: string;
    }) {
        const { linkId, ipAddress, userAgent } = params;

        await this.db.run(
            `UPDATE links
            SET clicks = clicks + 1,
                last_clicked_at = CURRENT_TIMESTAMP
            WHERE id = ?`,
            linkId
        );

        await this.db.run(
            `INSERT INTO link_analytics (
                id, link_id, ip_address, user_agent
            ) VALUES (?, ?, ?, ?)`,
            nanoid(),
            linkId,
            ipAddress,
            userAgent
        );
    }

    async deleteLink(shortUrl: string, userId: string) {
        const result = await this.db.run(
            'DELETE FROM links WHERE short_url = ? AND user_id = ?',
            shortUrl,
            userId
        );

        if (result.changes === 0) {
            throw new Error('Link not found or unauthorized');
        }

        return true;
    }

    async getUserResourceUsage(userId: string) {
        const [
            { count: links } = { count: 0 },
            { count: customLinks = 0 }
        ] = await Promise.all([
            this.db.get('SELECT COUNT(*) as count FROM links WHERE user_id = ?', userId),
            this.db.get('SELECT COUNT(*) as count FROM links WHERE user_id = ? AND is_custom = 1', userId)
        ]);

        return {
            links,
            customLinks
        };
    }

    async updateLink(params: {
        id: string;
        userId: string;
        updates: {
            title?: string;
            description?: string;
            ogImage?: string;
            isCustom?: boolean;
            shortUrl?: string;
            originalUrl?: string;
        };
    }) {
        const { id, userId, updates } = params;

        if (updates.shortUrl) {
            const existingLink = await this.db.get<Link>(
                'SELECT * FROM links WHERE short_url = ? AND id != (SELECT id FROM links WHERE short_url = ? AND user_id = ?)',
                updates.shortUrl,
                id,
                userId
            );

            if (existingLink) {
                throw new Error('Short URL already taken');
            }
        }

        const setFields: string[] = [];
        const values: any[] = [];

        if (updates.title !== undefined) {
            setFields.push('title = ?');
            values.push(updates.title);
        }
        if (updates.description !== undefined) {
            setFields.push('description = ?');
            values.push(updates.description);
        }
        if (updates.ogImage !== undefined) {
            setFields.push('og_image = ?');
            values.push(updates.ogImage);
        }
        if (updates.isCustom !== undefined) {
            setFields.push('is_custom = ?');
            values.push(updates.isCustom);
        }
        if (updates.shortUrl !== undefined) {
            setFields.push('short_url = ?');
            values.push(updates.shortUrl);
        }
        if (updates.originalUrl !== undefined) {
            setFields.push('original_url = ?');
            values.push(updates.originalUrl);
        }

        if (setFields.length === 0) {
            throw new Error('No fields to update');
        }

        values.push(id, userId);

        const result = await this.db.run(
            `UPDATE links
            SET ${setFields.join(', ')}
            WHERE id = ? AND user_id = ?`,
            values
        );

        if (result.changes === 0) {
            throw new Error('Link not found or unauthorized');
        }

        return this.getLinkById(id);
    }
}
