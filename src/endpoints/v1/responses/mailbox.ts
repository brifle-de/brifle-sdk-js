interface MailboxResponse {
     total: number;
     results: Meta[];
}

interface Meta {
    id: string,
    sender: string,
    receiver: string,
    read: boolean,
    read_date: string,
    size: number,
    type: string,
    delivered: boolean,
    delivered_date: string,
    sent_date: string,
    subject: string,
    sender_state?: string,
    receiver_state?: string,
    size_responsive?: number,
    /** the document has a payment attached */
    payable?: boolean,
    /** groups related documents */
    reference_number?: string,
    /** postal department the document is stored in */
    sub_mailbox?: string,
    signature_reference?: string,
}

export type { MailboxResponse, Meta };