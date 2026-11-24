interface ReceiverRequest {
    account_id?: string
    birth_information?: BirthInformation
    email?: string    
    tel?: string
    vad_id?: string
    ssn?: string
    first_name?: string
    last_name?: string
    full_name?: string
    date_of_birth?: string
    postal_address?: PostalAddress
}

interface PostalAddress {
    city: string
    country: string
    date_of_birth?: string
    first_name: string
    house_number: string
    last_name: string,
    postcode: string
    street: string

}

interface BirthInformation {
    birth_name?: string
    date_of_birth: string
    place_of_birth: string
    nationality?: string
    given_names?: string
    last_name?: string
    postal_address?: string    
}


interface PaymentDetails{
     // amount in cents
     amount: number
     currency: 'EUR'
     description: string
     // "YYYY-MM-DD"
     due_date: string
     // destination account
     iban: string
     // name of the payment recipient
     recipient_name: string
     //
     reference: string
}

interface ContentBody {
    type: 'application/pdf'
    // base64 encoded string
    content: string
}

interface PreviewCoverLetterRequest {
    enable: boolean
    // base64 encoded pdf, only for type 'custom' without name
    data?: string | undefined
    name?: string | undefined
    type: 'default' | 'custom'
}

interface PreviewToRequest {
    address_line1: string
    address_line2?: string
    address_line3?: string
    postal_code: string
    city: string
    country: string
}

interface PreviewPaperMailRequest {
    body: ContentBody[]
    cover_letter?: PreviewCoverLetterRequest
    to: PreviewToRequest
}

interface SendContentRequest {
    to: ReceiverRequest
    type: 'letter' | 'invoice' | 'contract'
    subject: string
    delivery_certificate?: 'none' | 'aes'
    body: ContentBody[]
    fallback?: FallbackOptions,
    wallet_info?: string[]
    payment_info?: {
       details?: PaymentDetails
       // sets to true if enable integrated payment
       payable: boolean
    }
    signature_info?: {
        signature_reference: string
        requesting_signer: {
            field: string
            signer: 'sender' | 'receiver'
        }[]
    }        
}

interface FallbackPaperMailOptions {
    cover_letter?: {
        type: 'default' | 'custom'
        data?: string
        name?: string
    } | undefined
    recipient: {
        address_line1: string
        address_line2?: string
        address_line3?: string
        postal_code: string
        city: string
        country: string
    }
    test_mode: {
        email: string
        enabled: boolean
    } | undefined
}

interface FallbackOptions {
    enabled_physical_delivery: boolean
    paper_mail: FallbackPaperMailOptions
}

export type {SendContentRequest, ReceiverRequest, BirthInformation, PaymentDetails, FallbackOptions, PostalAddress, ContentBody, PreviewCoverLetterRequest, PreviewToRequest, PreviewPaperMailRequest, FallbackPaperMailOptions}