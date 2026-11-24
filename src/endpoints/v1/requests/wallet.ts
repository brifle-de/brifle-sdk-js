interface WalletDataElement {
    name?: string
    /** your own id for this element */
    reference_id?: string
    type?: 'text' | 'url' | 'jwt'
    value?: string
}

interface WalletStyle {
    background_color?: string
    on_background_color?: string
    primary_color?: string
    on_primary_color?: string
    secondary_color?: string
    on_secondary_color?: string
    primary_qr_code_data?: string
    rows?: { left: string, right: string }[]
}

interface CreateWalletItemRequest {
    type: 'proof_of_ownership' | 'proof_of_permission'
    subject: string
    data: { elements: WalletDataElement[] }
    styles?: WalletStyle
    export_wallet?: { apple_wallet?: boolean, google_wallet?: boolean }
    /** ISO 8601 */
    not_before?: string | null
    /** ISO 8601 */
    expires_at?: string | null
    immutable?: boolean
    retention_period_days?: number
}

export type { WalletDataElement, WalletStyle, CreateWalletItemRequest }
