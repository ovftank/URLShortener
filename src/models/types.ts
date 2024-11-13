export type SubscriptionCycle = 'monthly' | 'annual';

export interface User {
    id: string;
    username: string;
    password: string;
    name: string | null;
    plan: string;
    subscription_cycle: SubscriptionCycle;
    created_at: string;
    updated_at: string;
}

export interface Plan {
    id: string;
    name: string;
    code: string;
    monthly_price: number;
    annual_price: number;
    description: string | null;
    max_links: number;
    max_custom_links: number;
    created_at: string;
}

export interface PlanFeature {
    id: string;
    plan_id: string;
    feature_name: string;
    feature_description_vi: string;
    included: boolean;
}

export interface Link {
    id: string;
    user_id: string | null;
    original_url: string;
    short_url: string;
    title: string | null;
    description: string | null;
    og_image: string | null;
    is_custom: boolean;
    clicks: number;
    created_at: string;
    last_clicked_at: string | null;
}

export interface LinkAnalytics {
    id: string;
    link_id: string;
    ip_address: string | null;
    user_agent: string | null;
    clicked_at: string;
}

export interface UserResources {
    id: string;
    user_id: string;
    links_used: number;
    custom_links_used: number;
    last_updated: string;
    max_links: number;
    max_custom_links: number;
}