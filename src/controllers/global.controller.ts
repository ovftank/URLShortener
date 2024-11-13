import { Database } from 'sqlite';
import { Request, Response } from 'express';
import { PricingService } from '@/services/pricing.service.js';

export class GlobalController {
    private readonly pricingService: PricingService;

    constructor(db: Database) {
        this.pricingService = new PricingService(db);
    }

    getPlans = async (_req: Request, res: Response): Promise<Response> => {
        try {
            const plans = await this.pricingService.getAllPlans();

            return res.status(200).json({
                status: 200,
                message: 'Thành công',
                data: { plans }
            });
        } catch (error) {
            console.error('Error fetching plans:', error);
            return res.status(500).json({
                status: 500,
                message: 'Lỗi hệ thống'
            });
        }
    };
}
