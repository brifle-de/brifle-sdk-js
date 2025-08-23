interface SendContentResponse{
    id: string
}
interface CheckReceiverResponse{
    receiver: {
        type: string;
    }
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


export type {EmbbededSignatureResponse, Content, ContentActionsSignatureResponse, ContentActionsPaymentResponse, SendContentResponse, CheckReceiverResponse, ContentMeta, ContentResponse, ContentActionsResponse}