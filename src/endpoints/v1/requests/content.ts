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
}

interface BirthInformation {
    birth_name?: string
    date_of_birth: string
    place_of_birth: string
    nationality?: string
    given_names?: string
    last_name?: string
    postaL_address?: string    
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
     //
     reference: string
}

interface SendContentRequest {
    to: ReceiverRequest
    type: 'letter' | 'invoice' | 'contract'
    subject: string
    body: {
        type: 'application/pdf'
        // base64 encoded string
        content: string
    }[]
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

export type {SendContentRequest, ReceiverRequest, BirthInformation, PaymentDetails}