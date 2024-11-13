export interface User {
    id: string;
    username: string;
    name: string | null;
    plan: string;
    subscription_cycle: string;
    created_at: string;
    updated_at: string;
}