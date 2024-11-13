import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export const initializeDatabase = async () => {
    const db = await open({
        filename: 'database.sqlite',
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            name TEXT,
            plan TEXT DEFAULT 'basic',
            subscription_cycle TEXT DEFAULT 'monthly',
            created_at TEXT DEFAULT (strftime('%H:%M %d/%m/%Y', datetime('now', '+7 hours'))),
            updated_at TEXT DEFAULT (strftime('%H:%M %d/%m/%Y', datetime('now', '+7 hours')))
        );

        CREATE TABLE IF NOT EXISTS plans (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            code TEXT UNIQUE NOT NULL,
            monthly_price INTEGER NOT NULL,
            annual_price INTEGER NOT NULL,
            description TEXT,
            max_links INTEGER,
            max_custom_links INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS plan_features (
            id TEXT PRIMARY KEY,
            plan_id TEXT NOT NULL,
            feature_name TEXT NOT NULL,
            feature_description_vi TEXT NOT NULL,
            included BOOLEAN NOT NULL DEFAULT 1,
            FOREIGN KEY (plan_id) REFERENCES plans(id),
            UNIQUE(plan_id, feature_name)
        );

        CREATE TABLE IF NOT EXISTS links (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            original_url TEXT NOT NULL,
            short_url TEXT UNIQUE NOT NULL,
            title TEXT,
            description TEXT,
            og_image TEXT,
            is_custom BOOLEAN DEFAULT 0,
            clicks INTEGER DEFAULT 0,
            created_at TEXT DEFAULT (strftime('%H:%M %d/%m/%Y', datetime('now', '+7 hours'))),
            last_clicked_at TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS link_analytics (
            id TEXT PRIMARY KEY,
            link_id TEXT NOT NULL,
            ip_address TEXT,
            user_agent TEXT,
            clicked_at TEXT DEFAULT (strftime('%H:%M %d/%m/%Y', datetime('now', '+7 hours'))),
            FOREIGN KEY (link_id) REFERENCES links(id)
        );

        CREATE TABLE IF NOT EXISTS user_resources (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            links_used INTEGER NOT NULL DEFAULT 0,
            custom_links_used INTEGER NOT NULL DEFAULT 0,
            max_links INTEGER NOT NULL DEFAULT 10,
            max_custom_links INTEGER NOT NULL DEFAULT 10,
            last_updated TEXT DEFAULT (strftime('%H:%M %d/%m/%Y', datetime('now', '+7 hours'))),
            FOREIGN KEY (user_id) REFERENCES users(id)
        );

        CREATE TRIGGER IF NOT EXISTS create_user_resources
        AFTER INSERT ON users
        BEGIN
            INSERT INTO user_resources (
                id,
                user_id,
                links_used,
                custom_links_used,
                max_links,
                max_custom_links
            )
            VALUES (
                lower(hex(randomblob(16))),
                NEW.id,
                0,
                0,
                10,
                10
            );
        END;

        CREATE TRIGGER IF NOT EXISTS update_user_timestamp
        AFTER UPDATE ON users
        BEGIN
            UPDATE users SET updated_at = strftime('%H:%M %d/%m/%Y', datetime('now', '+7 hours'))
            WHERE id = NEW.id;
        END;

        INSERT OR IGNORE INTO plans (id, name, code, monthly_price, annual_price, description, max_links, max_custom_links) VALUES
        ('plan_basic', 'Cơ bản', 'basic', 0, 0, 'Dành cho người dùng cá nhân', 10, 10),
        ('plan_pro', 'Pro', 'pro', 49000, 349000, 'Dành cho người dùng chuyên nghiệp', 50, 50),
        ('plan_enterprise', 'Enterprise', 'enterprise', 129000, 929000, 'Dành cho doanh nghiệp', -1, -1);

        INSERT OR IGNORE INTO plan_features (id, plan_id, feature_name, feature_description_vi, included) VALUES
        ('feat_basic_1', 'plan_basic', 'max_links', '10 liên kết mỗi tháng', 1),
        ('feat_basic_2', 'plan_basic', 'analytics', 'Thống kê chi tiết', 1),
        ('feat_basic_3', 'plan_basic', 'custom_links', 'Tùy chỉnh liên kết', 1),

        ('feat_pro_1', 'plan_pro', 'max_links', '50 liên kết mỗi tháng', 1),
        ('feat_pro_2', 'plan_pro', 'analytics', 'Thống kê nâng cao', 1),
        ('feat_pro_3', 'plan_pro', 'custom_links', 'Tùy chỉnh liên kết không giới hạn', 1),

        ('feat_enterprise_1', 'plan_enterprise', 'max_links', 'Liên kết không giới hạn', 1),
        ('feat_enterprise_2', 'plan_enterprise', 'analytics', 'Thống kê chuyên sâu', 1),
        ('feat_enterprise_3', 'plan_enterprise', 'custom_links', 'Tùy chỉnh hoàn toàn', 1);

        CREATE INDEX IF NOT EXISTS idx_links_user_id ON links(user_id);
        CREATE INDEX IF NOT EXISTS idx_link_analytics_link_id ON link_analytics(link_id);
        CREATE INDEX IF NOT EXISTS idx_plan_features_plan_id ON plan_features(plan_id);
        CREATE INDEX IF NOT EXISTS idx_user_resources_user_id ON user_resources(user_id);
    `);

    return db;
};