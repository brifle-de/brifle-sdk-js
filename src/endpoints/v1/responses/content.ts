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
    delivered: boolean
    delivered_date: string
    read: boolean
    read_date: string
    receiver?: string
    sender?: string
    receiver_state?: 'unread' | 'read' | 'archived' | 'trashed' | 'deleted' | 'pending'
    sender_state?: 'activate' | 'activated' | 'trashed' | 'deleted' | 'pending'
    sent_date: string
    size: number
    subject: string
    type: string
    size_responsive?: number
}

interface ContentResponse {
    content: Content[]
    meta: ContentMeta
}

interface Content{
    content: string;
    type: string;
}

interface ContentActionsPaymentResponse {
    details: {
        amount: number
        currency: string
        due_date: string
        market: string
        reference: string
        iban: string
        tink_payment_id: string
    }
    link: string
}

interface CoverLetterOverviewItem {
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
    delivery_date: string
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

interface ContentActionsSignatureResponse {
    document_signatures: {
        signature_ids: string[]
        signature_reference: string
    }
    embedded_signatures: EmbbededSignatureResponse[]
    signature_reference: string
}

interface ContentActionsResponse {
    payments: ContentActionsPaymentResponse
    signatures: ContentActionsSignatureResponse
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
    ContentActionsResponse
}