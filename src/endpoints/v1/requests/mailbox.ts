interface InboxFilter {
    state?: Array<'read' | 'unread' | 'trashed' >
    subject?: string
    sub_mailbox?: string
    type?: 'letter' | 'invoice' | 'contract'
}

interface OutboxFilter {
    state?: Array<'active' | 'trashed'>
} 

export type { InboxFilter, OutboxFilter };