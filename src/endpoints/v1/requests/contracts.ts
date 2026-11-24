import { ReceiverRequest } from "./content"

/** position of a visible signature field, in PDF points (PAdES only) */
interface ContractSignatureField {
    page: number
    x: number
    y: number
    width: number
    height: number
}

interface ContractSignerRequest {
    /** who has to sign; resolved like the receiver of a letter */
    to: ReceiverRequest
    /** position in a sequential signing order, starting at 1 */
    order?: number
    role?: string | null
    signature_field?: ContractSignatureField | null
}

interface CreateContractRequest {
    title: string
    message?: string | null
    document: {
        /** base64 encoded document */
        content: string
        file_name: string
        mime_type?: string
    }
    signature_format: 'pades' | 'xades_enveloped' | 'xades_detached'
    required_level: 'm-ses' | 'm-aes'
    signing_order?: 'sequential' | 'parallel'
    signers: ContractSignerRequest[]
    /** ISO 8601 */
    expires_at?: string | null
    external_reference?: string | null
    /** repeats of a request with the same key return the contract created first */
    idempotency_key?: string | null
}

interface ListContractsOptions {
    page?: number
    page_size?: number
    status?: 'pending' | 'completed' | 'rejected' | 'cancelled' | 'expired'
}

export type { ContractSignatureField, ContractSignerRequest, CreateContractRequest, ListContractsOptions }
