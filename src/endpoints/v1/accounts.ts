import { ApiV1 } from "../../api/api"
import { AccountInfo } from "./responses/accounts"
import { ApiResponse } from "./apiResponse"
import { accountsGetBasicInfo } from "../../generated/sdk.gen"
import { call, clientFor } from "../../core/transport"
import type { Client } from "../../generated/client"

class AccountsEndpoints {
    private readonly client: Client

    constructor(api: ApiV1) {
        this.client = clientFor(api)
    }

    /**
     * get the basic info of an account (name and type)
     * @param accountId - The id of the account
     */
    public getById(accountId: string): Promise<ApiResponse<AccountInfo>> {
        return call(accountsGetBasicInfo({ client: this.client, path: { id: accountId }, throwOnError: true })) as Promise<ApiResponse<AccountInfo>>
    }
}

export {
    AccountsEndpoints
}
