interface WalletItemMeta {
    id: string
    type: string
    subject: string
    issuer?: string
    has_owner?: boolean
    immutable?: boolean
    retention_period_days?: number
    inserted_at?: string
    updated_at?: string
}

interface WalletItemResponse {
    meta: WalletItemMeta
    data: { elements: { name?: string, type?: string, value?: string }[] }
}

interface DeleteResponse {
    status: string
}

export type { WalletItemMeta, WalletItemResponse, DeleteResponse }
