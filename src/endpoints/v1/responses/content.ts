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
}

interface ContentResponse {
    content: {content: string, type: string}
    meta: ContentMeta
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

interface ContentActionsSignatureResponse {
    document_signatures: {
        signature_ids: string[]
        signature_reference: string
    }
    embedded_signatures: {
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
        value: string
    }[]
    signature_reference: string
}

interface ContentActionsResponse {
    payments: ContentActionsPaymentResponse[]
    signatures: ContentActionsSignatureResponse[]
}


export type {SendContentResponse, CheckReceiverResponse, ContentMeta, ContentResponse, ContentActionsResponse}