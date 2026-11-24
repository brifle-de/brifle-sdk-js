import { ContentBody } from "../requests/content"

interface SendContentResponse{
    id: string
}
interface ReceiverCheckElementResponse{
    type: string
}
interface CheckReceiverResponse{
    receiver: ReceiverCheckElementResponse
}
interface CheckMultipleReceiversResponse{
    receivers: ReceiverCheckElementResponse[]
}

interface ContentMeta {
    /** id of the document */
    id?: string
    delivered: boolean
    delivered_date: string
    read: boolean
    read_date: string
    receiver?: string
    sender?: string
    receiver_state?: 'unread' | 'read' | 'archived' | 'trashed' | 'deleted' | 'pending' | 'registering' | 'physical'
    /** `active` is what the API returns; `activate`/`activated` are kept for compatibility */
    sender_state?: 'active' | 'activate' | 'activated' | 'trashed' | 'deleted' | 'pending'
    sent_date: string
    size: number
    subject: string
    type: string
    size_responsive?: number
    /** the user of the tenant who sent the document */
    sender_user?: string | null
    /** the identifier the receiver was addressed with; only returned to the receiver */
    receiver_identifier?: string | null
    /** postal department the document is stored in; only returned to the receiver */
    sub_mailbox?: string | null
    /** groups related documents */
    reference_number?: string | null
    /** the read receipt is hidden from the sender */
    hide_read?: boolean
    access_level?: number | null
    /** the document has a payment attached */
    payable?: boolean
    signature_reference?: string | null
}

interface ContentResponse {
    content: ContentBody[]
    meta: ContentMeta
}

interface ContentActionsPaymentResponse {
    details: {
        amount: number
        currency: string
        due_date: string
        market: string
        reference: string
        recipient_name: string
        iban: string
        tink_payment_id: string
    }
    link: string
}

interface CoverLetterOverviewItem {
    /** set on the item returned by `createCoverLetter` */
    id?: string;
    type: string;
    name: string;
    display_name: string;
    description?: string;
}

interface CoverLetterOverviewResponse {
    cover_letters: CoverLetterOverviewItem[];
}

interface DeliveryCertificateResponse {
    certificate: string
    meta: {
        id: string
        document_id: string
        type: 'aes'
    }
}

interface DeliveryStatusResponse {
    delivery_mode: string
    document_id: string
    tenant_id: string
    brifle?: DeliveryStatusBrifleResponse
    physical?: DeliveryStatusPhysicalResponse
    /**
     * @deprecated the API wraps the status in `delivery_status`; since 0.4 the SDK
     * also returns its fields at the top level. Read those instead.
     */
    delivery_status?: Omit<DeliveryStatusResponse, 'delivery_status'>
}

interface DeliveryStatusPhysicalResponse {
    deliverer: 'Deutsche Post'
    deliverer_prefix: 'dp'
    document_id: string
    last_status_check: string
    errors: DeliveryStatusPhysicalError[]
    letter_id: string
    state: 'preprocessing' | 'processing' | 'sent' | 'test_sent' | 'error' | 'unknown'
}

interface DeliveryStatusBrifleResponse {
    /** @deprecated same value as `delivered_date` (the name the API uses) */
    delivery_date: string
    delivered_date?: string
    read: boolean
}

interface DeliveryStatusPhysicalError {
    dp_error_code?: string
    dp_error_description?: string
    dp_error_date?: string
    dp_level?: string
}

interface DeliveryStatusPhysicalErr {
    errors: DeliveryStatusPhysicalError[]
}


interface EmbbededSignatureResponse {
    id: string
    created_by: string
    created_date: string
    document_signature_id: string
    due_date: string
    field_name: string
    history?: string
    purpose: string
    request_date: string
    requested_to: string
    signature_date: string
    signed_by: string
    signed_for: string
    value: string,
    status: 'pending' | 'signed' | 'rejected' 
}

interface SignatureReferenceInfo {
    managed_by?: string
    signature_fields?: unknown
    document_signatures?: unknown
}

interface ContentActionsSignatureResponse {
    document_signatures: {
        signature_ids: string[]
        signature_reference: string
    }
    embedded_signatures: EmbbededSignatureResponse[]
    /**
     * @deprecated the API returns an object here, not a string. Use
     * `signature_reference_info`, which has the same value with its real type.
     */
    signature_reference: string
    signature_reference_info?: SignatureReferenceInfo
}

interface ContentActionsWalletItem {
    id?: string
    type?: string
    subject?: string
    issuer?: string
    has_owner?: boolean
    immutable?: boolean
    retention_period_days?: number
    inserted_at?: string
    updated_at?: string
}

interface ContentActionsResponse {
    payments: ContentActionsPaymentResponse
    signatures: ContentActionsSignatureResponse
    /** wallet items attached to the document, null if there are none */
    wallet?: { items: ContentActionsWalletItem[] } | null
}


export type {
    DeliveryStatusBrifleResponse, 
    DeliveryStatusPhysicalError, 
    DeliveryStatusPhysicalErr, 
    DeliveryStatusPhysicalResponse, 
    DeliveryStatusResponse, 
    DeliveryCertificateResponse, 
    CheckMultipleReceiversResponse, 
    CheckReceiverResponse,
    CoverLetterOverviewResponse,
    CoverLetterOverviewItem,
    ContentActionsSignatureResponse, 
    ContentActionsPaymentResponse, 
    SendContentResponse, 
    ContentMeta,
    ContentResponse, 
    ContentActionsResponse,
    EmbbededSignatureResponse,
    SignatureReferenceInfo,
    ContentActionsWalletItem,
}