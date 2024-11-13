import { Database } from 'sqlite';
import { Plan, PlanFeature } from '@/models/types.js';

interface PlanDetails {
    id: string;
    name: string;
    code: string;
    monthlyPrice: number;
    annualPrice: number;
    description: string | null;
    maxLinks: number;
    maxCustomLinks: number;
    features: string[];
}

export class PricingService {
    private readonly db: Database;

    constructor(db: Database) {
        this.db = db;
    }

    async getAllPlans(): Promise<PlanDetails[]> {
        const plans = await this.db.all<(Plan & { features: string })[]>(
            `SELECT p.*, GROUP_CONCAT(pf.feature_name) as features
             FROM plans p
             LEFT JOIN plan_features pf ON p.id = pf.plan_id
             GROUP BY p.id, p.name, p.code, p.monthly_price, p.annual_price,
                      p.description, p.max_links, p.max_custom_links`
        );

        return plans.map(plan => ({
            id: plan.id,
            name: plan.name,
            code: plan.code,
            monthlyPrice: plan.monthly_price,
            annualPrice: plan.annual_price,
            description: plan.description,
            maxLinks: plan.max_links,
            maxCustomLinks: plan.max_custom_links,
            features: plan.features ? plan.features.split(',') : []
        }));
    }

    async getPlanByCode(planCode: string): Promise<PlanDetails> {
        const plan = await this.db.get<Plan & { features: string }>(
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

        return {
            id: plan.id,
            name: plan.name,
            code: plan.code,
            monthlyPrice: plan.monthly_price,
            annualPrice: plan.annual_price,
            description: plan.description,
            maxLinks: plan.max_links,
            maxCustomLinks: plan.max_custom_links,
            features: plan.features ? plan.features.split(',') : []
        };
    }

    async getPlanFeatures(planId: string): Promise<PlanFeature[]> {
        return this.db.all<PlanFeature[]>(
            `SELECT * FROM plan_features WHERE plan_id = ?`,
            [planId]
        );
    }

    calculateAnnualSavings(monthlyPrice: number, annualPrice: number): number {
        const annualCostIfPaidMonthly = monthlyPrice * 12;
        return annualCostIfPaidMonthly - annualPrice;
    }

    formatLinkLimit(limit: number): string {
        return limit === -1 ? 'Không giới hạn' : `${limit} liên kết`;
    }
}
