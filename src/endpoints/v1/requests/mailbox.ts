interface InboxFilter {
    state?: Array<'read' | 'unread' | 'trashed' >
    subject?: string
    sub_mailbox?: string
    type?: 'letter' | 'invoice' | 'contract'

}

interface OutboxFilter {
    state?: Array<'active' | 'trashed'>
    subject?: string
    type?: 'letter' | 'invoice' | 'contract'
} 

interface OutboxOptions {
    /** only documents sent by this user of the tenant */
    sender_user?: string
}

export type { InboxFilter, OutboxFilter, OutboxOptions };