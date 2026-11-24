import { ContractSignatureField } from "../requests/contracts"

type ContractStatus = 'pending' | 'completed' | 'rejected' | 'cancelled' | 'expired'

type ContractSignerStatus = 'waiting' | 'pending' | 'awaiting_key' | 'signing' | 'signed' | 'rejected' | 'closed'

interface ContractSigner {
    id: string
    name?: string | null
    role?: string | null
    position?: number
    stage?: number
    status: ContractSignerStatus
    signature_field?: Partial<ContractSignatureField> | null
    signature_level?: string | null
    key_state?: 'unknown' | 'available' | 'missing'
    key_assurance?: string | null
    certificate_sha256?: string | null
    opened_at?: string | null
    signed_at?: string | null
    rejected_at?: string | null
    reject_reason?: string | null
}

interface ContractDocumentInfo {
    name?: string
    mime_type?: string
    size?: number
    original_sha256?: string
    current_sha256?: string
}

interface ContractResponse {
    id: string
    tenant_id: string
    title: string
    message?: string | null
    status: ContractStatus
    signature_format: 'pades' | 'xades_enveloped' | 'xades_detached'
    signature_profile?: 'B-B' | 'B-T'
    required_level: string
    signing_order: 'sequential' | 'parallel'
    current_stage?: number
    revision?: number
    document?: ContractDocumentInfo
    signers: ContractSigner[]
    external_reference?: string | null
    created_at: string
    expires_at?: string
    completed_at?: string | null
}

interface ContractListResponse {
    contracts: ContractResponse[]
    total: number
}

interface ContractEvent {
    event: 'created' | 'stage_opened' | 'signer_key_required' | 'signer_key_available' | 'signing_prepared'
        | 'signing_failed' | 'signed' | 'rejected' | 'cancelled' | 'expired' | 'completed'
    at: string
    actor_type?: 'user' | 'api_key' | 'system'
    signer_id?: string | null
    data?: Record<string, unknown>
}

interface ContractEventsResponse {
    events: ContractEvent[]
}

interface ContractSignatureInfo {
    signer_id: string
    revision?: number
    size?: number
    sha256?: string
}

interface ContractSignaturesResponse {
    signatures: ContractSignatureInfo[]
}

export type {
    ContractStatus, ContractSignerStatus, ContractSigner, ContractDocumentInfo, ContractResponse,
    ContractListResponse, ContractEvent, ContractEventsResponse, ContractSignatureInfo, ContractSignaturesResponse,
}
