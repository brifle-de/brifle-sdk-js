interface Tenant{
    account_id: string;
    name: string;
    image?: string;
    private: boolean;
    id: string;
}

interface TenantsResponse {
    total: number;
    tenants: Tenant[];
}

export type {
    Tenant, TenantsResponse
}