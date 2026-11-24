import { ApiV1 } from "../../api/api"
import { ApiResponse } from "./apiResponse"
import { InboxFilter, OutboxFilter, OutboxOptions } from "./requests/mailbox"
import { MailboxResponse } from "./responses/mailbox"
import { mailboxGetMyInbox, mailboxGetMyOutbox } from "../../generated/sdk.gen"
import { call, clientFor } from "../../core/transport"
import type { Client } from "../../generated/client"

class MailboxEndpoints {
    private readonly client: Client

    constructor(api: ApiV1) {
        this.client = clientFor(api)
    }

    /**
     * search the inbox of the logged in account
     * @param filter - the search filter
     * @param page - the page, starting at 1
     */
    public getInbox(filter: InboxFilter, page: number = 1): Promise<ApiResponse<MailboxResponse>> {
        return call(mailboxGetMyInbox({
            client: this.client,
            body: { filter: filter as Record<string, unknown>, page },
            throwOnError: true,
        })) as Promise<ApiResponse<MailboxResponse>>
    }

    /**
     * search the outbox of a tenant
     * @param tenant - the tenant id
     * @param filter - the search filter
     * @param page - the page, starting at 1
     * @param options - e.g. only the documents of one sending user
     */
    public getOutbox(tenant: string, filter: OutboxFilter, page: number = 1, options?: OutboxOptions): Promise<ApiResponse<MailboxResponse>> {
        return call(mailboxGetMyOutbox({
            client: this.client,
            path: { tenant },
            body: { filter: filter as Record<string, unknown>, page, ...(options?.sender_user ? { sender_user: options.sender_user } : {}) },
            throwOnError: true,
        })) as Promise<ApiResponse<MailboxResponse>>
    }
}

export {
    MailboxEndpoints
}
