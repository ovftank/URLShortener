import { Database } from 'sqlite';
import sqlite3 from 'sqlite3';
import { User, Plan, PlanFeature, Link, LinkAnalytics } from '@/models/types.js';

export interface DatabaseModel {
    users: Database<sqlite3.Database, sqlite3.Statement>;
    plans: Database<sqlite3.Database, sqlite3.Statement>;
    planFeatures: Database<sqlite3.Database, sqlite3.Statement>;
    links: Database<sqlite3.Database, sqlite3.Statement>;
    linkAnalytics: Database<sqlite3.Database, sqlite3.Statement>;
}

export type UserRow = User;
export type PlanRow = Plan;
export type PlanFeatureRow = PlanFeature;
export type LinkRow = Link;
export type LinkAnalyticsRow = LinkAnalytics;